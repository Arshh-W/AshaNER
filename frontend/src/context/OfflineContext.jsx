import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { syncAll } from "../services/syncService";

const Ctx = createContext(null);

export function OfflineProvider({ children }) {
    const [online, setOnline] = useState(
        typeof navigator !== "undefined"
            ? navigator.onLine
            : true
    );

    const [saved, setSaved] = useState(true);

    const [syncing, setSyncing] = useState(false);

    const [lastSync, setLastSync] = useState(null);

    const [syncError, setSyncError] = useState(null);


    /*
     * Synchronize all locally stored operations.
     */
    const synchronize = async () => {
        if (
            typeof navigator !== "undefined" &&
            !navigator.onLine
        ) {
            return {
                success: false,
                reason: "offline"
            };
        }

        setSyncing(true);
        setSyncError(null);

        try {
            const result = await syncAll();

            if (result.success) {
                setLastSync(
                    new Date().toISOString()
                );
            }

            if (result.failed > 0) {
                setSyncError(
                    `${result.failed} item(s) could not be synchronized.`
                );
            }

            return result;
        } catch (error) {
            console.warn(
                "Synchronization failed:",
                error
            );

            setSyncError(
                "Unable to synchronize saved data."
            );

            return {
                success: false,
                reason: "error",
                error
            };
        } finally {
            setSyncing(false);
        }
    };


    useEffect(() => {
        const handleOnline = () => {
            setOnline(true);

            /*
             * Give the browser a moment to restore
             * connectivity, then flush the queue.
             */
            setTimeout(() => {
                synchronize();
            }, 300);
        };

        const handleOffline = () => {
            setOnline(false);
        };

        window.addEventListener(
            "online",
            handleOnline
        );

        window.addEventListener(
            "offline",
            handleOffline
        );


        /*
         * If the app starts while already online,
         * synchronize any sessions that were saved
         * during a previous offline period.
         */
        if (
            typeof navigator !== "undefined" &&
            navigator.onLine
        ) {
            synchronize();
        }


        return () => {
            window.removeEventListener(
                "online",
                handleOnline
            );

            window.removeEventListener(
                "offline",
                handleOffline
            );
        };
    }, []);


    return (
        <Ctx.Provider
            value={{
                online,
                saved,
                setSaved,

                syncing,
                lastSync,
                syncError,

                synchronize
            }}
        >
            {children}
        </Ctx.Provider>
    );
}


export const useOffline = () => {
    const context = useContext(Ctx);

    if (!context) {
        throw new Error(
            "useOffline must be used inside OfflineProvider"
        );
    }

    return context;
};