import sqlite3

conn = sqlite3.connect('db.sqlite3')
c = conn.cursor()

# Build columns dynamically for 14 questions
correct_cols = ', '.join([f"q{i} INTEGER" for i in range(1, 15)])
hint_cols = ', '.join([f"q{i}_hint INTEGER" for i in range(1, 15)])

sql = f'''
CREATE TABLE IF NOT EXISTS user_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    {correct_cols},
    {hint_cols}
)
'''

c.execute(sql)
conn.commit()
conn.close()
