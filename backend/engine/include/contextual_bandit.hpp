#pragma once

#include <array>

constexpr int BANDIT_DIM = 4;
constexpr int NUM_ACTIONS = 4;

enum EngineAction {
    ACTION_DECREASE_DIFFICULTY = 0,
    ACTION_MAINTAIN_AND_HINT = 1,
    ACTION_INCREASE_DIFFICULTY = 2,
    ACTION_TRIGGER_REMINISCENCE = 3,
};

class LinUCBBandit {
public:
    explicit LinUCBBandit(float alpha = 1.0F);

    EngineAction SelectAction(const std::array<float, BANDIT_DIM>& context);
    void UpdateReward(EngineAction action,
                      const std::array<float, BANDIT_DIM>& context,
                      float reward);

private:
    float alpha_param;
    std::array<std::array<std::array<float, BANDIT_DIM>, BANDIT_DIM>, NUM_ACTIONS> A;
    std::array<std::array<float, BANDIT_DIM>, NUM_ACTIONS> b;

    bool Invert4x4(
        const std::array<std::array<float, BANDIT_DIM>, BANDIT_DIM>& src,
        std::array<std::array<float, BANDIT_DIM>, BANDIT_DIM>& dst) const;
};

class ContextualBandit {
public:
    int SelectAction(float cognitive_score) const;
};