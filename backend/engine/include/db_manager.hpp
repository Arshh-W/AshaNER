#pragma once

#include "contextual_bandit.hpp"

#include <cstdint>
#include <string>
#include <vector>

struct sqlite3;

struct TelemetryTick {
    int64_t timestamp_ms;
    float normalized_level;
    float error_rate;
    float latency_ms;
    float facial_valence;
    float cognitive_drift;
    EngineAction action_taken;
};

struct SessionSummary {
    std::string session_id;
    std::string patient_id;
    std::string module_id;
    int starting_level;
    int final_level;
    float avg_drift;
    float avg_valence;
    bool reminiscence_triggered;
    std::string xai_primary_factor;
    std::string xai_clinical_summary;
};

class DatabaseManager {
public:
    explicit DatabaseManager(const std::string& db_path);
    ~DatabaseManager();

    bool Open();
    void Close();
    bool SaveSession(const SessionSummary& session);
    bool LogTelemetryTicks(const std::string& session_id,
                           const std::vector<TelemetryTick>& ticks);
    std::string ExportUnsyncedJson(int max_records = 50);
    bool MarkAsSynced(const std::vector<std::string>& session_ids);

    bool LogSession(const std::string& session_id, const std::string& patient_id,
                    const std::string& module_id, float avg_cdi,
                    float avg_valence, bool triggered_reminiscence,
                    const std::string& xai_reason);

private:
    std::string db_file;
    sqlite3* db;

    bool ExecuteSimple(const char* sql);
    bool InitializeSchema();
};