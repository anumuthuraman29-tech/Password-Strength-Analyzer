"""
SecurePass — Cybersecurity Password Strength Analyzer & Security Dashboard
A professional Flask web application for credential audits and cryptographic generation.
"""

import os
import json
import re
import secrets
import string
import webbrowser
from datetime import datetime
from functools import wraps
from flask import (
    Flask, render_template, request, redirect,
    url_for, session, jsonify, flash
)

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# Data storage paths
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
HISTORY_FILE = os.path.join(DATA_DIR, 'history.json')

# Ensure data directory and initial history exist
os.makedirs(DATA_DIR, exist_ok=True)
if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, 'w') as f:
        json.dump([
            {
                "id": "audit-1726760000000",
                "time": "2026-09-18 14:32",
                "score": 5,
                "strength": "Strong",
                "category": "Enterprise Grade",
                "status": "Passed All Checks"
            },
            {
                "id": "audit-1726760100000",
                "time": "2026-09-18 16:15",
                "score": 3,
                "strength": "Medium",
                "category": "Moderate Risk",
                "status": "Missing Special Character"
            },
            {
                "id": "audit-1726760200000",
                "time": "2026-09-19 09:10",
                "score": 1,
                "strength": "Weak",
                "category": "Critical Vulnerability",
                "status": "Short Length & Low Entropy"
            },
            {
                "id": "audit-1726760300000",
                "time": "2026-09-19 11:24",
                "score": 4,
                "strength": "Medium",
                "category": "Acceptable",
                "status": "Missing Uppercase Letter"
            },
            {
                "id": "audit-1726760400000",
                "time": "2026-09-19 13:45",
                "score": 5,
                "strength": "Strong",
                "category": "Enterprise Grade",
                "status": "Passed All Checks"
            }
        ], f, indent=2)


def get_history():
    """Load audit history safely from JSON file."""
    try:
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r') as f:
                data = json.load(f)
                return sorted(data, key=lambda x: x.get('time', ''), reverse=True)
    except Exception as e:
        print(f"Error reading history: {e}")
    return []


def save_history(history_list):
    """Write audit history safely to JSON file."""
    try:
        with open(HISTORY_FILE, 'w') as f:
            json.dump(history_list, f, indent=2)
    except Exception as e:
        print(f"Error saving history: {e}")


def calculate_stats():
    """Aggregate statistics for the dashboard and Chart.js."""
    history = get_history()
    total = len(history)
    strong = sum(1 for item in history if item.get('strength') == 'Strong')
    medium = sum(1 for item in history if item.get('strength') == 'Medium')
    weak = sum(1 for item in history if item.get('strength') == 'Weak')

    strong_pct = round((strong / total * 100)) if total > 0 else 0
    medium_pct = round((medium / total * 100)) if total > 0 else 0
    weak_pct = round((weak / total * 100)) if total > 0 else 0

    # Score distribution for 0, 1, 2, 3, 4, 5
    score_dist = [0] * 6
    for item in history:
        s = item.get('score', 0)
        if 0 <= s <= 5:
            score_dist[s] += 1

    return {
        'total': total,
        'strong': strong,
        'medium': medium,
        'weak': weak,
        'percentages': {
            'strong': strong_pct,
            'medium': medium_pct,
            'weak': weak_pct
        },
        'scoreDistribution': score_dist
    }


def evaluate_password_strength(password):
    """
    Evaluate candidate password according to strict 5-rule criteria:
    - Minimum 8 characters
    - Uppercase letter
    - Lowercase letter
    - Number
    - Special character
    Scores: 0-2 = Weak, 3-4 = Medium, 5 = Strong
    """
    if not password:
        return {
            'score': 0,
            'strength': 'Weak',
            'statusClass': 'weak',
            'category': 'Vulnerable',
            'recommendation': 'Enter a candidate password to begin heuristic analysis.',
            'conditions': {
                'hasLength': False,
                'hasUpper': False,
                'hasLower': False,
                'hasNumber': False,
                'hasSpecial': False
            }
        }

    has_length = len(password) >= 8
    has_upper = bool(re.search(r'[A-Z]', password))
    has_lower = bool(re.search(r'[a-z]', password))
    has_number = bool(re.search(r'[0-9]', password))
    has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password))

    score = sum([has_length, has_upper, has_lower, has_number, has_special])

    if score >= 5:
        strength = 'Strong'
        status_class = 'strong'
        category = 'Enterprise Grade'
        status_desc = 'Passed All Checks'
        recommendation = 'Excellent entropy. The password meets cryptographic complexity standards.'
    elif score >= 3:
        strength = 'Medium'
        status_class = 'medium'
        category = 'Moderate Risk'
        status_desc = 'Satisfies Basic Complexity'
        if not has_special:
            recommendation = 'Your password is missing a special character (@, #, $, %). Add one to improve its strength.'
        elif not has_number:
            recommendation = 'Add numerical digits to prevent targeted dictionary brute-force attacks.'
        elif not has_upper:
            recommendation = 'Add uppercase letters to expand character search space.'
        else:
            recommendation = 'Increase password length beyond 12 characters to reach Enterprise strength.'
    else:
        strength = 'Weak'
        status_class = 'weak'
        category = 'Critical Vulnerability'
        status_desc = 'Fails Multiple Security Policies'
        if not has_length:
            recommendation = 'Minimum 8 characters required. Passwords with fewer than 8 characters can be cracked in seconds.'
        else:
            recommendation = 'Combine uppercase, lowercase, numbers, and symbols to achieve baseline resilience.'

    return {
        'score': score,
        'strength': strength,
        'statusClass': status_class,
        'category': category,
        'status': status_desc,
        'recommendation': recommendation,
        'conditions': {
            'hasLength': has_length,
            'hasUpper': has_upper,
            'hasLower': has_lower,
            'hasNumber': has_number,
            'hasSpecial': has_special
        }
    }


