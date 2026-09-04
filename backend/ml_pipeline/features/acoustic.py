"""Acoustic prosody and spectral feature extraction for model input."""

import numpy as np
import librosa


class AcousticBiomarkerExtractor:
    def __init__(self, sample_rate: int = 16000):
        self.sr = sample_rate

    def extract_features(self, audio_data: np.ndarray) -> np.ndarray:
        """Extract a deterministic 32-dimensional acoustic feature vector."""
        audio_data = np.asarray(audio_data, dtype=np.float32)
        if audio_data.ndim > 1:
            audio_data = np.mean(audio_data, axis=1)

        total_duration = len(audio_data) / self.sr
        if total_duration < 0.2:
            return np.zeros(32, dtype=np.float32)

        intervals = librosa.effects.split(audio_data, top_db=25)
        voiced_samples = sum(end - start for start, end in intervals)
        phonation_time = voiced_samples / self.sr
        pause_ratio = max(0.0, (total_duration - phonation_time) / total_duration)

        pause_durations = [
            (intervals[index + 1][0] - intervals[index][1]) / self.sr
            for index in range(len(intervals) - 1)
            if intervals[index + 1][0] > intervals[index][1]
        ]
        mean_pause = np.mean(pause_durations) if pause_durations else 0.0
        max_pause = np.max(pause_durations) if pause_durations else 0.0
        hesitation_index = float(len(pause_durations)) / (phonation_time + 1e-4)

        f0, _, _ = librosa.pyin(
            audio_data,
            fmin=librosa.note_to_hz("C2"),
            fmax=librosa.note_to_hz("C7"),
            sr=self.sr,
        )
        valid_f0 = f0[~np.isnan(f0)] if f0 is not None else np.array([])
        if len(valid_f0) > 2:
            f0_mean = np.mean(valid_f0)
            f0_std = np.std(valid_f0)
            jitter_local = np.mean(np.abs(np.diff(valid_f0))) / (f0_mean + 1e-6)
            f0_range = np.ptp(valid_f0)
        else:
            f0_mean, f0_std, jitter_local, f0_range = 0.0, 0.0, 0.0, 0.0

        rms = librosa.feature.rms(y=audio_data)[0]
        rms_mean = np.mean(rms)
        rms_std = np.std(rms)
        shimmer_local = np.mean(np.abs(np.diff(rms))) / (rms_mean + 1e-6)
        rms_distribution = rms / (np.sum(rms) + 1e-6)
        energy_entropy = -np.sum(rms_distribution * np.log(rms + 1e-6))

        spec_cent = np.mean(librosa.feature.spectral_centroid(y=audio_data, sr=self.sr))
        spec_rolloff = np.mean(librosa.feature.spectral_rolloff(y=audio_data, sr=self.sr))
        zero_crossings = np.mean(librosa.feature.zero_crossing_rate(audio_data))
        y_harmonic, y_percussive = librosa.effects.hpss(audio_data)
        hnr_proxy = np.sum(y_harmonic**2) / (np.sum(y_percussive**2) + 1e-6)

        mfcc_means = np.mean(librosa.feature.mfcc(y=audio_data, sr=self.sr, n_mfcc=16), axis=1)
        feature_vector = np.array([
            pause_ratio, mean_pause, max_pause, hesitation_index,
            f0_mean, f0_std, jitter_local, f0_range,
            rms_mean, rms_std, shimmer_local, energy_entropy,
            spec_cent, spec_rolloff, zero_crossings, hnr_proxy,
            *mfcc_means,
        ], dtype=np.float32)
        return np.nan_to_num(feature_vector, nan=0.0, posinf=1.0, neginf=-1.0)


def normalize_features(features: np.ndarray) -> np.ndarray:
    """Return finite, float32 features with zero mean and unit variance."""
    values = np.asarray(features, dtype=np.float32)
    values = np.nan_to_num(values)
    scale = values.std()
    return (values - values.mean()) / (scale if scale > 0 else 1.0)