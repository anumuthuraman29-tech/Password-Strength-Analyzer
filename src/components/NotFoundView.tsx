import React from 'react';
import { ShieldAlert, Home, ArrowLeft, Terminal } from 'lucide-react';
import { PageView } from '../types';

interface NotFoundViewProps {
  attemptedRoute?: string;
  onNavigate: (view: PageView) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ attemptedRoute, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-[#0e1629]/90 border border-red-500/30 backdrop-blur-xl shadow-2xl text-center">
        {/* Error Shield */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono mb-3">
          HTTP 404 • ROUTE UNRESOLVED
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Requested Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 max-w-md mx-auto">
          The security enclave could not resolve the requested route endpoint{attemptedRoute ? ` "${attemptedRoute}"` : ''}. The resource may have been relocated, or an invalid deep-link was followed.
        </p>

        <div className="p-3 mb-6 rounded-xl bg-slate-950/80 border border-slate-800 text-left font-mono text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Diagnostic Telemetry:</span>
          </div>
          <div>Status: <span className="text-red-400">404 NOT_FOUND</span></div>
          <div>Protocol: Zero-Trust Enclave Router</div>
          <div>Suggested Action: Fallback to active SecOps Dashboard</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('landing')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Landing Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
