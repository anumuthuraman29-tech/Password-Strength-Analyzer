import React, { useState } from 'react';
import { 
  FileCode2, Copy, Check, Terminal, FolderGit2, Download, 
  ChevronRight, FileText, Code2, ShieldCheck, Play
} from 'lucide-react';

interface FlaskCodeViewerProps {
  onTriggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface ProjectFile {
  name: string;
  path: string;
  type: 'python' | 'html' | 'css' | 'javascript' | 'json' | 'markdown' | 'text';
  category: 'Backend' | 'Templates' | 'Styles & Scripts' | 'Config & Data';
  snippet: string;
}

const PROJECT_FILES: ProjectFile[] = [
  {
    name: 'app.py',
    path: 'app.py',
    type: 'python',
    category: 'Backend',
    snippet: `from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import os, json, re, secrets, string, webbrowser
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# Evaluation: Minimum 8 chars, Uppercase, Lowercase, Number, Special
# Scores: 0-2 = Weak, 3-4 = Medium, 5 = Strong
def evaluate_password_strength(password):
    has_length = len(password) >= 8
    has_upper = bool(re.search(r'[A-Z]', password))
    has_lower = bool(re.search(r'[a-z]', password))
    has_number = bool(re.search(r'[0-9]', password))
    has_special = bool(re.search(r'[!@#$%^&*()_+\\-=[\\]{};\\':"\\\\|,.<>\\/?]', password))
    
    score = sum([has_length, has_upper, has_lower, has_number, has_special])
    # ... returns score, strength, conditions, recommendations

# API: CSPRNG generation using Python's secrets module
@app.route('/api/generate', methods=['POST'])
def api_generate():
    length = int(request.json.get('length', 16))
    # True cryptographic randomness (never uses random module)
    # ...`
  },
  {
    name: 'requirements.txt',
    path: 'requirements.txt',
    type: 'text',
    category: 'Config & Data',
    snippet: `Flask>=3.0.3
Werkzeug>=3.0.3
jinja2>=3.1.3`
  },
  {
    name: 'README.md',
    path: 'README.md',
    type: 'markdown',
    category: 'Config & Data',
    snippet: `# SecurePass — Password Strength Analyzer & Security Dashboard

## Quick Start
\`\`\`bash
pip install -r requirements.txt
python app.py
\`\`\`
Server automatically launches on http://127.0.0.1:5000/ with zero-knowledge cryptographic credential analysis.`
  },
  {
    name: 'base.html',
    path: 'templates/base.html',
    type: 'html',
    category: 'Templates',
    snippet: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{% block title %}SecurePass{% endblock %}</title>
  <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>
<body>
  <!-- Cybersecurity Navigation & Shell -->
  <aside class="sidebar">...</aside>
  <main class="main-content">
    {% block content %}{% endblock %}
  </main>
</body>
</html>`
  },
  {
    name: 'analyze.html',
    path: 'templates/analyze.html',
    type: 'html',
    category: 'Templates',
    snippet: `{% extends "base.html" %}
{% block content %}
<div class="glass-card">
  <h2>Analyze Your Password</h2>
  <div class="strength-meter-container">
    <div id="meterBar" class="strength-meter-bar"></div>
  </div>
  <div class="requirements-checklist">
    <!-- Dynamic Real-time checklist items -->
  </div>
</div>
{% endblock %}`
  },
  {
    name: 'generator.html',
    path: 'templates/generator.html',
    type: 'html',
    category: 'Templates',
    snippet: `{% extends "base.html" %}
{% block content %}
<div class="glass-card">
  <h2>Cryptographic Password Generator</h2>
  <input type="text" id="genResult" readonly class="generator-output">
  <input type="range" id="lengthSlider" min="8" max="50" value="16">
  <button id="copyBtn" class="btn btn-primary">Copy Password</button>
</div>
{% endblock %}`
  },
  {
    name: 'style.css',
    path: 'static/css/style.css',
    type: 'css',
    category: 'Styles & Scripts',
    snippet: `:root {
  --bg-main: #070b14;
  --bg-card: rgba(14, 22, 41, 0.75);
  --accent-cyan: #38bdf8;
  --accent-purple: #a855f7;
  --strength-strong: #10b981;
  --strength-medium: #f59e0b;
  --strength-weak: #ef4444;
}
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 1rem;
}`
  },
  {
    name: 'analyzer.js',
    path: 'static/js/analyzer.js',
    type: 'javascript',
    category: 'Styles & Scripts',
    snippet: `// Real-time heuristic evaluation matching NIST 800-63B
function evaluatePassword(pwd) {
  const hasLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?]/.test(pwd);
  // ...
}`
  },
  {
    name: 'history.json',
    path: 'data/history.json',
    type: 'json',
    category: 'Config & Data',
    snippet: `[
  {
    "id": "audit-1",
    "time": "2026-09-19 13:45",
    "score": 5,
    "strength": "Strong",
    "category": "Enterprise Grade",
    "status": "Passed All Checks"
  }
]`
  }
];

export const FlaskCodeViewer: React.FC<FlaskCodeViewerProps> = ({ onTriggerToast }) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.snippet);
      setCopied(true);
      onTriggerToast(`Copied ${selectedFile.name} to clipboard`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onTriggerToast('Failed to copy', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-indigo-950/40 border border-cyan-500/25 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Full Python Flask Project Repository</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Flask Codebase & Architecture
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Inspect the complete generated Python Flask codebase, Jinja2 templates, and zero-knowledge datastore.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>python app.py</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: File Tree + Code Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Navigator */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              <span>Project Structure (SecurePass/)</span>
            </h3>

            <div className="space-y-1.5">
              {PROJECT_FILES.map(file => {
                const isSelected = selectedFile.name === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="truncate">{file.path}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Run Commands */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Run in Terminal / VS Code:</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 font-mono text-[11px] text-cyan-300 space-y-1 border border-slate-800 select-all">
              <div>pip install -r requirements.txt</div>
              <div>python app.py</div>
            </div>
          </div>
        </div>

        {/* Code Viewer Panel */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-[#090e1c] border border-cyan-500/25 overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 bg-[#0e1629] border-b border-cyan-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white">{selectedFile.path}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase font-mono">
                  {selectedFile.type}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy File'}</span>
              </button>
            </div>

            <div className="p-4 max-h-[520px] overflow-y-auto font-mono text-xs text-slate-300 bg-[#080c18] leading-relaxed">
              <pre className="whitespace-pre-wrap select-all font-mono">{selectedFile.snippet}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
