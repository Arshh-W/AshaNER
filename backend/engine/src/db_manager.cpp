#include "db_manager.hpp"

#include <fstream>

namespace {
std::string JsonEscape(const unsigned char* value) {
    std::string escaped;
    if (value == nullptr) return escaped;
    for (const char* cursor = reinterpret_cast<const char*>(value); *cursor; ++cursor) {
        if (*cursor == '\\' || *cursor == '"') escaped += '\\';
        escaped += *cursor;
    }
    return escaped;
}
}

DatabaseManager::DatabaseManager(const std::string& db_path) {
    if (sqlite3_open(db_path.c_str(), &db) == SQLITE_OK) {
        InitializeSchema();
    }
}

DatabaseManager::~DatabaseManager() {
    if (db != nullptr) sqlite3_close(db);
}

void DatabaseManager::InitializeSchema() {
    const char* sql =
        "CREATE TABLE IF NOT EXISTS sessions (session_id TEXT PRIMARY KEY, patient_id TEXT, module_id TEXT, avg_cdi REAL, avg_valence REAL, triggered_reminiscence INTEGER, xai_reason TEXT);"
        "CREATE TABLE IF NOT EXISTS telemetry_ticks (tick_id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL, timestamp_ms INTEGER NOT NULL, level REAL NOT NULL, error_rate REAL NOT NULL, latency_ms REAL NOT NULL, valence REAL NOT NULL, drift REAL NOT NULL, action INTEGER NOT NULL, event_type TEXT, detail TEXT);";
    sqlite3_exec(db, sql, nullptr, nullptr, nullptr);
}

bool DatabaseManager::LogSession(const std::string& session_id, const std::string& patient_id,
                                 const std::string& module_id, float avg_cdi, float avg_valence,
                                 bool triggered_reminiscence, const std::string& xai_reason) {
    const char* sql = "INSERT OR REPLACE INTO sessions VALUES (?, ?, ?, ?, ?, ?, ?);";
    sqlite3_stmt* statement = nullptr;
    if (db == nullptr || sqlite3_prepare_v2(db, sql, -1, &statement, nullptr) != SQLITE_OK) return false;
    sqlite3_bind_text(statement, 1, session_id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 2, patient_id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 3, module_id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_double(statement, 4, avg_cdi);
    sqlite3_bind_double(statement, 5, avg_valence);
    sqlite3_bind_int(statement, 6, triggered_reminiscence ? 1 : 0);
    sqlite3_bind_text(statement, 7, xai_reason.c_str(), -1, SQLITE_TRANSIENT);
    const bool success = sqlite3_step(statement) == SQLITE_DONE;
    sqlite3_finalize(statement);
    return success;
}

bool DatabaseManager::LogTelemetryTick(const std::string& session_id, long long timestamp_ms,
                                       float level, float error_rate, float latency_ms,
                                       float valence, float drift, int action,
                                       const std::string& event_type,
                                       const std::string& detail) {
    const char* sql = "INSERT INTO telemetry_ticks (session_id, timestamp_ms, level, error_rate, latency_ms, valence, drift, action, event_type, detail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    sqlite3_stmt* statement = nullptr;
    if (db == nullptr || sqlite3_prepare_v2(db, sql, -1, &statement, nullptr) != SQLITE_OK) return false;
    sqlite3_bind_text(statement, 1, session_id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int64(statement, 2, timestamp_ms);
    sqlite3_bind_double(statement, 3, level);
    sqlite3_bind_double(statement, 4, error_rate);
    sqlite3_bind_double(statement, 5, latency_ms);
    sqlite3_bind_double(statement, 6, valence);
    sqlite3_bind_double(statement, 7, drift);
    sqlite3_bind_int(statement, 8, action);
    sqlite3_bind_text(statement, 9, event_type.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 10, detail.c_str(), -1, SQLITE_TRANSIENT);
    const bool success = sqlite3_step(statement) == SQLITE_DONE;
    sqlite3_finalize(statement);
    return success;
}

bool DatabaseManager::ExportTelemetryJson(const std::string& output_path) const {
    if (db == nullptr) return false;
    std::ofstream output(output_path);
    if (!output) return false;
    output << "{\"sessions\":[";

    sqlite3_stmt* statement = nullptr;
    const char* sql = "SELECT session_id, patient_id, module_id, avg_cdi, avg_valence, triggered_reminiscence, xai_reason FROM sessions ORDER BY rowid;";
    if (sqlite3_prepare_v2(db, sql, -1, &statement, nullptr) != SQLITE_OK) return false;
    bool first = true;
    while (sqlite3_step(statement) == SQLITE_ROW) {
        if (!first) output << ',';
        first = false;
        output << "{\"session_id\":\"" << JsonEscape(sqlite3_column_text(statement, 0))
               << "\",\"patient_id\":\"" << JsonEscape(sqlite3_column_text(statement, 1))
               << "\",\"module_id\":\"" << JsonEscape(sqlite3_column_text(statement, 2))
               << "\",\"avg_cdi\":" << sqlite3_column_double(statement, 3)
               << ",\"avg_valence\":" << sqlite3_column_double(statement, 4)
               << ",\"triggered_reminiscence\":" << (sqlite3_column_int(statement, 5) ? "true" : "false")
               << ",\"xai_reason\":\"" << JsonEscape(sqlite3_column_text(statement, 6)) << "\"}";
    }
    sqlite3_finalize(statement);
    output << "],\"telemetry_ticks\":[";

    sql = "SELECT session_id, timestamp_ms, level, error_rate, latency_ms, valence, drift, action, event_type, detail FROM telemetry_ticks ORDER BY tick_id;";
    if (sqlite3_prepare_v2(db, sql, -1, &statement, nullptr) != SQLITE_OK) return false;
    first = true;
    while (sqlite3_step(statement) == SQLITE_ROW) {
        if (!first) output << ',';
        first = false;
        output << "{\"session_id\":\"" << JsonEscape(sqlite3_column_text(statement, 0))
               << "\",\"timestamp_ms\":" << sqlite3_column_int64(statement, 1)
               << ",\"level\":" << sqlite3_column_double(statement, 2)
               << ",\"error_rate\":" << sqlite3_column_double(statement, 3)
               << ",\"latency_ms\":" << sqlite3_column_double(statement, 4)
               << ",\"valence\":" << sqlite3_column_double(statement, 5)
               << ",\"drift\":" << sqlite3_column_double(statement, 6)
               << ",\"action\":" << sqlite3_column_int(statement, 7)
               << ",\"event_type\":\"" << JsonEscape(sqlite3_column_text(statement, 8))
               << "\",\"detail\":\"" << JsonEscape(sqlite3_column_text(statement, 9)) << "\"}";
    }
    sqlite3_finalize(statement);
    output << "]}";
    return output.good();
}