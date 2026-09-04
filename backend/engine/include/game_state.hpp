#pragma once

struct GameState {
    int difficulty = 1;
    int completed_rounds = 0;
    float cognitive_score = 0.0F;
};

class GameStateManager {
public:
    const GameState& State() const { return state; }
    void CompleteRound(float cognitive_score, bool error) {
        state.cognitive_score = cognitive_score;
        state.completed_rounds += 1;
        if (error && state.difficulty > 1) state.difficulty -= 1;
        if (!error && state.completed_rounds % 2 == 0) state.difficulty += 1;
    }

private:
    GameState state;
};