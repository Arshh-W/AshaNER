#include "db_manager.hpp"

#include <sqlite3.h>

#include <algorithm>
#include <iomanip>
#include <sstream>

namespace {
std::string JsonEscape(const unsigned char* value) {
    if (value == nullptr) return {};
    std::ostringstream escaped;
    for (const char* current = reinterpret_cast<const char*>(value); *current; ++current) {
        switch (*current) {
        case '"': escaped << "\\\""; break;
        case '\\': escaped << "\\\\"; break;
        case '\n': escaped << "\\n"; break;
        case '\r': escaped << "\\r"; break;
        case '\t': escaped << "\\t"; break;
        default: escaped << *current; break;
        }
    }
    return escaped.str();
}
}

DatabaseManager::DatabaseManager(const std::string& db_path)
    : db_file(db_path), db(nullptr) {
    Open();
}

DatabaseManager::~DatabaseManager() { Close(); }

bool DatabaseManager::ExecuteSimple(const char* sql) {
    if (db == nullptr) return false;
    char* error_message = nullptr;
    const int result = sqlite3_exec(db, sql, nullptr, nullptr, &error_message);
    sqlite3_free(error_message);
    return result == SQLITE_OK;
}

bool DatabaseManager::Open() {
    if (db != nullptr) return true;
    if (sqlite3_open(db_file.c_str(), &db) != SQLITE_OK) {
        Close();
        return false;
    }
    if (!ExecuteSimple("PRAGMA journal_mode = WAL;") ||
        !ExecuteSimple("PRAGMA synchronous = NORMAL;") ||
        !ExecuteSimple("PRAGMA foreign_keys = ON;") || !InitializeSchema()) {
        Close();
        return false;
    }
    return true;
}

void DatabaseManager::Close() {
    if (db != nullptr) {
        sqlite3_close(db);
        db = nullptr;
    }
}

bool DatabaseManager::InitializeSchema() {
    const char* schema = R"SQL(
        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY, patient_id TEXT NOT NULL, module_id TEXT NOT NULL,
            start_time DATETIME DEFAULT CURRENT_TIMESTAMP, starting_level INTEGER NOT NULL,
            final_level INTEGER NOT NULL, avg_drift REAL NOT NULL, avg_valence REAL NOT NULL,
            reminiscence_triggered INTEGER NOT NULL, xai_factor TEXT NOT NULL,
            xai_summary TEXT NOT NULL, sync_status INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS telemetry_ticks (
            tick_id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL,
            timestamp_ms INTEGER NOT NULL, level REAL NOT NULL, error_rate REAL NOT NULL,
            latency_ms REAL NOT NULL, valence REAL NOT NULL, drift REAL NOT NULL,
            action INTEGER NOT NULL, FOREIGN KEY (session_id) REFERENCES sessions(session_id)
        );
        CREATE INDEX IF NOT EXISTS idx_sync_status ON sessions(sync_status);
        CREATE INDEX IF NOT EXISTS idx_ticks_session ON telemetry_ticks(session_id);
    )SQL";
    return ExecuteSimple(schema);
}

