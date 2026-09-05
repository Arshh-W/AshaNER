import React, { useState } from "react";
import { useGameSession } from "../../context/GameSessionContext";
import { useLanguage } from "../../context/LanguageContext";
import { mosaicImages } from "./memoryMosaicData";
import "./memoryMosaic.css";

const shuffle = (items) => {
    return [...items].sort(() => Math.random() - 0.5);
};

const MemoryMosaic = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const [phase, setPhase] = useState("remember");
    const [tiles, setTiles] = useState([]);
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [feedback, setFeedback] = useState("");

    const { record } = useGameSession();
    const { t } = useLanguage();

    const image = mosaicImages[imageIndex];

    const startPuzzle = () => {
        setTiles(shuffle(image.tiles));
        setSelectedTiles([]);
        setPhase("puzzle");
    };

    const handleTileClick = (tile, index) => {
        if (selectedTiles.length >= image.tiles.length) {
            return;
        }

        const newSelection = [
            ...selectedTiles,
            {
                value: tile,
                index,
            },
        ];

        setSelectedTiles(newSelection);

        const isCorrect =
            tile === image.tiles[selectedTiles.length];

        if (!isCorrect) {
            record({ correct: false });
            setFeedback("wrong");

            setTimeout(() => {
                setSelectedTiles([]);
                setFeedback("");
            }, 900);

            return;
        }

        setFeedback("correct");
        record({ correct: true });

        setTimeout(() => {
            setFeedback("");

            if (newSelection.length === image.tiles.length) {
                if (imageIndex === mosaicImages.length - 1) {
                    setPhase("complete");
                } else {
                    setImageIndex((previous) => previous + 1);
                    setPhase("remember");
                    setSelectedTiles([]);
                }
            }
        }, 600);
    };

    const restartGame = () => {
        setImageIndex(0);
        setPhase("remember");
        setTiles([]);
        setSelectedTiles([]);
        setFeedback("");
    };

    if (phase === "complete") {
        return (
            <div className="memory-mosaic">
                <div className="mosaic-complete">

                    <div className="mosaic-complete-icon">
                        🧩
                    </div>

                    <h2>
                        {t(
                            "games.excellent",
                            "Excellent!"
                        )}
                    </h2>

                    <p>
                        {t(
                            "games.completedAllMemoryPictures",
                            "You completed all the memory pictures."
                        )}
                    </p>

                    <button
                        type="button"
                        className="mosaic-button"
                        onClick={restartGame}
                    >
                        {t(
                            "games.playAgain",
                            "Play Again"
                        )}
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="memory-mosaic">

            <div className="mosaic-header">

                <p className="mosaic-label">
                    {t(
                        "games.memoryMosaic",
                        "MEMORY MOSAIC"
                    )}
                </p>

                <h2>
                    {image.title}
                </h2>

                <p>
                    {phase === "remember"
                        ? image.message
                        : t(
                            "games.putPictureBackTogether",
                            "Put the picture back together."
                        )}
                </p>

                <div className="mosaic-progress">
                    {imageIndex + 1}{" "}
                    {t(
                        "common.of",
                        "of"
                    )}{" "}
                    {mosaicImages.length}
                </div>

            </div>

            {phase === "remember" && (
                <div className="mosaic-memory-image">

                    {image.tiles.map((tile, index) => (
                        <div
                            key={index}
                            className="memory-tile"
                        >
                            {tile}
                        </div>
                    ))}

                </div>
            )}

            {phase === "remember" && (
                <button
                    type="button"
                    className="mosaic-button"
                    onClick={startPuzzle}
                >
                    {t(
                        "games.iRememberIt",
                        "I Remember It"
                    )}
                </button>
            )}

            {phase === "puzzle" && (
                <>
                    <div className="mosaic-result">

                        {selectedTiles.map((tile, index) => (
                            <div
                                key={index}
                                className="result-tile"
                            >
                                {tile.value}
                            </div>
                        ))}

                        {Array.from({
                            length:
                                image.tiles.length -
                                selectedTiles.length,
                        }).map((_, index) => (
                            <div
                                key={`empty-${index}`}
                                className="empty-tile"
                            >
                                ?
                            </div>
                        ))}

                    </div>

                    <div className="mosaic-options">

                        {tiles.map((tile, index) => {
                            const used = selectedTiles.some(
                                (selected) =>
                                    selected.index === index
                            );

                            return (
                                <button
                                    type="button"
                                    key={`${tile}-${index}`}
                                    className={`mosaic-option ${
                                        used
                                            ? "tile-used"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleTileClick(
                                            tile,
                                            index
                                        )
                                    }
                                    disabled={used}
                                >
                                    {tile}
                                </button>
                            );
                        })}

                    </div>

                    {feedback === "correct" && (
                        <div className="mosaic-feedback">
                            ✓{" "}
                            {t(
                                "games.good",
                                "Good!"
                            )}
                        </div>
                    )}

                    {feedback === "wrong" && (
                        <div className="mosaic-feedback">
                            {t(
                                "games.letsTryAgain",
                                "That's okay. Let's try again."
                            )}
                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default MemoryMosaic;