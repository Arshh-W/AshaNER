#include "contextual_bandit.hpp"

int LinUCBBandit::SelectAction(float cognitive_score) const {
    return cognitive_score < 0.5F ? 0 : 1;
}