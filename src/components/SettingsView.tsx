import React, { useState } from 'react';
import { 
  User, Shield, Palette, Bell, Save, RotateCcw, 
  CheckCircle2, Sliders, Moon, Sun, Lock
} from 'lucide-react';

interface SettingsViewProps {
  username: string;
  onUpdateUsername: (newName: string) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  username,
  onUpdateUsername,
  onTriggerToast
}) => {
  const [operatorName, setOperatorName] = useState(username);
  const [email, setEmail] = useState('admin@securepass.io');
  const [minLength, setMinLength] = useState(8);
  const [requireUpper, setRequireUpper] = useState(true);
  const [requireLower, setRequireLower] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecial, setRequireSpecial] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [securityTips, setSecurityTips] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorName.trim()) {
      onTriggerToast('Username cannot be empty', 'error');
      return;
    }
    onUpdateUsername(operatorName);
    onTriggerToast('SecOps policies & profile saved successfully!', 'success');
  };

  const handleToggleTheme = (dark: boolean) => {
    setIsDarkMode(dark);
    if (!dark) {
      document.body.classList.add('light-theme');
      onTriggerToast('Switched to High-Readability Light Canvas', 'info');
    } else {
      document.body.classList.remove('light-theme');
      onTriggerToast('Restored Cybersecurity Dark Navy Theme', 'info');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Operator Profile</h3>
              <p className="text-xs text-slate-400">Manage identity credentials and alert routing endpoints.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Operator Username
              </label>
              <input
                id="settings-username-input"
                type="text"
                value={operatorName}
                onChange={e => setOperatorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080d1a] border border-cyan-500/20 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alert Notification Email
              </label>
              <input
                id="settings-email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080d1a] border border-cyan-500/20 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Security Policy Settings */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Security & Password Policy</h3>
                <p className="text-xs text-slate-400">Set organization-wide minimum complexity thresholds.</p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              NIST 800-63B
            </span>
          </div>

          <div className="space-y-5">
            {/* Minimum Password Length */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Minimum Password Length</span>
                <span className="font-mono text-cyan-400 font-bold">{minLength} characters</span>
              </div>
              <input
                type="range"
                min={8}
                max={24}
                value={minLength}
                onChange={e => setMinLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Policy Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <PolicyToggle
                label="Require Uppercase (A-Z)"
                sublabel="At least one uppercase character"
                checked={requireUpper}
                onChange={setRequireUpper}
              />
              <PolicyToggle
                label="Require Lowercase (a-z)"
                sublabel="At least one lowercase character"
                checked={requireLower}
                onChange={setRequireLower}
              />
              <PolicyToggle
                label="Require Numbers (0-9)"
                sublabel="At least one numerical digit"
                checked={requireNumbers}
                onChange={setRequireNumbers}
              />
              <PolicyToggle
                label="Require Special Characters"
                sublabel="At least one symbol (!@#$)"
                checked={requireSpecial}
                onChange={setRequireSpecial}
              />
            </div>
          </div>
        </div>

        {/* Appearance & Preferences */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Appearance & Notification Preferences</h3>
              <p className="text-xs text-slate-400">Configure visual themes and live advisory hints.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dark Mode</span>
                </div>
                <div className="text-[10px] text-slate-500">Cyber Navy Palette</div>
              </div>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={e => handleToggleTheme(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Notifications</span>
                </div>
                <div className="text-[10px] text-slate-500">Audit status toasts</div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={e => setNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Security Tips</span>
                </div>
                <div className="text-[10px] text-slate-500">NIST recommendations</div>
              </div>
              <input
                type="checkbox"
                checked={securityTips}
                onChange={e => setSecurityTips(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="reset"
            onClick={() => {
              setOperatorName('secops_admin');
              setEmail('admin@securepass.io');
              setMinLength(8);
              setRequireUpper(true);
              setRequireLower(true);
              setRequireNumbers(true);
              setRequireSpecial(true);
              handleToggleTheme(true);
              onTriggerToast('Default settings restored', 'info');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            id="settings-save-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};

function PolicyToggle({
  label,
  sublabel,
  checked,
  onChange
}: {
  label: string;
  sublabel: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-cyan-500/20 transition-colors">
      <div>
        <div className="text-xs font-semibold text-slate-200">{label}</div>
        <div className="text-[10px] text-slate-500 font-mono">{sublabel}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
      />
    </label>
  );
}
