import api from "./api";
import {
    STORES,
    getAll,
    remove
} from "./db";

const syncOperation = async (
    operation
) => {
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

export const queueOperation = async (
    operation
) => {
    return import("./db").then(
        ({ add }) =>
            add(
                STORES.syncQueue,
                {
                    ...operation,
                    createdAt:
                        new Date().toISOString()
                }
            )
    );
};

export const syncAll = async () => {
    if (
        typeof navigator !== "undefined" &&
        !navigator.onLine
    ) {
        return {
            success: false,
            reason: "offline"
        };
    }

    const queue = await getAll(
        STORES.syncQueue
    );

    let synced = 0;
    let failed = 0;

    for (const operation of queue) {
        try {
            await syncOperation(operation);

            if (operation.id !== undefined) {
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
        }
    }

    return {
        success: failed === 0,
        synced,
        failed
    };
};

export default {
    queueOperation,
    syncAll
};