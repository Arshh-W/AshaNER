#pragma once

#include "contextual_bandit.hpp"

#include <algorithm>
#include <array>

struct GameState {
    int difficulty = 1;
    int completed_rounds = 0;
    float cognitive_score = 0.0F;
};

struct PatientSessionTelemetry {
    float normalized_level;
    float rolling_error_rate;
    float response_latency_ratio;
    float facial_valence;
    float cognitive_drift_index;
};

class GameStateManager {
public:
    GameStateManager() : bandit(1.2F), current_difficulty(1) {}

    EngineAction ProcessTelemetry(const PatientSessionTelemetry& telemetry) {
        if (telemetry.facial_valence < -0.45F &&
            telemetry.cognitive_drift_index > 0.60F) {
            return ACTION_TRIGGER_REMINISCENCE;
        }

        const std::array<float, BANDIT_DIM> context = {
            telemetry.normalized_level,
            telemetry.rolling_error_rate,
            telemetry.response_latency_ratio,
            telemetry.facial_valence,
        };
        const EngineAction decision = bandit.SelectAction(context);
        ApplyAction(decision);
        return decision;
    }

    void FinalizeRound(const PatientSessionTelemetry& telemetry,
                       EngineAction action) {
        const float flow_bonus = telemetry.rolling_error_rate >= 0.10F &&
                                         telemetry.rolling_error_rate <= 0.25F
                                     ? 1.0F
                                     : -0.5F;
        const float reward = flow_bonus + 1.5F * telemetry.facial_valence -
                             0.8F * telemetry.cognitive_drift_index;
        const std::array<float, BANDIT_DIM> context = {
            telemetry.normalized_level,
            telemetry.rolling_error_rate,
            telemetry.response_latency_ratio,
            telemetry.facial_valence,
        };
        bandit.UpdateReward(action, context, reward);
    }

    int GetCurrentDifficulty() const { return current_difficulty; }

private:
    LinUCBBandit bandit;
    int current_difficulty;

    void ApplyAction(EngineAction action) {
        if (action == ACTION_INCREASE_DIFFICULTY) {
            current_difficulty = std::min(5, current_difficulty + 1);
        } else if (action == ACTION_DECREASE_DIFFICULTY) {
            current_difficulty = std::max(1, current_difficulty - 1);
        }
    }
};