# Sinemin Modülü
import sqlite3
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
db_path = os.path.join(BASE_DIR, 'db.sqlite3')
conn = sqlite3.connect(db_path)
c = conn.cursor()
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

