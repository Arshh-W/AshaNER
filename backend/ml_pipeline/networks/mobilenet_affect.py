"""MobileNet-based continuous facial affect model."""

import torch
import torch.nn as nn
from torchvision.models import MobileNet_V3_Small_Weights, mobilenet_v3_small


class AffectiveValenceNet(nn.Module):
    """Predict valence in [-1, 1] and arousal in [0, 1]."""

    def __init__(self, pretrained: bool = True):
        super().__init__()
        weights = MobileNet_V3_Small_Weights.DEFAULT if pretrained else None
        base_model = mobilenet_v3_small(weights=weights)

        self.features = base_model.features
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))

        in_features = base_model.classifier[0].in_features
        self.shared_fc = nn.Sequential(
            nn.Linear(in_features, 128),
            nn.Hardswish(),
            nn.Dropout(p=0.2),
        )

        self.valence_head = nn.Sequential(
            nn.Linear(128, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Tanh(),
        )
        self.arousal_head = nn.Sequential(
            nn.Linear(128, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid(),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        features = self.shared_fc(x)
        valence = self.valence_head(features)
        arousal = self.arousal_head(features)
        return torch.cat([valence, arousal], dim=1)


def export_affect_to_onnx(output_path: str = "models/affect_net.onnx") -> None:
    model = AffectiveValenceNet(pretrained=False)
    model.eval()
    dummy_input = torch.randn(1, 3, 224, 224)

    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        input_names=["face_tensor"],
        output_names=["affect_metrics"],
        dynamic_axes={
            "face_tensor": {0: "batch_size"},
            "affect_metrics": {0: "batch_size"},
        },
        opset_version=17,
    )
    print(f"Exported affect model -> {output_path}")


if __name__ == "__main__":
    export_affect_to_onnx()