import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Search, 
  Clock, 
  HardDriveDownload,
  Settings,
  BrainCircuit,
  BookOpen,
  Sparkles,
  Bot,
  Menu,
  X,
  Compass,
  FolderLock
} from 'lucide-react';

export function Navbar({
  vaultData,
  activeProject,
  searchQuery,
  setSearchQuery,
  mainViewMode = 'vault',
  setMainViewMode,
  onOpenNewSecret,
  onOpenBackup,
  onOpenSettings,
  onOpenAiPlayground,
  onOpenGuide,
  onOpenAutoOrganizer,
  onOpenCopilotChat,
  onLockVault,
  autoLockMinutes = 15,
  lastActivityTime,
  isMobileMenuOpen,
  onToggleMobileMenu
}) {
  const [remainingTimeStr, setRemainingTimeStr] = useState('');

  useEffect(() => {
    if (!autoLockMinutes || autoLockMinutes === 0) {
      setRemainingTimeStr('Infinito');
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - (lastActivityTime || now);
      const totalMs = autoLockMinutes * 60 * 1000;
      const remainingMs = Math.max(0, totalMs - elapsedMs);

      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);

      setRemainingTimeStr(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoLockMinutes, lastActivityTime]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-vault-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalSecrets = vaultData?.secrets?.length || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-vault-950/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
        
        {/* Left: Mobile Menu Toggle + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Menú de Navegación"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => setMainViewMode('vault')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-950/40 shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 sm:w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-100 tracking-tight">
                  Dev<span className="text-emerald-400">Vault</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  PRO AI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Main View Switcher Pills */}
        <div className="flex items-center gap-1 bg-vault-900 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setMainViewMode('vault')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mainViewMode === 'vault'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Mi Bóveda</span>
            <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full ${
              mainViewMode === 'vault' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {totalSecrets}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMainViewMode('encyclopedia')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mainViewMode === 'encyclopedia'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enciclopedia de 120+ APIs & IA</span>
            <span className="hidden md:inline-block text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              30+ IA
            </span>
          </button>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* AI Auto Organizer CTA */}
          <button
            onClick={onOpenAutoOrganizer}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-all cursor-pointer shadow-sm"
            title="Auto-organizar con IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Organizar con IA</span>
          </button>

          {/* AI Copilot Chat */}
          <button
            onClick={onOpenCopilotChat}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-semibold text-xs transition-all cursor-pointer"
            title="Copilot Chat"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">Copilot</span>
          </button>

          {/* New Secret CTA */}
          <button
            onClick={onOpenNewSecret}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Ajustes"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Lock Button */}
          <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-slate-800">
            <button
              onClick={onLockVault}
              title="Bloquear Caja Fuerte"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Bloquear</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