def login_required(f):
    """Decorator to ensure active session."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


# -------------------------------------------------------------
# Web Page Routes
# -------------------------------------------------------------

@app.route('/')
def index():
    if session.get('logged_in'):
        return redirect(url_for('dashboard'))
    return render_template('landing.html')


@app.route('/landing')
def landing():
    return render_template('landing.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        # Input validation
        if not username or not password:
            flash('Username and password are required.', 'error')
            return render_template('login.html')

        # Authentication demonstration (accepts default demo credentials or valid strings)
        session['logged_in'] = True
        session['username'] = username if username else 'secops_admin'
        session['email'] = f"{username}@securepass.io" if '@' not in username else username
        flash(f'Authentication successful. Welcome back, {session["username"]}.', 'success')
        return redirect(url_for('dashboard'))

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return render_template('logout.html')


@app.route('/dashboard')
@login_required
def dashboard():
    stats = calculate_stats()
    history = get_history()
    return render_template('dashboard.html', active_page='dashboard', stats=stats, recent_history=history[:5])


@app.route('/analyze')
@login_required
def analyze():
    return render_template('analyze.html', active_page='analyze')


@app.route('/generator')
@login_required
def generator():
    return render_template('generator.html', active_page='generator')


@app.route('/history')
@login_required
def history():
    history_items = get_history()
    return render_template('history.html', active_page='history', history=history_items)


@app.route('/history/clear', methods=['POST'])
@login_required
def clear_history():
    save_history([])
    flash('Security audit history cleared successfully.', 'success')
    return redirect(url_for('history'))


@app.route('/statistics')
@login_required
def statistics():
    stats = calculate_stats()
    return render_template('statistics.html', active_page='statistics', stats=stats)


@app.route('/settings')
@login_required
def settings():
    return render_template('settings.html', active_page='settings')


@app.route('/settings/save', methods=['POST'])
@login_required
def save_settings():
    username = request.form.get('username', '').strip()
    email = request.form.get('email', '').strip()
    if username:
        session['username'] = username
    if email:
        session['email'] = email
    flash('Security preferences and operator profile saved successfully.', 'success')
    return redirect(url_for('settings'))


# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------

@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    """
    Analyze candidate password.
    CRITICAL: Never stores the actual password. Only stores metadata.
    """
    data = request.get_json() or {}
    password = data.get('password', '')
    record_history = data.get('recordHistory', False)

    result = evaluate_password_strength(password)

    if record_history and password:
        history = get_history()
        # Security: DO NOT STORE PLAINTEXT PASSWORD
        new_entry = {
            "id": f"audit-{int(datetime.now().timestamp() * 1000)}",
            "time": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "score": result['score'],
            "strength": result['strength'],
            "category": result['category'],
            "status": result['status']
        }
        history.insert(0, new_entry)
        save_history(history[:100])  # keep last 100 audits

    return jsonify(result)


@app.route('/api/generate', methods=['POST'])
def api_generate():
    """
    Generate cryptographically secure password using Python's secrets module.
    Never uses pseudorandom 'random' module.
    """
    data = request.get_json() or {}
    try:
        length = int(data.get('length', 16))
    except (ValueError, TypeError):
        length = 16

    length = max(8, min(length, 64))

    use_upper = data.get('uppercase', True)
    use_lower = data.get('lowercase', True)
    use_numbers = data.get('numbers', True)
    use_special = data.get('special', True)

    pool = ""
    guaranteed = []

    if use_upper:
        pool += string.ascii_uppercase
        guaranteed.append(secrets.choice(string.ascii_uppercase))
    if use_lower:
        pool += string.ascii_lowercase
        guaranteed.append(secrets.choice(string.ascii_lowercase))
    if use_numbers:
        pool += string.digits
        guaranteed.append(secrets.choice(string.digits))
    if use_special:
        special_chars = "!@#$%^&*()-_=+[]{}|;:,.<>?"
        pool += special_chars
        guaranteed.append(secrets.choice(special_chars))

    if not pool:
        pool = string.ascii_letters + string.digits

    remaining_len = max(0, length - len(guaranteed))
    chosen = [secrets.choice(pool) for _ in range(remaining_len)]
    all_chars = guaranteed + chosen

    # Cryptographically shuffle characters
    for i in range(len(all_chars) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        all_chars[i], all_chars[j] = all_chars[j], all_chars[i]

    generated_password = "".join(all_chars)

    return jsonify({
        "password": generated_password,
        "length": length,
        "entropyRating": "Enterprise-Grade (secrets CSPRNG)"
    })


@app.route('/api/stats', methods=['GET'])
def api_stats():
    return jsonify(calculate_stats())


@app.route('/api/history', methods=['GET'])
def api_history():
    return jsonify(get_history())


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"[*] Starting SecurePass Cyber Defense Suite on http://127.0.0.1:{port}/")
    try:
        # Automatically open browser if executed locally in VS Code or desktop
        if os.environ.get('AUTO_OPEN', '1') == '1':
            webbrowser.open_new(f"http://127.0.0.1:{port}/")
    except Exception:
        pass
    app.run(host='0.0.0.0', port=port, debug=True)
