// src/games/memory-mosaic/MemoryMosaic.jsx

import React, { useState } from "react";
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
            tile ===
            image.tiles[selectedTiles.length];

        if (!isCorrect) {
            setFeedback("wrong");

            setTimeout(() => {
                setSelectedTiles([]);
                setFeedback("");
            }, 900);

            return;
        }

        setFeedback("correct");

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

                    <h2>Excellent!</h2>

                    <p>
                        You completed all the memory pictures.
                    </p>

                    <button
                        className="mosaic-button"
                        onClick={restartGame}
                    >
                        Play Again
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="memory-mosaic">

            <div className="mosaic-header">

                <p className="mosaic-label">
                    MEMORY MOSAIC
                </p>

                <h2>{image.title}</h2>

                <p>
                    {phase === "remember"
                        ? image.message
                        : "Put the picture back together."
                    }
                </p>

                <div className="mosaic-progress">
                    {imageIndex + 1} of {mosaicImages.length}
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
                    className="mosaic-button"
                    onClick={startPuzzle}
                >
                    I Remember It
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
                            ✓ Good!
                        </div>
                    )}

                    {feedback === "wrong" && (
                        <div className="mosaic-feedback">
                            That's okay. Let's try again.
                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default MemoryMosaic;