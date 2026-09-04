import { useEffect, useState } from "react";

export default function LoadingScreen({
    duration = 1200,
    message = "Preparing AshaNER...",
    onComplete
}) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = performance.now();

        let animationFrame;

        const updateProgress = (now) => {
            const elapsed = now - start;

            const percentage = Math.min(
                100,
                Math.round(
                    (elapsed / duration) * 100
                )
            );

            setProgress(percentage);

            if (elapsed < duration) {
                animationFrame =
                    requestAnimationFrame(
                        updateProgress
                    );
            } else {
                setProgress(100);

                if (onComplete) {
                    setTimeout(() => {
                        onComplete();
                    }, 150);
                }
            }
        };

        animationFrame =
            requestAnimationFrame(updateProgress);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [duration, onComplete]);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 999999,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "radial-gradient(circle at center, #fffdf9 0%, #faf7f1 55%, #f5f1e9 100%)",
                fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
        >
            <div
                style={{
                    width: "min(360px, 75vw)",
                    textAlign: "center"
                }}
            >
                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#123f2d",
                        marginBottom: "18px"
                    }}
                >
                    {message}
                </div>

                <div
                    style={{
                        width: "100%",
                        height: "4px",
                        background:
                            "rgba(18, 63, 45, 0.10)",
                        borderRadius: "999px",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: "100%",
                            borderRadius: "999px",
                            background:
                                "linear-gradient(90deg, #d5b63c, #e7cc67, #1c5138)",
                            transition:
                                "width 80ms linear"
                        }}
                    />
                </div>

                <div
                    style={{
                        marginTop: "12px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#6d766f"
                    }}
                >
                    {progress}%
                </div>
            </div>
        </div>
    );
}