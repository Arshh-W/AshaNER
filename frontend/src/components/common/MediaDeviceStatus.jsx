import {
    Camera,
    CheckCircle2,
    CircleAlert,
    CircleX,
    LoaderCircle,
    Mic
} from "lucide-react";

import "../../assets/styles/media-device-status.css";


const STATUS_CONFIG = {

    checking: {
        label: "Checking",
        className:
            "media-device-status-checking",
        Icon: LoaderCircle
    },

    connected: {
        label: "Working",
        className:
            "media-device-status-connected",
        Icon: CheckCircle2
    },

    disconnected: {
        label: "Not connected",
        className:
            "media-device-status-disconnected",
        Icon: CircleX
    },

    "permission-denied": {
        label: "Permission denied",
        className:
            "media-device-status-permission",
        Icon: CircleAlert
    },

    unavailable: {
        label: "Unavailable",
        className:
            "media-device-status-unavailable",
        Icon: CircleX
    }

};


function DeviceItem({
    type,
    status
}) {

    const config =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.unavailable;

    const DeviceIcon =
        type === "camera"
            ? Camera
            : Mic;

    const StatusIcon =
        config.Icon;

    const label =
        type === "camera"
            ? "Camera"
            : "Microphone";


    return (
        <div
            className={`media-device-item ${config.className}`}
            title={`${label}: ${config.label}`}
            aria-label={`${label}: ${config.label}`}
        >

            <div
                className="media-device-main"
            >
                <DeviceIcon
                    size={17}
                    strokeWidth={2}
                />

                <span>
                    {label}
                </span>
            </div>


            <div
                className="media-device-state"
            >

                <span
                    className="media-device-dot"
                />

                <StatusIcon
                    className={
                        status === "checking"
                            ? "media-device-spinner"
                            : ""
                    }
                    size={14}
                    strokeWidth={2.4}
                />

                <span>
                    {config.label}
                </span>

            </div>

        </div>
    );
}


export default function MediaDeviceStatus({
    cameraStatus,
    micStatus
}) {

    return (
        <div
            className="media-device-status"
            role="status"
            aria-live="polite"
            aria-label="Camera and microphone status"
        >

            <DeviceItem
                type="camera"
                status={cameraStatus}
            />

            <span
                className="media-device-divider"
                aria-hidden="true"
            />

            <DeviceItem
                type="microphone"
                status={micStatus}
            />

        </div>
    );
}