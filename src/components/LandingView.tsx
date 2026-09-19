import React from 'react';
import { 
  ShieldCheck, Lock, Wand2, PieChart, ArrowRight, 
  CheckCircle2, KeyRound, Database, ShieldAlert, Cpu
} from 'lucide-react';
import { PageView } from '../types';

interface LandingViewProps {
  onNavigate: (view: PageView) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="px-6 sm:px-12 py-5 flex items-center justify-between border-b border-cyan-500/15 backdrop-blur-md bg-[#070b14]/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Secure<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Pass</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-colors"
          >
            SecOps Login
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all"
          >
            <span>Open Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6">
          <Cpu className="w-3.5 h-3.5" />
          <span>Zero-Knowledge Heuristic Cryptographic Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
          Build Stronger Passwords.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            Protect Your Digital Life.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          SecurePass analyzes password strength and helps you create stronger credentials using real-time entropy metrics, NIST recommendations, and Python secrets CSPRNG generation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Get Started</span>
          </button>
          <button
            onClick={() => onNavigate('analyze')}
            className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Analyze Password</span>
          </button>
        </div>
      </section>

      {/* Why Password Security Matters */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Why Password Security Matters</h2>
          <p className="text-sm text-slate-400">Over 80% of data breaches exploit weak, recycled, or easily guessable passwords.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/15 backdrop-blur-md hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Strong Passwords</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resist brute-force bots and multi-GPU cluster hashing algorithms with high-entropy character combinations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/15 backdrop-blur-md hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Secure Generation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate true cryptographically secure random credentials via system entropy sources with zero predictable patterns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/15 backdrop-blur-md hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Security Insights</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand the precise structural shortcomings of your credentials and gain actionable remediation suggestions.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-sm text-slate-400">Streamlined three-step security evaluation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 font-bold mx-auto flex items-center justify-center mb-3">1</div>
            <h4 className="font-bold text-sm text-white mb-1">Enter Password</h4>
            <p className="text-xs text-slate-400">Type candidate string in the secure, non-retained client analyzer.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 font-bold mx-auto flex items-center justify-center mb-3">2</div>
            <h4 className="font-bold text-sm text-white mb-1">Analyze Strength</h4>
            <p className="text-xs text-slate-400">Instant 5-factor heuristic test calculates entropy and policy pass status.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold mx-auto flex items-center justify-center mb-3">3</div>
            <h4 className="font-bold text-sm text-white mb-1">Improve Security</h4>
            <p className="text-xs text-slate-400">Apply recommendations or generate random CSPRNG credentials immediately.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-cyan-500/15 py-8 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-300">SecurePass — Cybersecurity Suite</span>
        </div>
        <p>Zero-Knowledge Privacy Guaranteed • Python Flask Backend & Modern SaaS Interface</p>
      </footer>
    </div>
  );
};
