import React, { useState, useEffect } from 'react';
import { PageView, AuditLog, SecurityStats } from './types';
import { INITIAL_AUDIT_LOGS, computeStats } from './utils/security';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ToastContainer, ToastItem } from './components/ToastContainer';
import { LandingView } from './components/LandingView';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { AnalyzerView } from './components/AnalyzerView';
import { GeneratorView } from './components/GeneratorView';
import { HistoryView } from './components/HistoryView';
import { StatisticsView } from './components/StatisticsView';
import { SettingsView } from './components/SettingsView';
import { LogoutView } from './components/LogoutView';
import { FlaskCodeViewer } from './components/FlaskCodeViewer';
import { NotFoundView } from './components/NotFoundView';

const VALID_VIEWS: PageView[] = [
  'landing',
  'login',
  'dashboard',
  'analyze',
  'generator',
  'history',
  'statistics',
  'settings',
  'logout',
  'code_viewer'
];

function parseCurrentRoute(): PageView {
  if (typeof window === 'undefined') return 'dashboard';
  
  // 1. Check hash first (e.g. #analyze or #/analyze)
  const hash = window.location.hash.replace(/^#[/]?/, '').trim().toLowerCase();
  if (hash) {
    if (VALID_VIEWS.includes(hash as PageView)) {
      return hash as PageView;
    }
    return 'not_found';
  }

  // 2. Check path (for direct subpath access e.g. /login or /generator)
  const pathname = window.location.pathname.replace(/^[/]/, '').replace(/[/]$/, '').trim().toLowerCase();
  if (pathname && pathname !== 'index.html') {
    if (VALID_VIEWS.includes(pathname as PageView)) {
      return pathname as PageView;
    }
    return 'not_found';
  }

  return 'dashboard';
}

export function App() {
  const [currentView, setCurrentView] = useState<PageView>(() => parseCurrentRoute());
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState('secops_admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Synchronize routing on hash change (back/forward or deep links)
  useEffect(() => {
    const handleHashOrPopState = () => {
      const parsed = parseCurrentRoute();
      setCurrentView(parsed);
    };

    window.addEventListener('hashchange', handleHashOrPopState);
    window.addEventListener('popstate', handleHashOrPopState);
    return () => {
      window.removeEventListener('hashchange', handleHashOrPopState);
      window.removeEventListener('popstate', handleHashOrPopState);
    };
  }, []);

  const navigate = (view: PageView) => {
    if (view === 'logout') {
      handleLogout();
      return;
    }
    setCurrentView(view);
    try {
      if (view === 'dashboard') {
        window.location.hash = '';
      } else {
        window.location.hash = view;
      }
    } catch {
      // ignore
    }
  };

  // Load audit history from local state or fallback
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('securepass_audits');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('securepass_audits', JSON.stringify(auditLogs));
    } catch {
      // ignore
    }
  }, [auditLogs]);

  // Compute stats reactively
  const stats: SecurityStats = React.useMemo(() => {
    return computeStats(auditLogs);
  }, [auditLogs]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleRecordAudit = (entry: AuditLog) => {
    setAuditLogs(prev => [entry, ...prev]);
  };

  const handleClearHistory = () => {
    setAuditLogs([]);
  };

  const handleLoginSuccess = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    navigate('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('logout');
    addToast('Operator session securely terminated', 'info');
  };

  // Determine page title for topbar
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Security Overview & Telemetry';
      case 'analyze': return 'Heuristic Password Strength Analyzer';
      case 'generator': return 'Cryptographic Password Generator';
      case 'history': return 'Zero-Knowledge Audit Trail';
      case 'statistics': return 'Security Statistics & Analytics';
      case 'settings': return 'SecOps Policies & Application Settings';
      case 'code_viewer': return 'Python Flask Project Source Explorer';
      case 'not_found': return 'Route Not Found';
      default: return 'SecurePass Console';
    }
  };

  // Dedicated standalone full-screen pages
  if (currentView === 'landing') {
    return (
      <>
        <LandingView onNavigate={navigate} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  if (currentView === 'login') {
    return (
      <>
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigate}
          onTriggerToast={addToast}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  if (currentView === 'logout') {
    return (
      <>
        <LogoutView onNavigate={navigate} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  if (currentView === 'not_found') {
    return (
      <>
        <NotFoundView onNavigate={navigate} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // Dashboard & Authenticated Shell Layout
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={navigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          pageTitle={getPageTitle()}
          username={username}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNavigate={navigate}
          onTriggerToast={addToast}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              username={username}
              stats={stats}
              recentHistory={auditLogs}
              onNavigate={navigate}
            />
          )}

          {currentView === 'analyze' && (
            <AnalyzerView
              onRecordAudit={handleRecordAudit}
              onNavigate={navigate}
              onTriggerToast={addToast}
            />
          )}

          {currentView === 'generator' && (
            <GeneratorView onTriggerToast={addToast} />
          )}

          {currentView === 'history' && (
            <HistoryView
              history={auditLogs}
              onClearHistory={handleClearHistory}
              onNavigate={navigate}
              onTriggerToast={addToast}
            />
          )}

          {currentView === 'statistics' && (
            <StatisticsView stats={stats} />
          )}

          {currentView === 'settings' && (
            <SettingsView
              username={username}
              onUpdateUsername={setUsername}
              onTriggerToast={addToast}
            />
          )}

          {currentView === 'code_viewer' && (
            <FlaskCodeViewer onTriggerToast={addToast} />
          )}
        </main>

        <footer className="border-t border-cyan-500/10 py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-mono text-[11px]">
              SecurePass v2.4 • NIST 800-63B & OWASP Compliant
            </span>
            <span className="text-[11px] text-cyan-400/80">
              Zero-Knowledge Credential Architecture
            </span>
          </div>
        </footer>
      </div>

      {/* Global Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
