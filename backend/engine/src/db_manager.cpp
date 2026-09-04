#include "db_manager.hpp"

DatabaseManager::DatabaseManager(const std::string& db_path) {
    if (sqlite3_open(db_path.c_str(), &db) == SQLITE_OK) {
        InitializeSchema();
    }
}

DatabaseManager::~DatabaseManager() {
    if (db != nullptr) sqlite3_close(db);
}

void DatabaseManager::InitializeSchema() {
    const char* sql = "CREATE TABLE IF NOT EXISTS sessions (session_id TEXT PRIMARY KEY, patient_id TEXT, module_id TEXT, avg_cdi REAL, avg_valence REAL, triggered_reminiscence INTEGER, xai_reason TEXT);";
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