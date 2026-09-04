import torch.nn as nn


class AcousticBiomarkerNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv1d(1, 16, 3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool1d(1),
            nn.Flatten(),
            nn.Linear(16, 1),
            nn.Sigmoid(),
        )

    def forward(self, features):
        return self.net(features)


Biomarker1DCNN = AcousticBiomarkerNet