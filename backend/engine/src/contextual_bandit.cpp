#include "contextual_bandit.hpp"

#include <algorithm>
#include <cmath>

LinUCBBandit::LinUCBBandit(float alpha)
    : alpha_param(std::max(0.0F, alpha)) {
    for (int action = 0; action < NUM_ACTIONS; ++action) {
        for (int row = 0; row < BANDIT_DIM; ++row) {
            b[action][row] = 0.0F;
            for (int column = 0; column < BANDIT_DIM; ++column) {
                A[action][row][column] = row == column ? 1.0F : 0.0F;
            }
        }
    }
}

bool LinUCBBandit::Invert4x4(
    const std::array<std::array<float, BANDIT_DIM>, BANDIT_DIM>& src,
    std::array<std::array<float, BANDIT_DIM>, BANDIT_DIM>& dst) const {
    std::array<std::array<float, 2 * BANDIT_DIM>, BANDIT_DIM> augmented{};

    for (int row = 0; row < BANDIT_DIM; ++row) {
        for (int column = 0; column < BANDIT_DIM; ++column) {
            augmented[row][column] = src[row][column];
            augmented[row][column + BANDIT_DIM] = row == column ? 1.0F : 0.0F;
        }
    }

    for (int column = 0; column < BANDIT_DIM; ++column) {
        int pivot = column;
        for (int row = column + 1; row < BANDIT_DIM; ++row) {
            if (std::fabs(augmented[row][column]) >
                std::fabs(augmented[pivot][column])) {
                pivot = row;
            }
        }
        if (std::fabs(augmented[pivot][column]) < 1e-6F) {
            return false;
        }

        std::swap(augmented[column], augmented[pivot]);
        const float pivot_value = augmented[column][column];
        for (float& value : augmented[column]) {
            value /= pivot_value;
        }

        for (int row = 0; row < BANDIT_DIM; ++row) {
            if (row == column) {
                continue;
            }
            const float factor = augmented[row][column];
            for (int j = 0; j < 2 * BANDIT_DIM; ++j) {
                augmented[row][j] -= factor * augmented[column][j];
            }
        }
    }

    for (int row = 0; row < BANDIT_DIM; ++row) {
        for (int column = 0; column < BANDIT_DIM; ++column) {
            dst[row][column] = augmented[row][column + BANDIT_DIM];
        }
    }
    return true;
}

EngineAction LinUCBBandit::SelectAction(
    const std::array<float, BANDIT_DIM>& context) {
    float best_ucb = -1e9F;
    int best_action = ACTION_MAINTAIN_AND_HINT;

    for (int action = 0; action < NUM_ACTIONS; ++action) {
        std::array<std::array<float, BANDIT_DIM>, BANDIT_DIM> inverse{};
        if (!Invert4x4(A[action], inverse)) {
            continue;
        }

        std::array<float, BANDIT_DIM> theta{};
        for (int row = 0; row < BANDIT_DIM; ++row) {
            for (int column = 0; column < BANDIT_DIM; ++column) {
                theta[row] += inverse[row][column] * b[action][column];
            }
        }

        float expected_mean = 0.0F;
        float variance = 0.0F;
        for (int row = 0; row < BANDIT_DIM; ++row) {
            expected_mean += theta[row] * context[row];
            for (int column = 0; column < BANDIT_DIM; ++column) {
                variance += context[row] * inverse[row][column] * context[column];
            }
        }

        const float ucb = expected_mean +
                          alpha_param * std::sqrt(std::max(0.0F, variance));
        if (ucb > best_ucb) {
            best_ucb = ucb;
            best_action = action;
        }
    }
    return static_cast<EngineAction>(best_action);
}

void LinUCBBandit::UpdateReward(EngineAction action,
                                const std::array<float, BANDIT_DIM>& context,
                                float reward) {
    const int action_index = static_cast<int>(action);
    if (action_index < 0 || action_index >= NUM_ACTIONS) {
        return;
    }

    for (int row = 0; row < BANDIT_DIM; ++row) {
        for (int column = 0; column < BANDIT_DIM; ++column) {
            A[action_index][row][column] += context[row] * context[column];
        }
        b[action_index][row] += reward * context[row];
    }
}

int ContextualBandit::SelectAction(float cognitive_score) const {
    return cognitive_score < 0.5F ? 0 : 1;
}