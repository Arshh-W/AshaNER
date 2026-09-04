#include "biomarker_runner.hpp"
#include "db_manager.hpp"

#include <iostream>
#include <vector>

int main() {
    try {
        BiomarkerRunner runner("models/biomarker_int8.onnx");
        const float score = runner.RunInference(std::vector<float>(32, 0.0F));
        DatabaseManager database("mace_sessions.db");
        database.LogSession("sanity", "demo-patient", "acoustic", score, 0.0F, false, "initial sanity run");
        std::cout << "Mace cognitive engine online. CDI score: " << score << '\n';
    } catch (const std::exception& error) {
        std::cerr << "Engine initialization failed: " << error.what() << '\n';
        return 1;
    }
    return 0;
}