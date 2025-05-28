from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), 'scripts')
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'db.sqlite3'))
#print("Using database at:", DB_PATH)
def log_user_interaction(data):
    user = data['user_info']
    quiz = data['quiz_data']

    # Expect quiz['correct_answers'] and quiz['hints_used'] to be lists of length 14
    correct_vals = quiz['correct_answers']
    hint_vals = quiz['hints_used']

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Columns for q1 to q14 and q1_hint to q14_hint
    correct_cols = ', '.join([f"q{i}" for i in range(1, 15)])
    hint_cols = ', '.join([f"q{i}_hint" for i in range(1, 15)])

    placeholders = ', '.join(['?'] * (2 + 14 + 14))  # nickname, email + 14 + 14 answers

    sql = f'''
        INSERT INTO user_logs (
            username, email, {correct_cols}, {hint_cols}
        ) VALUES ({placeholders})
    '''

    values = [user['username'], user['email']] + correct_vals + hint_vals

    c.execute(sql, values)
    conn.commit()
    conn.close()

@app.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.json
    try:
        log_user_interaction(data)
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
