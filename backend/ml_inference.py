import base64
import io
import os
import tempfile

import librosa
import torch
from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image
from pydantic import BaseModel
import torchvision.transforms as transforms

from ml_pipeline.features.acoustic import AcousticBiomarkerExtractor
from ml_pipeline.networks.biomarker_1dcnn import AcousticBiomarkerNet
from ml_pipeline.networks.mobilenet_affect import AffectiveValenceNet


router = APIRouter(prefix="/api/v1/ml", tags=["Machine Learning"])

acoustic_extractor = AcousticBiomarkerExtractor(sample_rate=16000)
biomarker_model = AcousticBiomarkerNet().eval()
affect_model = AffectiveValenceNet(pretrained=False).eval()

transform_frame = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


class FramePayload(BaseModel):
    image_base64: str


@router.post("/analyze-speech")
async def analyze_speech(audio_file: UploadFile = File(...)):
    """Extract prosody features from an uploaded audio blob and score CDI."""
    suffix = os.path.splitext(audio_file.filename or ".audio")[1] or ".audio"
    file_descriptor, file_location = tempfile.mkstemp(suffix=suffix)
    os.close(file_descriptor)

    try:
        with open(file_location, "wb") as output_file:
            output_file.write(await audio_file.read())

        audio, _ = librosa.load(file_location, sr=16000, mono=True)
        features = acoustic_extractor.extract_features(audio)
        tensor_features = torch.tensor(features, dtype=torch.float32).view(1, 1, -1)

        with torch.no_grad():
            cdi_score = float(biomarker_model(tensor_features).item())
    except Exception as error:
        raise HTTPException(status_code=422, detail=f"Unable to analyze audio: {error}") from error
    finally:
        os.unlink(file_location)
        await audio_file.close()

    return {
        "cognitive_drift_index": round(cdi_score, 4),
        "hesitation_detected": cdi_score > 0.65,
        "message": "High word-finding latency detected" if cdi_score > 0.65 else "Speech prosody stable",
    }


@router.post("/analyze-frame")
async def analyze_frame(payload: FramePayload):
    """Analyze one browser-captured frame for valence and arousal."""
    try:
        raw_b64 = payload.image_base64.split(",", 1)[-1]
        image_bytes = base64.b64decode(raw_b64, validate=True)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor_image = transform_frame(image).unsqueeze(0)

        with torch.no_grad():
            predictions = affect_model(tensor_image).squeeze(0)

        valence = float(predictions[0].item())
        arousal = float(predictions[1].item())
        return {
            "valence": round(valence, 4),
            "arousal": round(arousal, 4),
            "distress_detected": valence < -0.4 and arousal > 0.6,
        }
    except Exception as error:
        return {
            "valence": 0.0,
            "arousal": 0.0,
            "distress_detected": False,
            "error": str(error),
        }