#pragma once

class ContextualBandit {
public:
    int SelectAction(float cognitive_score) const;
};