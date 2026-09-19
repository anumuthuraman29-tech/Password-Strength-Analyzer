import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { PageView } from '../types';

interface LoginViewProps {
  onLoginSuccess: (username: string) => void;
  onNavigate: (view: PageView) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigate, onTriggerToast }) => {
  const [username, setUsername] = useState('secops_admin');
  const [password, setPassword] = useState('SecurePass#2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both operator identifier and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(username);
      onTriggerToast(`Authenticated successfully as ${username}`, 'success');
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#070b14] text-slate-100">
      {/* Left Column: Brand, Glowing Cyber Elements */}
      <div className="flex-1 bg-gradient-to-br from-[#0a1124] via-[#0d1630] to-[#141b3d] p-8 sm:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-cyan-500/15 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Secure<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Pass</span>
            </span>
            <div className="text-[10px] text-cyan-400/80 font-mono tracking-wider uppercase">SecOps Console</div>
          </div>
        </div>

        <div className="my-10 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Authentication Active</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            Secure your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">digital identity.</span>
          </h2>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Analyze, generate and strengthen your passwords with SecurePass. Real-time heuristic evaluation, cryptographic entropy scoring, and automated compliance auditing.
          </p>

          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>5-Point real-time password strength analyzer</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Python secrets CSPRNG password generator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-knowledge storage: candidate passwords are never retained</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
            <span>TLS 1.3 Strict Transport Enforced</span>
          </div>
          <button 
            onClick={() => onNavigate('landing')} 
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Landing
          </button>
        </div>
      </div>

      {/* Right Column: Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#070b14]">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-1">Operator Sign In</h3>
            <p className="text-xs text-slate-400">Access your security audit console and password telemetry.</p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username or Email
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080d1a] border border-cyan-500/20 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                placeholder="secops_admin"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => onTriggerToast('Demo operator credentials pre-filled', 'info')}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-[#080d1a] border border-cyan-500/20 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>Remember me on this terminal</span>
              </label>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Station...</span>
                </>
              ) : (
                <span>Authenticate Session</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Need an enterprise account? </span>
            <button
              type="button"
              onClick={() => onTriggerToast('Corporate provisioning managed via SecOps identity tier.', 'info')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
