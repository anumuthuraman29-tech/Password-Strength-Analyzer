import React from 'react';
import { 
  ShieldCheck, ShieldAlert, Shield, Fingerprint, 
  KeyRound, Wand2, PieChart, ChevronRight, Clock, ArrowUpRight
} from 'lucide-react';
import { AuditLog, PageView, SecurityStats } from '../types';

interface DashboardViewProps {
  username: string;
  stats: SecurityStats;
  recentHistory: AuditLog[];
  onNavigate: (view: PageView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  username,
  stats,
  recentHistory,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-indigo-950/40 border border-cyan-500/25 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Threat Prevention</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">{username}</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Keep your digital accounts protected with stronger passwords. Run heuristic audits, generate CSPRNG keys, and verify organizational policy compliance.
          </p>
        </div>

        <button
          id="dashboard-analyze-btn"
          onClick={() => onNavigate('analyze')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <KeyRound className="w-4 h-4" />
          <span>Analyze Password</span>
        </button>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Passwords Checked */}
        <div className="p-5 rounded-xl bg-[#0e1629]/70 border border-cyan-500/20 backdrop-blur-md hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passwords Checked</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1 font-mono">{stats.total}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Stored in zero-knowledge log</span>
          </div>
        </div>

        {/* Strong Passwords */}
        <div className="p-5 rounded-xl bg-[#0e1629]/70 border border-emerald-500/20 backdrop-blur-md hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strong Passwords</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 mb-1 font-mono">{stats.strong}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{stats.percentages.strong}% enterprise grade</span>
          </div>
        </div>

        {/* Medium Passwords */}
        <div className="p-5 rounded-xl bg-[#0e1629]/70 border border-amber-500/20 backdrop-blur-md hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medium Passwords</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 mb-1 font-mono">{stats.medium}</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <span>{stats.percentages.medium}% moderate entropy</span>
          </div>
        </div>

        {/* Weak Passwords */}
        <div className="p-5 rounded-xl bg-[#0e1629]/70 border border-rose-500/20 backdrop-blur-md hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weak Passwords</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400 mb-1 font-mono">{stats.weak}</div>
          <div className="flex items-center gap-1.5 text-xs text-rose-400">
            <span>{stats.percentages.weak}% vulnerable credentials</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Actions + Recent Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Action Cards */}
        <div className="p-6 rounded-2xl bg-[#0e1629]/70 border border-cyan-500/20 backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-1">Security Quick Actions</h3>
          <p className="text-xs text-slate-400 mb-4">Jump straight into audit, generation, or telemetry feeds.</p>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('analyze')}
              className="w-full p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-cyan-500/15 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Heuristic Password Analyzer</div>
                  <div className="text-[11px] text-slate-400">Live 5-criteria NIST entropy evaluation</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            </button>

            <button
              onClick={() => onNavigate('generator')}
              className="w-full p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-cyan-500/15 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">CSPRNG Password Generator</div>
                  <div className="text-[11px] text-slate-400">Python secrets cryptographic randomness engine</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            </button>

            <button
              onClick={() => onNavigate('statistics')}
              className="w-full p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-cyan-500/15 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Security Statistics & Charts</div>
                  <div className="text-[11px] text-slate-400">Visual doughnut and histogram telemetry metrics</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Recent Audits Snapshot */}
        <div className="p-6 rounded-2xl bg-[#0e1629]/70 border border-cyan-500/20 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Security Audits</h3>
              <p className="text-xs text-slate-400">Zero-knowledge timestamp logs.</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View Full History
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {recentHistory.length > 0 ? (
              recentHistory.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{item.category}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.strength === 'Strong'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.strength === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {item.strength}
                    </span>
                    <span className="font-mono text-slate-400 font-bold">{item.score}/5</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No password checks logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
