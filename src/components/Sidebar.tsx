import React from 'react';
import { 
  ShieldCheck, LayoutDashboard, KeyRound, Wand2, 
  History, PieChart, Sliders, LogOut, Code2, Lock, X
} from 'lucide-react';
import { PageView } from '../types';

interface SidebarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard' as PageView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze' as PageView, label: 'Analyze Password', icon: KeyRound },
    { id: 'generator' as PageView, label: 'Password Generator', icon: Wand2 },
    { id: 'history' as PageView, label: 'History', icon: History },
    { id: 'statistics' as PageView, label: 'Security Statistics', icon: PieChart },
    { id: 'settings' as PageView, label: 'Settings', icon: Sliders },
    { id: 'code_viewer' as PageView, label: 'Flask Files (VS Code)', icon: Code2, highlight: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0f1d] border-r border-cyan-500/15 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="p-5 border-b border-cyan-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
                Secure<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Pass</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Security Suite</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3.5 flex-1 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border-l-3 border-cyan-400 font-medium'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                <span className="truncate">{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Flask
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-cyan-500/15 space-y-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
            <span className="text-[11px] font-medium">Zero-Knowledge Active</span>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={() => {
              onNavigate('logout');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
