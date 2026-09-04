import {
    add,
    getAll,
    remove,
    STORES
} from "./db";

import api from "./api";

const TELEMETRY_ENDPOINT =
    "/telemetry";

export const queueTelemetry = async (
    event
) => {
    return add(
        STORES.syncQueue,
        {
            type: "telemetry",
            method: "POST",
            endpoint: TELEMETRY_ENDPOINT,
            data: event,
            createdAt:
                new Date().toISOString()
        }
    );
};

export const sendTelemetry = async (
    event
) => {
    if (
        typeof navigator !== "undefined" &&
        !navigator.onLine
    ) {
        return queueTelemetry(event);
    }

    try {
        return await api.post(
            TELEMETRY_ENDPOINT,
            event
        );
    } catch (error) {
        await queueTelemetry(event);

        throw error;
    }
};

export const flushTelemetry = async () => {
    if (
        typeof navigator !== "undefined" &&
        !navigator.onLine
    ) {
        return {
            success: false,
            reason: "offline"
        };
    }

    const queued =
        await getAll(
            STORES.syncQueue
        );

    const telemetryItems =
        queued.filter(
            (item) =>
                item.type === "telemetry"
        );

    let sent = 0;

    for (const item of telemetryItems) {
        try {
            await api.post(
                TELEMETRY_ENDPOINT,
                item.data
            );

            await remove(
                STORES.syncQueue,
                item.id
            );

            sent += 1;
        } catch (error) {
            console.warn(
                "Telemetry flush failed:",
                error
            );
        }
    }

    return {
        success: true,
        sent
    };
};

export default {
    queueTelemetry,
    sendTelemetry,
    flushTelemetry
};