bool DatabaseManager::SaveSession(const SessionSummary& session) {
    if (db == nullptr) return false;
    const char* query = R"SQL(
        INSERT OR REPLACE INTO sessions
        (session_id, patient_id, module_id, starting_level, final_level, avg_drift,
         avg_valence, reminiscence_triggered, xai_factor, xai_summary, sync_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
    )SQL";
    sqlite3_stmt* statement = nullptr;
    if (sqlite3_prepare_v2(db, query, -1, &statement, nullptr) != SQLITE_OK) return false;
    sqlite3_bind_text(statement, 1, session.session_id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 2, session.patient_id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 3, session.module_id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(statement, 4, session.starting_level);
    sqlite3_bind_int(statement, 5, session.final_level);
    sqlite3_bind_double(statement, 6, session.avg_drift);
    sqlite3_bind_double(statement, 7, session.avg_valence);
    sqlite3_bind_int(statement, 8, session.reminiscence_triggered ? 1 : 0);
    sqlite3_bind_text(statement, 9, session.xai_primary_factor.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 10, session.xai_clinical_summary.c_str(), -1, SQLITE_TRANSIENT);
    const bool success = sqlite3_step(statement) == SQLITE_DONE;
    sqlite3_finalize(statement);
    return success;
}

bool DatabaseManager::LogSession(const std::string& session_id, const std::string& patient_id,
                                 const std::string& module_id, float avg_cdi, float avg_valence,
                                 bool triggered_reminiscence, const std::string& xai_reason) {
    return SaveSession({session_id, patient_id, module_id, 1, 1, avg_cdi, avg_valence,
                        triggered_reminiscence, "legacy_reason", xai_reason});
}

bool DatabaseManager::LogTelemetryTicks(const std::string& session_id,
                                        const std::vector<TelemetryTick>& ticks) {
    if (db == nullptr || !ExecuteSimple("BEGIN TRANSACTION;")) return false;
    const char* query = R"SQL(
        INSERT INTO telemetry_ticks
        (session_id, timestamp_ms, level, error_rate, latency_ms, valence, drift, action)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    )SQL";
    sqlite3_stmt* statement = nullptr;
    if (sqlite3_prepare_v2(db, query, -1, &statement, nullptr) != SQLITE_OK) {
        ExecuteSimple("ROLLBACK;");
        return false;
    }
    bool success = true;
    for (const TelemetryTick& tick : ticks) {
        sqlite3_bind_text(statement, 1, session_id.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_int64(statement, 2, tick.timestamp_ms);
        sqlite3_bind_double(statement, 3, tick.normalized_level);
        sqlite3_bind_double(statement, 4, tick.error_rate);
        sqlite3_bind_double(statement, 5, tick.latency_ms);
        sqlite3_bind_double(statement, 6, tick.facial_valence);
        sqlite3_bind_double(statement, 7, tick.cognitive_drift);
        sqlite3_bind_int(statement, 8, static_cast<int>(tick.action_taken));
        if (sqlite3_step(statement) != SQLITE_DONE) {
            success = false;
            break;
        }
        sqlite3_reset(statement);
        sqlite3_clear_bindings(statement);
    }
    sqlite3_finalize(statement);
    if (!success || !ExecuteSimple("COMMIT;")) {
        ExecuteSimple("ROLLBACK;");
        return false;
    }
    return true;
}

std::string DatabaseManager::ExportUnsyncedJson(int max_records) {
    if (db == nullptr || max_records <= 0) return "[]";
    const char* query = R"SQL(
        SELECT session_id, patient_id, module_id, starting_level, final_level, avg_drift,
               avg_valence, reminiscence_triggered, xai_factor, xai_summary
        FROM sessions WHERE sync_status = 0 ORDER BY start_time LIMIT ?;
    )SQL";
    sqlite3_stmt* statement = nullptr;
    if (sqlite3_prepare_v2(db, query, -1, &statement, nullptr) != SQLITE_OK) return "[]";
    sqlite3_bind_int(statement, 1, max_records);
    std::ostringstream json;
    json << '[';
    bool first = true;
    while (sqlite3_step(statement) == SQLITE_ROW) {
        if (!first) json << ',';
        first = false;
        json << "{\"session_id\":\"" << JsonEscape(sqlite3_column_text(statement, 0))
             << "\",\"patient_id\":\"" << JsonEscape(sqlite3_column_text(statement, 1))
             << "\",\"module_id\":\"" << JsonEscape(sqlite3_column_text(statement, 2))
             << "\",\"starting_level\":" << sqlite3_column_int(statement, 3)
             << ",\"final_level\":" << sqlite3_column_int(statement, 4)
             << ",\"avg_drift\":" << std::setprecision(9) << sqlite3_column_double(statement, 5)
             << ",\"avg_valence\":" << sqlite3_column_double(statement, 6)
             << ",\"reminiscence_triggered\":"
             << (sqlite3_column_int(statement, 7) ? "true" : "false")
             << ",\"xai_factor\":\"" << JsonEscape(sqlite3_column_text(statement, 8))
             << "\",\"xai_summary\":\"" << JsonEscape(sqlite3_column_text(statement, 9))
             << "\"}";
    }
    sqlite3_finalize(statement);
    json << ']';
    return json.str();
}

bool DatabaseManager::MarkAsSynced(const std::vector<std::string>& session_ids) {
    if (db == nullptr) return false;
    if (session_ids.empty()) return true;
    if (!ExecuteSimple("BEGIN TRANSACTION;")) return false;
    sqlite3_stmt* statement = nullptr;
    if (sqlite3_prepare_v2(db, "UPDATE sessions SET sync_status = 1 WHERE session_id = ?;",
                           -1, &statement, nullptr) != SQLITE_OK) {
        ExecuteSimple("ROLLBACK;");
        return false;
    }
    bool success = true;
    for (const std::string& id : session_ids) {
        sqlite3_bind_text(statement, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        if (sqlite3_step(statement) != SQLITE_DONE) {
            success = false;
            break;
        }
        sqlite3_reset(statement);
        sqlite3_clear_bindings(statement);
    }
    sqlite3_finalize(statement);
    if (!success || !ExecuteSimple("COMMIT;")) {
        ExecuteSimple("ROLLBACK;");
        return false;
    }
    return true;
}