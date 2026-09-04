import os

import torch
import torch.nn as nn
from onnxruntime.quantization import QuantType, quantize_dynamic


class AcousticBiomarkerNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv1d(1, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool1d(1),
            nn.Flatten(),
            nn.Linear(16, 1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        return self.net(x)


os.makedirs("models", exist_ok=True)
dummy_model = AcousticBiomarkerNet().eval()
dummy_input = torch.randn(1, 1, 32)
raw_onnx = "models/biomarker.onnx"
quant_onnx = "models/biomarker_int8.onnx"

torch.onnx.export(
    dummy_model,
    dummy_input,
    raw_onnx,
    input_names=["acoustic_features"],
    output_names=["cdi_score"],
    opset_version=17,
)
quantize_dynamic(raw_onnx, quant_onnx, weight_type=QuantType.QUInt8)
os.remove(raw_onnx)
print(f"Generated target runtime artifact: {quant_onnx}")