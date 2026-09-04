import os
import tempfile

import librosa
import torch
from fastapi import APIRouter, File, HTTPException, UploadFile

from ml_pipeline.features.acoustic import AcousticBiomarkerExtractor
from ml_pipeline.networks.biomarker_1dcnn import AcousticBiomarkerNet


router = APIRouter(prefix="/api/v1/ml", tags=["Machine Learning"])

acoustic_extractor = AcousticBiomarkerExtractor(sample_rate=16000)
biomarker_model = AcousticBiomarkerNet().eval()


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