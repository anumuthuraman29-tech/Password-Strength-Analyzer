import React, { useState, useMemo } from 'react';
import { 
  History, Search, Trash2, ShieldCheck, ShieldAlert, 
  Shield, Filter, ShieldOff, Clock, ArrowUpDown, KeyRound
} from 'lucide-react';
import { AuditLog, PageView } from '../types';

interface HistoryViewProps {
  history: AuditLog[];
  onClearHistory: () => void;
  onNavigate: (view: PageView) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
  onNavigate,
  onTriggerToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStrength, setFilterStrength] = useState<'ALL' | 'Strong' | 'Medium' | 'Weak'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortDesc, setSortDesc] = useState(true);

  const filteredLogs = useMemo(() => {
    return history
      .filter(item => {
        const matchesSearch = 
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.time.includes(searchTerm);

        const matchesStrength = 
          filterStrength === 'ALL' || item.strength === filterStrength;

        return matchesSearch && matchesStrength;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return sortDesc ? b.score - a.score : a.score - b.score;
        }
        return sortDesc 
          ? b.time.localeCompare(a.time) 
          : a.time.localeCompare(b.time);
      });
  }, [history, searchTerm, filterStrength, sortBy, sortDesc]);

  const handleClearWithConfirm = () => {
    if (window.confirm('Are you sure you want to permanently clear all security audit records?')) {
      onClearHistory();
      onTriggerToast('Zero-knowledge audit logs have been purged.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Zero-Knowledge Notice */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/25 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="font-semibold text-white">Zero-Knowledge Guarantee:</strong> Raw candidate passwords are never recorded, hashed, or retained in persistent memory. Only cryptographic metadata is stored.
          </span>
        </div>

        {history.length > 0 && (
          <button
            id="clear-history-btn"
            onClick={handleClearWithConfirm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors shrink-0 font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Control Bar: Search + Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="history-search-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search audit time, classification, or status..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0e1629]/70 border border-cyan-500/20 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'Strong', 'Medium', 'Weak'] as const).map(tier => (
            <button
              key={tier}
              id={`filter-btn-${tier}`}
              onClick={() => setFilterStrength(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterStrength === tier
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs shadow-cyan-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tier === 'ALL' ? 'All Audits' : tier}
            </button>
          ))}

          {/* Sort button */}
          <button
            onClick={() => {
              if (sortBy === 'date') {
                setSortBy('score');
              } else {
                setSortBy('date');
                setSortDesc(!sortDesc);
              }
            }}
            className="p-1.5 rounded-lg bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Toggle sorting (Date / Score)"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl overflow-hidden shadow-xl">
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090f1d] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3.5 px-4">Strength Tier</th>
                  <th className="py-3.5 px-4">Entropy Score</th>
                  <th className="py-3.5 px-4">Result Category</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Audit Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.time}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.strength === 'Strong'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.strength === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.strength}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {item.score} / 5
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {item.category}
                      <span className="block text-[10px] text-slate-500">{item.status}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <ShieldOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Audit Records Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              {searchTerm || filterStrength !== 'ALL'
                ? 'No evaluations match your search and filter criteria.'
                : 'No passwords have been evaluated yet. Run your first audit to generate real-time security telemetry.'}
            </p>
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Run Password Audit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
