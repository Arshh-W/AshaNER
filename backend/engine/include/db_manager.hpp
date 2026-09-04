#pragma once

#include <sqlite3.h>
#include <string>

class DatabaseManager {
public:
    explicit DatabaseManager(const std::string& db_path);
    ~DatabaseManager();
    bool LogSession(const std::string& session_id, const std::string& patient_id,
                    const std::string& module_id, float avg_cdi, float avg_valence,
                    bool triggered_reminiscence, const std::string& xai_reason);

private:
    sqlite3* db = nullptr;
    void InitializeSchema();
};