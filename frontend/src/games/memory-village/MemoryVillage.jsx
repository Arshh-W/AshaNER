// src/games/memory-village/MemoryVillage.jsx

import { useState } from "react";
import { villageItems, villageTasks } from "./memoryVillageData";
import "./memoryVillage.css";

const MemoryVillage = () => {
  const [currentTask, setCurrentTask] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);

  const task = villageTasks[currentTask];

  const handleItemClick = (item) => {
    if (item.id === task.targetId) {
      setFeedback("correct");

      setTimeout(() => {
        if (currentTask === villageTasks.length - 1) {
          setCompleted(true);
        } else {
          setCurrentTask((previous) => previous + 1);
          setFeedback("");
        }
      }, 1000);
    } else {
      setFeedback("try-again");

      setTimeout(() => {
        setFeedback("");
      }, 1200);
    }
  };

  const restartGame = () => {
    setCurrentTask(0);
    setFeedback("");
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="memory-village">
        <div className="memory-village-complete">
          <div className="complete-icon">🌟</div>

          <h2>Wonderful!</h2>

          <p>
            You found everyone and everything in the village.
          </p>

          <button
            className="restart-button"
            onClick={restartGame}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-village">
      <div className="memory-village-header">
        <p className="game-label">MEMORY VILLAGE</p>

        <h2>{task.instruction}</h2>

        <p className="game-hint">
          Take your time and look around the village.
        </p>

        <div className="progress">
          <span>
            {currentTask + 1} of {villageTasks.length}
          </span>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((currentTask + 1) / villageTasks.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="village">
        {villageItems.map((item) => (
          <button
            key={item.id}
            className={`village-item ${feedback === "correct" && item.id === task.targetId
              ? "correct"
              : ""
              }`}
            onClick={() => handleItemClick(item)}
            aria-label={item.name}
          >
            <span className="item-emoji">{item.emoji}</span>

            <span className="item-name">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {feedback === "correct" && (
        <div className="feedback correct-feedback">
          <span>✓</span>
          <p>Well done!</p>
        </div>
      )}

      {feedback === "try-again" && (
        <div className="feedback try-again-feedback">
          <span>💭</span>
          <p>That's okay. Have another look.</p>
        </div>
      )}
    </div>
  );
};

export default MemoryVillage;