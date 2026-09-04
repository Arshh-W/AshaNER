#pragma once

class LinUCBBandit {
public:
    int SelectAction(float cognitive_score) const;
};

using ContextualBandit = LinUCBBandit;