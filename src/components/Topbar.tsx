import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, User, Shield, LogOut, Sliders } from 'lucide-react';
import { PageView } from '../types';

interface TopbarProps {
  pageTitle: string;
  username: string;
  onOpenSidebar: () => void;
  onNavigate: (view: PageView) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  pageTitle,
  username,
  onOpenSidebar,
  onNavigate,
  onTriggerToast
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#0b1020]/90 border-b border-cyan-500/15 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      {/* Left items: hamburger on mobile + Title */}
      <div className="flex items-center gap-3">
        <button
          id="topbar-menu-toggle"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">{pageTitle}</h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button */}
        <button
          id="topbar-search-btn"
          onClick={() => onTriggerToast('Global audit index active: Type on history page to filter', 'info')}
          className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
          title="Search Audits"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications button */}
        <button
          id="topbar-notif-btn"
          onClick={() => onTriggerToast('Threat Sensor Status: All NIST policies enforcing successfully.', 'success')}
          className="relative p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
          title="Security Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400" />
        </button>

        {/* User Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="user-profile-dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">{username}</div>
              <div className="text-[10px] text-slate-400 leading-tight">SecOps Admin</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0e1629] border border-cyan-500/20 shadow-2xl p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-white">{username}</div>
                <div className="text-[10px] text-cyan-400 font-mono">admin@securepass.io</div>
              </div>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Policies</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('analyze');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Analyze Password</span>
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button
                onClick={() => {
                  onNavigate('logout');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
