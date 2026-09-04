"""Face mesh and affect feature alignment boundary."""


def align_affect_features(face_features, audio_timestamps, face_timestamps):
    """Align the nearest face feature to each audio timestamp."""
    if not face_timestamps:
        return []
    return [
        face_features[min(range(len(face_timestamps)), key=lambda i: abs(face_timestamps[i] - timestamp))]
        for timestamp in audio_timestamps
    ]