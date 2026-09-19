# SecurePass — Password Strength Analyzer & Security Dashboard

A professional, modern cybersecurity SaaS application built with **Python, Flask, and Vanilla Web Standards (HTML5, CSS3, JavaScript, Chart.js)**. Designed to meet enterprise password audit standards with real-time heuristic strength evaluation, cryptographically secure password generation via Python's `secrets` module, and a zero-knowledge audit history trail.

---

## 🛡️ Project Overview

SecurePass delivers a dark cybersecurity operations aesthetic inspired by leading threat intelligence and identity security platforms. It replaces generic, dated password checkers with an intuitive, high-contrast dashboard featuring glassmorphism, glowing accents, animated entropy meters, and interactive telemetry charts.

### Key Objectives
1. **Analyze Password Strength**: Instant evaluation against length, uppercase, lowercase, numeric digits, and special characters.
2. **Actionable Recommendations**: Explain *why* a credential is weak and how to elevate its entropy according to NIST 800-63B guidelines.
3. **CSPRNG Generation**: Generate true cryptographically secure random credentials with customizable character sets and lengths (8–50).
4. **Zero-Knowledge History**: Maintain comprehensive audit logs without ever saving, logging, or exposing the plaintext passwords.
5. **Security Telemetry**: Visualize credential distribution with Chart.js doughnut and histogram graphs.

---

## ✨ Features

- **🔐 Cyber Security Login Portal**:
  - Split-screen layout with glowing branding elements and dynamic feature overview.
  - Password visibility toggle, input validation, and session remember-me support.
- **📊 SecOps Operations Dashboard**:
  - Personalized operator welcome card with quick-action shortcuts.
  - Four security KPI overview cards: Total Checked, Strong, Medium, Weak.
  - Live activity feed showing recent zero-knowledge audit logs.
- **⚡ Real-Time Password Analyzer**:
  - Live animated strength meter with color shifts (Red for Weak, Amber for Medium, Green for Strong).
  - 5-point requirement checklist with real-time pass/fail indicator badges.
  - Tailored security recommendations for immediate credential elevation.
  - Instant character count and one-click clear button.
- **🎲 Cryptographic Password Generator**:
  - Powered by Python's `secrets` module (never standard pseudo-random `random`).
  - Length slider from 8 to 50 characters.
  - Granular toggles for uppercase, lowercase, numbers, and special symbols.
  - One-click copy with automated toast confirmation.
- **📜 Zero-Knowledge Audit Trail**:
  - Responsive audit table detailing Timestamp, Score (X/5), Strength, and Classification.
  - Client-side search and filtering by strength tier and chronological sorting.
  - One-click history purge with confirmation safeguard.
  - Modern empty-state graphics when no history exists.
- **📈 Security Telemetry & Chart.js Visualizations**:
  - Real-time Doughnut chart displaying strong/medium/weak percentage distribution.
  - Bar chart histogram displaying score frequency from 0 to 5.
  - Dynamic updates linked directly to the application's audit history.
- **⚙️ Policy Settings & Preferences**:
  - Customizable minimum password length and character policy enforcement.
  - High-readability theme toggle (Dark Cybersecurity / Clean Light).
  - Operator profile and notification destination configuration.
- **🔒 Absolute Privacy & Zero-Knowledge**:
  - Analyzed passwords are **never stored** in SQLite, JSON, memory, or log files.
  - Only metadata (timestamp, score, strength badge) is preserved.

---

## 🛠️ Technologies Used

- **Backend**: Python 3.10+, Flask 3.0.3, Werkzeug 3.0.3, Python `secrets` module
- **Frontend / Templates**: HTML5, CSS3, JavaScript (ES6+), Jinja2 Templating
- **Styling & UI**: Custom CSS Glassmorphism, CSS Custom Properties, Responsive Grid & Flexbox
- **Icons & Typography**: Font Awesome 6.5+, Google Fonts (*Plus Jakarta Sans*, *Fira Code*)
- **Visualization**: Chart.js 4.4+ (Doughnut & Bar charts)
- **Data Persistence**: Lightweight zero-knowledge JSON datastore (`data/history.json`)

---

## 📁 Project Structure

```
SecurePass/
│
├── app.py                     # Flask application routes, logic & APIs
├── requirements.txt           # Python dependency specifications
├── README.md                  # Comprehensive project documentation
│
├── templates/                 # Jinja2 HTML templates
│   ├── base.html              # Global navigation, sidebar & shell layout
│   ├── landing.html           # Public marketing and feature showcase
│   ├── login.html             # High-security split-screen login portal
│   ├── dashboard.html         # Main SecOps security overview dashboard
│   ├── analyze.html           # Real-time password strength analyzer
│   ├── generator.html         # CSPRNG cryptographic password generator
│   ├── history.html           # Zero-knowledge audit trail table
│   ├── statistics.html        # Chart.js security telemetry & graphs
│   ├── settings.html          # Policy configuration & theme settings
│   └── logout.html            # Session termination confirmation
│
├── static/                    # Static assets
│   ├── css/
│   │   └── style.css          # Cybersecurity SaaS styling & animations
│   └── js/
│       ├── main.js            # Sidebar toggle, toasts & core utilities
│       ├── analyzer.js        # Live heuristic evaluation & meter logic
│       ├── generator.js       # CSPRNG password generation & clipboard
│       └── charts.js          # Chart.js integration & telemetry feeds
│
└── data/
    └── history.json           # Sanitized audit metadata (no passwords)
```

---

## 🚀 Installation & Running Instructions

### Prerequisites
- Python 3.8 or higher installed on your system
- `pip` (Python package manager)

### 1. Clone or Download the Project
Extract the project folder into your workspace (e.g. VS Code).

### 2. Create and Activate a Virtual Environment (Optional but Recommended)
```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows (Command Prompt or PowerShell)
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```

### 5. Access the Web Application
The application will automatically launch in your default web browser at:
```
http://127.0.0.1:5000/
```

> **Demo Login Credentials**:
> - **Username**: `secops_admin`
> - **Password**: `SecurePass#2026!`

---

## 🔒 Security Notes

1. **CSPRNG vs Pseudo-Randomness**: This project exclusively employs Python's `secrets` module for generating passwords. Standard `random` relies on the Mersenne Twister, which is completely insecure for cryptographic purposes.
2. **Zero Plaintext Retention**: At no point in the analyzer or database workflow is candidate password input written to disk or logged. Only the derived score and assessment tier are retained.
3. **Session Hardening**: Sessions utilize a cryptographically random secret key (`secrets.token_hex(32)`) with secure session cookie policies.

---

## 🔮 Future Improvements

- HaveIBeenPwned k-Anonymity API integration to cross-check billions of breached passwords without revealing hashes.
- Multi-Factor Authentication (MFA / TOTP) support for SecOps analyst accounts.
- Export audit logs to structured CSV or PDF security compliance reports.
- Advanced dictionary-word and leetspeak substitution detection.
