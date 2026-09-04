import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AshaNERLogoAnimation({
    onComplete
}) {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const root = rootRef.current;

            const ring =
                root.querySelector("#asha-ring");

            const leafBase =
                root.querySelector("#asha-leaf-base");

            const leafLeft =
                root.querySelector("#asha-leaf-left");

            const leafRight =
                root.querySelector("#asha-leaf-right");

            const stem =
                root.querySelector("#asha-stem");

            const veins =
                root.querySelectorAll(".asha-vein");

            const flowerPieces =
                root.querySelectorAll(
                    ".asha-flower-piece"
                );

            const branch =
                root.querySelector("#asha-branch");

            const glow =
                root.querySelector("#asha-glow");

            const letters =
                root.querySelectorAll(
                    ".asha-letter"
                );

            const tagline =
                root.querySelector("#asha-tagline");

            const loaderProgress =
                root.querySelector(
                    "#asha-loader-progress"
                );

            if (!ring) {
                return;
            }

            const prepareStroke = (element) => {
                if (!element) {
                    return 0;
                }

                const length =
                    element.getTotalLength();

                gsap.set(element, {
                    strokeDasharray: length,
                    strokeDashoffset: length
                });

                return length;
            };

            const ringLength =
                prepareStroke(ring);

            const stemLength =
                prepareStroke(stem);

            const branchLength =
                prepareStroke(branch);

            veins.forEach(prepareStroke);

            gsap.set(ring, {
                opacity: 0,
                strokeDashoffset: ringLength
            });

            gsap.set(
                [
                    leafBase,
                    leafLeft,
                    leafRight
                ],
                {
                    opacity: 0,
                    scaleY: 0,
                    scaleX: 0.92
                }
            );

            gsap.set(stem, {
                strokeDashoffset: stemLength
            });

            veins.forEach((vein) => {
                gsap.set(vein, {
                    strokeDashoffset:
                        vein.getTotalLength()
                });
            });

            gsap.set(branch, {
                strokeDashoffset:
                    branchLength
            });

            gsap.set(flowerPieces, {
                opacity: 0,
                scale: 0
            });

            gsap.set(glow, {
                opacity: 0,
                scale: 0.85
            });

            gsap.set(letters, {
                opacity: 0,
                y: 18,
                filter: "blur(4px)"
            });

            gsap.set(tagline, {
                opacity: 0,
                y: 8
            });

            gsap.set(loaderProgress, {
                scaleX: 0
            });

            const timeline = gsap.timeline({
                onComplete: () => {
                    onComplete?.();
                }
            });

            /*
             * 1. GOLD RING
             */
            timeline.to(ring, {
                opacity: 1,
                strokeDashoffset: 0,
                duration: 0.65,
                ease: "power2.inOut"
            });

            /*
             * 2. MAIN LEAF
             */
            timeline.to(
                leafBase,
                {
                    opacity: 1,
                    scaleY: 1,
                    scaleX: 1,
                    duration: 0.55,
                    ease: "power3.out"
                },
                "-=0.35"
            );

            timeline.to(
                leafLeft,
                {
                    opacity: 0.82,
                    scaleY: 1,
                    scaleX: 1,
                    duration: 0.4,
                    ease: "power2.out"
                },
                "-=0.3"
            );

            timeline.to(
                leafRight,
                {
                    opacity: 0.9,
                    scaleY: 1,
                    scaleX: 1,
                    duration: 0.4,
                    ease: "power2.out"
                },
                "-=0.35"
            );

            /*
             * 3. STEM
             */
            timeline.to(
                stem,
                {
                    strokeDashoffset: 0,
                    duration: 0.4,
                    ease: "power2.inOut"
                },
                "-=0.25"
            );

            /*
             * 4. VEINS
             */
            timeline.to(
                veins,
                {
                    strokeDashoffset: 0,
                    duration: 0.3,
                    stagger: 0.035,
                    ease: "power2.out"
                },
                "-=0.2"
            );

            /*
             * 5. ORANGE BRANCH
             */
            timeline.to(
                branch,
                {
                    strokeDashoffset: 0,
                    duration: 0.3,
                    ease: "power2.out"
                },
                "-=0.15"
            );

            /*
             * 6. FLOWER
             */
            timeline.to(
                flowerPieces,
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    stagger: 0.04,
                    ease: "back.out(1.8)"
                },
                "-=0.1"
            );

            /*
             * 7. ASHANER WORDMARK
             */
            timeline.to(
                letters,
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.32,
                    stagger: 0.035,
                    ease: "power3.out"
                },
                "-=0.1"
            );

            /*
             * 8. TAGLINE
             */
            timeline.to(
                tagline,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.35,
                    ease: "power2.out"
                },
                "-=0.18"
            );

            /*
             * 9. GLOW
             */
            timeline.to(
                glow,
                {
                    opacity: 0.12,
                    scale: 1,
                    duration: 0.25,
                    ease: "power2.out"
                },
                "-=0.15"
            );

            /*
             * LOADING BAR
             */
            gsap.to(loaderProgress, {
                scaleX: 1,
                duration: timeline.duration(),
                ease: "none"
            });
        }, rootRef);

        return () => {
            ctx.revert();
        };
    }, [onComplete]);

    return (
        <div
            ref={rootRef}
            className="asha-intro"
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                zIndex: 99999
            }}
        >

            {/* LOGO STAGE */}

            <div
                className="asha-animation-stage"
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: "780px",
                    maxWidth: "82vw",
                    margin: 0,
                    marginLeft:170,
                    padding: 0,
                    transform: "translate(-50%, -50%)"
                }}
            >

                <svg
                    className="asha-animation-logo"
                    viewBox="0 0 1000 260"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="AshaNER"
                    style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        overflow: "visible"
                    }}
                >

                    <defs>

                        <filter
                            id="asha-soft-glow"
                            x="-100%"
                            y="-100%"
                            width="300%"
                            height="300%"
                        >
                            <feGaussianBlur
                                stdDeviation="4"
                                result="blur"
                            />

                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient
                            id="asha-sweep-gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop
                                offset="0%"
                                stopColor="white"
                                stopOpacity="0"
                            />

                            <stop
                                offset="45%"
                                stopColor="white"
                                stopOpacity=".7"
                            />

                            <stop
                                offset="55%"
                                stopColor="white"
                                stopOpacity=".7"
                            />

                            <stop
                                offset="100%"
                                stopColor="white"
                                stopOpacity="0"
                            />
                        </linearGradient>

                    </defs>

                    {/* LOGO MARK */}

                    <g>

                        {/* GOLD RING */}

                        <circle
                            id="asha-ring"
                            className="asha-ring"
                            cx="125"
                            cy="130"
                            r="77"
                            fill="none"
                            stroke="#d5b63c"
                            strokeWidth="4"
                        />

                        {/* INNER CIRCLE */}

                        <circle
                            cx="125"
                            cy="130"
                            r="67"
                            fill="#fffdf8"
                        />

                        {/* MAIN LEAF */}

                        <path
                            id="asha-leaf-base"
                            className="asha-leaf-base"
                            d="
                                M125 207
                                C92 184 75 151 82 119
                                C87 91 104 67 125 43
                                C146 67 163 91 168 119
                                C175 151 158 184 125 207
                                Z
                            "
                            fill="#123f2d"
                        />

                        {/* LEFT LEAF */}

                        <path
                            id="asha-leaf-left"
                            className="asha-leaf-left"
                            d="
                                M125 201
                                C104 181 91 153 92 125
                                C93 99 107 70 125 48
                                C121 88 118 131 125 201
                                Z
                            "
                            fill="#1c5138"
                        />

                        {/* RIGHT LEAF */}

                        <path
                            id="asha-leaf-right"
                            className="asha-leaf-right"
                            d="
                                M125 201
                                C145 179 158 153 158 126
                                C158 99 143 70 125 48
                                C130 88 133 132 125 201
                                Z
                            "
                            fill="#245d40"
                        />

                        {/* STEM */}

                        <path
                            id="asha-stem"
                            className="asha-stem"
                            d="
                                M125 197
                                C124 158 124 118 125 70
                            "
                            fill="none"
                            stroke="#d5b63c"
                            strokeWidth="4"
                        />

                        {/* VEINS */}

                        <g>

                            <path
                                className="asha-vein"
                                d="
                                    M124 111
                                    C113 103 105 95 100 85
                                "
                                fill="none"
                                stroke="#d5b63c"
                                strokeWidth="2.6"
                            />

                            <path
                                className="asha-vein"
                                d="
                                    M124 130
                                    C112 123 103 116 97 106
                                "
                                fill="none"
                                stroke="#d5b63c"
                                strokeWidth="2.6"
                            />

                            <path
                                className="asha-vein"
                                d="
                                    M124 150
                                    C113 144 105 138 99 129
                                "
                                fill="none"
                                stroke="#d5b63c"
                                strokeWidth="2.4"
                            />

                            <path
                                className="asha-vein"
                                d="
                                    M126 105
                                    C137 98 145 90 150 81
                                "
                                fill="none"
                                stroke="#d5b63c"
                                strokeWidth="2.6"
                            />

                            <path
                                className="asha-vein"
                                d="
                                    M126 126
                                    C138 120 147 112 153 102
                                "
                                fill="none"
                                stroke="#d5b63c"
                                strokeWidth="2.6"
                            />

                            <path
                                className="asha-vein"
                                d="
                                    M126 148
                                    C138 142 146 135 151 126
                                "
                                fill="none"
                                stroke="#d5b63c"
                                strokeWidth="2.4"
                            />

                        </g>

                        {/* FLOWER */}

                        <g>

                            <path
                                id="asha-branch"
                                className="asha-branch"
                                d="
                                    M125 132
                                    C132 124 139 119 146 116
                                "
                                fill="none"
                                stroke="#df633c"
                                strokeWidth="3"
                            />

                            <ellipse
                                className="asha-flower-piece"
                                cx="145"
                                cy="112"
                                rx="5"
                                ry="9"
                                fill="#df633c"
                                transform="rotate(35 145 112)"
                            />

                            <ellipse
                                className="asha-flower-piece"
                                cx="151"
                                cy="117"
                                rx="5"
                                ry="9"
                                fill="#df633c"
                                transform="rotate(95 151 117)"
                            />

                            <ellipse
                                className="asha-flower-piece"
                                cx="145"
                                cy="122"
                                rx="5"
                                ry="9"
                                fill="#df633c"
                                transform="rotate(155 145 122)"
                            />

                            <circle
                                className="asha-flower-piece"
                                cx="146"
                                cy="117"
                                r="3.5"
                                fill="#e7c84f"
                            />

                        </g>

                        {/* GLOW */}

                        <circle
                            id="asha-glow"
                            className="asha-glow"
                            cx="125"
                            cy="130"
                            r="73"
                            fill="none"
                            stroke="#e7cc67"
                            strokeWidth="2"
                            filter="url(#asha-soft-glow)"
                        />

                    </g>

                    {/* WORDMARK */}

                    <text
                        x="235"
                        y="135"
                        fontSize="66"
                        fontWeight="700"
                        letterSpacing="-2.8"
                        fill="#123f2d"
                    >
                        <tspan className="asha-letter">
                            A
                        </tspan>

                        <tspan className="asha-letter">
                            s
                        </tspan>

                        <tspan className="asha-letter">
                            h
                        </tspan>

                        <tspan className="asha-letter">
                            a
                        </tspan>

                        <tspan className="asha-letter">
                            N
                        </tspan>

                        <tspan className="asha-letter">
                            E
                        </tspan>

                        <tspan className="asha-letter">
                            R
                        </tspan>
                    </text>

                    {/* TAGLINE */}

                    <text
                        id="asha-tagline"
                        className="asha-tagline"
                        x="238"
                        y="170"
                        fontSize="21"
                        fill="#68706b"
                        letterSpacing=".15"
                    >
                        Cognitive Care &amp; Memory Assistance
                    </text>

                </svg>

            </div>

            {/* LOADING BAR */}

            <div
                className="asha-animation-loader"
                style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "42px",
                    width: "260px",
                    margin: 0,
                    transform:
                        "translateX(-50%)"
                }}
            >
                <div className="asha-loader-track">
                    <div
                        id="asha-loader-progress"
                        className="asha-loader-progress"
                    />
                </div>
            </div>

        </div>
    );
}