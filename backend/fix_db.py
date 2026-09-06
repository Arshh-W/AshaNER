import sqlite3

DB = "dementia_care.db"

conn = sqlite3.connect(DB)
conn.execute("PRAGMA foreign_keys = OFF")

tables = [
    "game_sessions",
    "routines",
    "clinical_audio_logs",
    "facial_agitation_logs",
    "daily_adherence",
]

for table in tables:
    row = conn.execute(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name=?",
        (table,)
    ).fetchone()

    if not row:
        print(f"Skipping {table}")
        continue

    old_sql = row[0]

    if "patients_legacy" not in old_sql:
        print(f"{table}: already OK")
        continue

    new_sql = old_sql.replace('"patients_legacy"', '"patients"')
    temp = table + "_old"

    conn.execute(f'ALTER TABLE "{table}" RENAME TO "{temp}"')

    conn.execute(new_sql)

    columns = [
        r[1]
        for r in conn.execute(
            f'PRAGMA table_info("{temp}")'
        ).fetchall()
    ]

    column_list = ", ".join(f'"{col}"' for col in columns)

    conn.execute(
        f'INSERT INTO "{table}" ({column_list}) '
        f'SELECT {column_list} FROM "{temp}"'
    )

    conn.execute(f'DROP TABLE "{temp}"')

    print(f"{table}: fixed")

conn.commit()
conn.execute("PRAGMA foreign_keys = ON")
conn.close()

print("Migration completed successfully.")