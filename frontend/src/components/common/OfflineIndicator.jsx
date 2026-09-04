import { Wifi, WifiOff } from "lucide-react";
import useOnlineStatus from "../../hooks/useOnlineStatus";

export default function OfflineIndicator() {
    const isOnline =
        useOnlineStatus();

    if (isOnline) {
        return null;
    }

    return (
        <div
            className="offline-indicator"
            role="status"
            aria-live="polite"
        >
            <WifiOff size={18} />

            <span>
                You're offline. Your saved
                activities are still available.
            </span>
        </div>
    );
}