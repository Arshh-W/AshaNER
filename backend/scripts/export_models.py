from pathlib import Path

import torch
from onnxruntime.quantization import QuantType, quantize_dynamic

from ml_pipeline.networks.biomarker_1dcnn import AcousticBiomarkerNet
from ml_pipeline.networks.mobilenet_affect import AffectiveValenceNet


MODEL_DIR = Path(__file__).resolve().parents[1] / "models"


def finalize_and_export_affect():
    """Export the pretrained MobileNetV3 affect model as a quantized ONNX model."""
    print("Initializing AffectiveValenceNet with pretrained backbone...")
    model = AffectiveValenceNet(pretrained=True).eval()
    dummy_input = torch.randn(1, 3, 224, 224)
    raw_onnx = MODEL_DIR / "affect_net.onnx"
    quant_onnx = MODEL_DIR / "affect_net_int8.onnx"

    torch.onnx.export(
        model,
        dummy_input,
        str(raw_onnx),
        input_names=["face_tensor"],
        output_names=["affect_metrics"],
        dynamic_axes={"face_tensor": {0: "batch_size"}, "affect_metrics": {0: "batch_size"}},
        opset_version=17,
    )
    quantize_dynamic(str(raw_onnx), str(quant_onnx), weight_type=QuantType.QUInt8)
    raw_onnx.unlink()
    print(f"Exported Quantized Affect Model -> {quant_onnx}")


def finalize_and_export_acoustic():
    """Export the acoustic biomarker model as a quantized ONNX model."""
    print("Initializing AcousticBiomarkerNet...")
    model = AcousticBiomarkerNet().eval()
    dummy_input = torch.randn(1, 1, 32)
    raw_onnx = MODEL_DIR / "biomarker.onnx"
    quant_onnx = MODEL_DIR / "biomarker_int8.onnx"

    torch.onnx.export(
        model,
        dummy_input,
        str(raw_onnx),
        input_names=["acoustic_features"],
        output_names=["cdi_score"],
        opset_version=17,
    )
    quantize_dynamic(str(raw_onnx), str(quant_onnx), weight_type=QuantType.QUInt8)
    raw_onnx.unlink()
    print(f"Exported Quantized Acoustic Model -> {quant_onnx}")


if __name__ == "__main__":
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    finalize_and_export_affect()
    finalize_and_export_acoustic()