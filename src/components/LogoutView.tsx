import React from 'react';
import { ShieldCheck, LogIn, Home, Lock } from 'lucide-react';
import { PageView } from '../types';

interface LogoutViewProps {
  onNavigate: (view: PageView) => void;
}

export const LogoutView: React.FC<LogoutViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#0e1629]/90 border border-emerald-500/25 backdrop-blur-xl shadow-2xl text-center">
        {/* Glowing Shield Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 animate-in zoom-in-90 duration-300">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Successfully Logged Out</h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-8 max-w-xs mx-auto">
          Your session has been securely closed. Sensitive candidate buffers and memory states have been purged in accordance with zero-knowledge protocols.
        </p>

        <div className="space-y-3">
          <button
            id="logout-login-again-btn"
            onClick={() => onNavigate('login')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login Again</span>
          </button>

          <button
            id="logout-return-home-btn"
            onClick={() => onNavigate('landing')}
            className="w-full py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>Return to Home</span>
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>SecurePass Zero-Trust Enclave</span>
        </div>
      </div>
    </div>
  );
};
