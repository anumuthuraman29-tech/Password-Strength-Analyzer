import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Eye, EyeOff, Eraser, Sparkles, CheckCircle2, 
  XCircle, Lightbulb, Info, Lock
} from 'lucide-react';
import { AuditLog, PageView } from '../types';
import { evaluatePassword } from '../utils/security';

interface AnalyzerViewProps {
  onRecordAudit: (entry: AuditLog) => void;
  onNavigate: (view: PageView) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  onRecordAudit,
  onNavigate,
  onTriggerToast
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Live evaluation
  const analysis = useMemo(() => evaluatePassword(password), [password]);

  const handleClear = () => {
    setPassword('');
  };

  const handleAnalyzeAndSave = () => {
    if (!password) {
      onTriggerToast('Please enter candidate characters to analyze.', 'error');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);

      // Save to zero-knowledge audit log (NEVER SAVE ACTUAL PASSWORD)
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        time: timestamp,
        score: analysis.score,
        strength: analysis.strength,
        category: analysis.category,
        status: analysis.status
      };

      onRecordAudit(newAudit);
      onTriggerToast(`Security Audit Logged: ${analysis.strength} (${analysis.score}/5)`, 'success');
    }, 350);
  };

  // Compute meter width
  const meterWidth = password.length === 0 
    ? 0 
    : analysis.score === 5 
    ? 100 
    : analysis.score >= 3 
    ? 65 
    : Math.max(20, analysis.score * 15);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Analyzer Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <span>Analyze Your Password</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live heuristic entropy test and OWASP complexity benchmark evaluation.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Storage Guarantee</span>
          </div>
        </div>

        {/* Input container */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-300">Candidate Password</label>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400 text-[11px]">{password.length} characters</span>
              {password && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <input
              id="analyzer-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Type candidate password to analyze live..."
              className="w-full px-4 py-3 pr-12 rounded-xl bg-[#080d1a] border border-cyan-500/20 text-slate-100 text-base font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 p-1"
              aria-label="Toggle password view"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Animated Strength Meter */}
        <div className="space-y-2 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Strength Tier:</span>
              <span
                id="strength-badge"
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  password.length === 0
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : analysis.strength === 'Strong'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs shadow-emerald-500/20'
                    : analysis.strength === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs shadow-amber-500/20'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs shadow-rose-500/20'
                }`}
              >
                {password.length === 0 ? 'Awaiting Input' : analysis.strength}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-slate-400">Score:</span>
              <span className="text-white font-bold text-sm">{analysis.score} / 5</span>
            </div>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
            <div
              id="strength-meter-bar"
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                analysis.strength === 'Strong'
                  ? 'bg-emerald-500 shadow-md shadow-emerald-500/50'
                  : analysis.strength === 'Medium'
                  ? 'bg-amber-500 shadow-md shadow-amber-500/50'
                  : 'bg-rose-500 shadow-md shadow-rose-500/50'
              }`}
              style={{ width: `${meterWidth}%` }}
            />
          </div>
        </div>

        {/* Security Requirement Checklist */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            NIST 800-63B Policy Requirements
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <RequirementItem 
              label="Minimum 8 characters" 
              passed={analysis.conditions.hasLength} 
            />
            <RequirementItem 
              label="Uppercase letter (A-Z)" 
              passed={analysis.conditions.hasUpper} 
            />
            <RequirementItem 
              label="Lowercase letter (a-z)" 
              passed={analysis.conditions.hasLower} 
            />
            <RequirementItem 
              label="Numerical digit (0-9)" 
              passed={analysis.conditions.hasNumber} 
            />
            <RequirementItem 
              label="Special symbol (!@#$)" 
              passed={analysis.conditions.hasSpecial} 
            />
          </div>
        </div>

        {/* Recommendation Box */}
        {password && (
          <div className="p-4 rounded-xl bg-cyan-950/20 border-l-4 border-cyan-400 flex items-start gap-3 mb-6 animate-in fade-in duration-300">
            <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-cyan-300 mb-0.5">Security Recommendation</div>
              <p className="text-xs text-slate-300 leading-relaxed">{analysis.recommendation}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            id="analyze-save-btn"
            onClick={handleAnalyzeAndSave}
            disabled={isAnalyzing}
            className="flex-1 min-w-[200px] py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isAnalyzing ? 'Logging Audit...' : 'Analyze & Save Audit'}</span>
          </button>

          <button
            onClick={() => onNavigate('generator')}
            className="py-3 px-5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Generate Stronger Password</span>
          </button>
        </div>
      </div>

      {/* Educational Explainer Card */}
      <div className="p-6 rounded-2xl bg-[#0e1629]/60 border border-cyan-500/15 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Understanding Password Entropy Scores</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="p-3 rounded-lg bg-slate-900/40 border border-rose-500/20">
            <span className="font-bold text-rose-400 block mb-1">Weak (Score 0-2)</span>
            Vulnerable to simple dictionary searches and rainbow table lookups. Cracked in seconds.
          </div>
          <div className="p-3 rounded-lg bg-slate-900/40 border border-amber-500/20">
            <span className="font-bold text-amber-400 block mb-1">Medium (Score 3-4)</span>
            Defends against standard automated bots, but remains susceptible to targeted GPU cracking.
          </div>
          <div className="p-3 rounded-lg bg-slate-900/40 border border-emerald-500/20">
            <span className="font-bold text-emerald-400 block mb-1">Strong (Score 5)</span>
            Satisfies enterprise-grade OWASP criteria with multi-set character entropy.
          </div>
        </div>
      </div>
    </div>
  );
};

function RequirementItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors border ${
        passed
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : 'bg-slate-900/50 border-slate-800 text-slate-500'
      }`}
    >
      {passed ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
      )}
      <span className="truncate">{label}</span>
    </div>
  );
}
