export const useOfflineSync=()=>({sync:async()=>true,lastSync:"Just now"});
import {
    useCallback,
    useEffect,
    useState
} from "react";

import useOnlineStatus from "./useOnlineStatus";
import { syncAll } from "../services/syncService";

const useOfflineSync = () => {
    const isOnline = useOnlineStatus();

    const [isSyncing, setIsSyncing] =
        useState(false);

    const [lastSync, setLastSync] =
        useState(null);

    const [syncError, setSyncError] =
        useState(null);

    const sync = useCallback(async () => {
        if (!navigator.onLine) {
            return {
                success: false,
                reason: "offline"
            };
        }

        if (isSyncing) {
            return {
                success: false,
                reason: "syncing"
            };
        }

        try {
            setIsSyncing(true);
            setSyncError(null);

            const result = await syncAll();

            if (result?.success) {
                setLastSync(new Date());
            } else {
                setSyncError(
                    result?.error ||
                    result?.reason ||
                    "Synchronization failed"
                );
            }

            return result;
        } catch (error) {
            setSyncError(
                error?.message ||
                "Synchronization failed"
            );

            return {
                success: false,
                error:
                    error?.message ||
                    "Synchronization failed"
            };
        } finally {
            setIsSyncing(false);
        }
    }, [isSyncing]);

    useEffect(() => {
        if (!isOnline) {
            return;
        }

        sync();
    }, [isOnline, sync]);

    useEffect(() => {
        const handleOnline = () => {
            sync();
        };

        window.addEventListener(
            "online",
            handleOnline
        );

        return () => {
            window.removeEventListener(
                "online",
                handleOnline
            );
        };
    }, [sync]);

    return {
        isOnline,
        isSyncing,
        lastSync,
        syncError,
        sync
    };
};

export default useOfflineSync;