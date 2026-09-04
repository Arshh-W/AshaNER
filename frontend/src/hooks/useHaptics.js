export const useHaptics=()=>({tap:()=>navigator.vibrate?.(25),success:()=>navigator.vibrate?.([30,40,30])});
import { useCallback } from "react";

const useHaptics = () => {
    const isSupported =
        typeof navigator !== "undefined" &&
        typeof navigator.vibrate === "function";

    const vibrate = useCallback(
        (pattern = 50) => {
            if (!isSupported) {
                return false;
            }

            try {
                return navigator.vibrate(pattern);
            } catch (error) {
                console.warn(
                    "Haptic feedback failed:",
                    error
                );

                return false;
            }
        },
        [isSupported]
    );

    const light = useCallback(() => {
        return vibrate(30);
    }, [vibrate]);

    const medium = useCallback(() => {
        return vibrate(60);
    }, [vibrate]);

    const heavy = useCallback(() => {
        return vibrate(100);
    }, [vibrate]);

    const success = useCallback(() => {
        return vibrate([
            40,
            40,
            80
        ]);
    }, [vibrate]);

    const error = useCallback(() => {
        return vibrate([
            100,
            50,
            100
        ]);
    }, [vibrate]);

    const selection = useCallback(() => {
        return vibrate(20);
    }, [vibrate]);

    return {
        isSupported,
        vibrate,
        light,
        medium,
        heavy,
        success,
        error,
        selection
    };
};

export default useHaptics;