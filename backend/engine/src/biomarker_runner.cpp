#include "biomarker_runner.hpp"

#include <stdexcept>

BiomarkerRunner::BiomarkerRunner(const std::string& model_path)
    : env(ORT_LOGGING_LEVEL_WARNING, "mace"), memory_info(Ort::MemoryInfo::CreateCpu(OrtArenaAllocator, OrtMemTypeDefault)) {
    session_options.SetIntraOpNumThreads(1);
    session_options.SetGraphOptimizationLevel(GraphOptimizationLevel::ORT_ENABLE_EXTENDED);
    session = std::make_unique<Ort::Session>(env, model_path.c_str(), session_options);
}

float BiomarkerRunner::RunInference(const std::vector<float>& features) {
    if (features.size() != 32) throw std::invalid_argument("Expected 32 acoustic features");
    Ort::Value input = Ort::Value::CreateTensor<float>(memory_info, const_cast<float*>(features.data()), features.size(), input_shape.data(), input_shape.size());
    const char* input_names[] = {"acoustic_features"};
    const char* output_names[] = {"cdi_score"};
    auto output = session->Run(Ort::RunOptions{nullptr}, input_names, &input, 1, output_names, 1);
    return output[0].GetTensorMutableData<float>()[0];
}