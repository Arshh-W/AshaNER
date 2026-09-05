import api from "./api";
import {
    STORES,
    getAll,
    remove
} from "./db";

let syncPromise = null;


const syncOperation = async (operation) => {
    if (!operation) {
        return;
    }

    const {
        method = "POST",
        endpoint,
        data
    } = operation;

    if (!endpoint) {
        throw new Error(
            "Sync operation is missing an endpoint."
        );
    }

    const normalizedMethod =
        method.toLowerCase();

    if (normalizedMethod === "get") {
        return api.get(endpoint);
    }

    if (normalizedMethod === "post") {
        return api.post(
            endpoint,
            data
        );
    }

    if (normalizedMethod === "put") {
        return api.put(
            endpoint,
            data
        );
    }

    if (normalizedMethod === "patch") {
        return api.patch(
            endpoint,
            data
        );
    }

    if (normalizedMethod === "delete") {
        return api.delete(endpoint);
    }

    throw new Error(
        `Unsupported sync method: ${method}`
    );
};


/*
 * Add an operation to the offline queue.
 *
 * The operation is ALWAYS stored locally first.
 *
 * If the device is online, synchronization is triggered
 * in the background.
 */
export const queueOperation = async (operation) => {
    const { add } = await import("./db");

    if (!operation) {
        throw new Error(
            "Cannot queue an empty sync operation."
        );
    }

    const queuedOperation = {
        ...operation,
        createdAt:
            new Date().toISOString()
    };

    const id = await add(
        STORES.syncQueue,
        queuedOperation
    );

    /*
     * Do not await this.
     *
     * The game should never be blocked by network
     * synchronization.
     *
     * syncAll() has its own concurrency protection.
     */
    if (
        typeof navigator !== "undefined" &&
        navigator.onLine
    ) {
        syncAll().catch((error) => {
            console.warn(
                "Background synchronization failed:",
                error
            );
        });
    }

    return id;
};


/*
 * Synchronize all queued operations.
 *
 * IMPORTANT:
 * Only ONE syncAll() operation is allowed to run
 * at a time.
 *
 * Without this lock, several game completions can
 * read the same IndexedDB queue entry and all send
 * the same local_session_id to the backend.
 */
export const syncAll = async () => {
    /*
     * If synchronization is already running,
     * return the existing promise instead of starting
     * another synchronization process.
     */
    if (syncPromise) {
        return syncPromise;
    }

    syncPromise = (async () => {
        if (
            typeof navigator !== "undefined" &&
            !navigator.onLine
        ) {
            return {
                success: false,
                reason: "offline",
                synced: 0,
                failed: 0
            };
        }

        const queue = await getAll(
            STORES.syncQueue
        );

        let synced = 0;
        let failed = 0;

        for (const operation of queue) {
            /*
             * The user may have gone offline while the
             * synchronization loop was running.
             */
            if (
                typeof navigator !== "undefined" &&
                !navigator.onLine
            ) {
                break;
            }

            try {
                await syncOperation(operation);

                /*
                 * Only remove the local operation AFTER
                 * the backend confirms success.
                 */
                if (
                    operation.id !== undefined
                ) {
                    await remove(
                        STORES.syncQueue,
                        operation.id
                    );
                }

                synced += 1;
            } catch (error) {
                failed += 1;

                console.warn(
                    "Failed to sync operation:",
                    error
                );

                /*
                 * Leave the failed operation in IndexedDB.
                 *
                 * It can be retried on the next sync.
                 */
            }
        }

        return {
            success: failed === 0,
            synced,
            failed
        };
    })();

    try {
        return await syncPromise;
    } finally {
        /*
         * Release the lock after synchronization
         * completely finishes.
         */
        syncPromise = null;
    }
};


export default {
    queueOperation,
    syncAll
};