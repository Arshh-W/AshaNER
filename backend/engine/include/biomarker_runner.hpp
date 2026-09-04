#pragma once

#include <memory>
#include <string>
#include <vector>
#include <onnxruntime_cxx_api.h>

class BiomarkerRunner {
public:
    explicit BiomarkerRunner(const std::string& model_path);
    float RunInference(const std::vector<float>& acoustic_features_32dim);

private:
    Ort::Env env;
    Ort::SessionOptions session_options;
    std::unique_ptr<Ort::Session> session;
    Ort::MemoryInfo memory_info;
    std::vector<int64_t> input_shape = {1, 1, 32};
    std::vector<int64_t> output_shape = {1, 1};
};