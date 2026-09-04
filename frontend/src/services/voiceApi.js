import api from "./api";

export const sendVoiceCommand = async (
    command
) => {
    return api.post(
        "/voice/command",
        {
            command
        }
    );
};

export const getVoiceSettings = async () => {
    return api.get(
        "/voice/settings"
    );
};

export const updateVoiceSettings =
    async (settings) => {
        return api.put(
            "/voice/settings",
            settings
        );
    };

export default {
    sendVoiceCommand,
    getVoiceSettings,
    updateVoiceSettings
};