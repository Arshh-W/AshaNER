#include "biomarker_runner.hpp"
#include "contextual_bandit.hpp"
#include "db_manager.hpp"
#include "game_state.hpp"

#include <fstream>
#include <iostream>
#include <memory>
#include <vector>

int main() {
    constexpr const char* session_id = "demo-session-001";
    constexpr const char* patient_id = "demo-patient";
    DatabaseManager database("mace_sessions.db");
    LinUCBBandit bandit;
    GameStateManager game;
    std::unique_ptr<BiomarkerRunner> biomarker_runner;

    try {
        std::ifstream model("models/biomarker_int8.onnx");
        if (model.good()) biomarker_runner = std::make_unique<BiomarkerRunner>("models/biomarker_int8.onnx");
    } catch (const std::exception& error) {
        std::cerr << "Biomarker model unavailable; using deterministic mock scores: " << error.what() << '\n';
    }

    if (biomarker_runner) {
        try {
            const float model_score = biomarker_runner->RunInference(std::vector<float>(32, 0.0F));
            std::cout << "Biomarker inference probe: " << model_score << '\n';
        } catch (const std::exception& error) {
            std::cerr << "Biomarker inference probe failed: " << error.what() << '\n';
        }
    }

    const std::vector<float> cognitive_scores = {0.72F, 0.31F, 0.28F};
    const std::vector<float> hesitation_seconds = {0.4F, 1.1F, 3.1F};
    const std::vector<float> valences = {0.4F, 0.1F, -0.6F};
    bool triggered_reminiscence = false;
    float total_score = 0.0F;
    float total_valence = 0.0F;

    for (std::size_t round = 0; round < cognitive_scores.size(); ++round) {
        const float score = cognitive_scores[round];
        const float valence = valences[round];
        const bool distress = hesitation_seconds[round] >= 2.5F || valence <= -0.5F;
        const int action = bandit.SelectAction(score);
        game.CompleteRound(score, distress);
        total_score += score;
        total_valence += valence;

        database.LogTelemetryTick(
            session_id, 1000LL * static_cast<long long>(round + 1),
            static_cast<float>(game.State().difficulty), distress ? 1.0F : 0.0F,
            hesitation_seconds[round] * 1000.0F, valence, distress ? 1.0F : 0.0F,
            action, "game_tick", distress ? "facial distress and hesitation" : "game round completed");

        std::cout << "Round " << round + 1 << ": action=" << action
                  << ", CDI=" << score << ", hesitation=" << hesitation_seconds[round] << "s\n";
        if (distress && !triggered_reminiscence) {
            triggered_reminiscence = true;
            database.LogTelemetryTick(
                session_id, 1000LL * static_cast<long long>(round + 1),
                static_cast<float>(game.State().difficulty), 1.0F,
                hesitation_seconds[round] * 1000.0F, valence, 1.0F, 3,
                "module_transition", "reminiscence_art_therapy");
            std::cout << "Transition: Reminiscence Art Therapy\n";
        }
    }

    database.LogSession(
        session_id, patient_id,
        triggered_reminiscence ? "reminiscence_art_therapy" : "cognitive_game",
        total_score / cognitive_scores.size(), total_valence / valences.size(),
        triggered_reminiscence,
        triggered_reminiscence ? "Hesitation and facial distress threshold exceeded"
                               : "Stable game session");
    if (!database.ExportTelemetryJson("mace_telemetry.json")) {
        std::cerr << "Unable to export telemetry JSON\n";
        return 1;
    }
    std::cout << "Telemetry exported to mace_telemetry.json\n";
    return 0;
}