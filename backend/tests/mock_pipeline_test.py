import math


def simulate_jitter(frequencies):
    if len(frequencies) < 2:
        return 0.0
    diffs = [abs(frequencies[i] - frequencies[i - 1]) for i in range(1, len(frequencies))]
    mean_f0 = sum(frequencies) / len(frequencies)
    return (sum(diffs) / len(diffs)) / (mean_f0 + 1e-6)


normal_voice = [210.0, 211.2, 209.8, 210.5]
hesitant_voice = [180.0, 240.5, 175.2, 230.1]

jitter_normal = simulate_jitter(normal_voice)
jitter_hesitant = simulate_jitter(hesitant_voice)

assert jitter_hesitant > jitter_normal, "Validation Failed: Hesitant voice must yield higher jitter"
print("Acoustic Math Simulation: PASSED")