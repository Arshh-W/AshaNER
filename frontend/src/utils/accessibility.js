export const clampFontSize = (
    size,
    min = 14,
    max = 32
) => {
    const value = Number(size);

    if (Number.isNaN(value)) {
        return min;
    }

    return Math.min(
        Math.max(value, min),
        max
    );
};

export const applyFontSize = (
    size
) => {
    const fontSize =
        clampFontSize(size);

    document.documentElement.style.setProperty(
        "--app-font-size",
        `${fontSize}px`
    );

    return fontSize;
};

export const setHighContrast = (
    enabled
) => {
    document.documentElement.classList.toggle(
        "high-contrast",
        Boolean(enabled)
    );
};

export const setReducedMotion = (
    enabled
) => {
    document.documentElement.classList.toggle(
        "reduce-motion",
        Boolean(enabled)
    );
};

export const setAccessibilitySettings =
    (settings = {}) => {
        if (
            settings.fontSize !== undefined
        ) {
            applyFontSize(
                settings.fontSize
            );
        }

        if (
            settings.highContrast !== undefined
        ) {
            setHighContrast(
                settings.highContrast
            );
        }

        if (
            settings.reducedMotion !== undefined
        ) {
            setReducedMotion(
                settings.reducedMotion
            );
        }
    };

export default {
    clampFontSize,
    applyFontSize,
    setHighContrast,
    setReducedMotion,
    setAccessibilitySettings
};