import React from 'react';
import { 
  Layers, 
  BrainCircuit, 
  Database, 
  Cloud, 
  KeyRound, 
  Sparkles, 
  FolderKanban, 
  Plus, 
  Globe, 
  FileCode, 
  Zap, 
  Wand2, 
  HardDriveDownload,
  FolderOpen,
  BookOpen,
  GitCompare,
  ShieldAlert,
  ShieldCheck,
  Calculator,
  Trash2,
  Code2,
  Bot,
  Cpu,
  X,
  Compass,
  FolderLock
} from 'lucide-react';
import { CATEGORIES, ENVIRONMENTS } from '../../data/providers';

export function Sidebar({
  projects = [],
  activeProjectId,
  setActiveProjectId,
  activeEnvironment,
  setActiveEnvironment,
  activeCategory,
  setActiveCategory,
  secrets = [],
  trashSecrets = [],
  mainViewMode = 'vault',
  setMainViewMode = () => {},
  onOpenProjectManager,
  onOpenEnvStudio,
  onOpenApiTester,
  onOpenPasswordGenerator,
  onOpenAiPlayground,
  onOpenSecurityAudit,
  onOpenEnvDiff,
  onOpenSdk,
  onOpenSanitizer,
  onOpenCalculator,
  onOpenTrashBin,
  onOpenGuide,
  onOpenAutoOrganizer,
  onOpenCopilotChat,
  onOpenAiSettings,
  isMobileMenuOpen = false,
  onCloseMobileMenu = () => {}
}) {
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'ai': return BrainCircuit;
      case 'ai-voice': return Zap;
      case 'ai-search': return Globe;
      case 'vector-db': return Database;
      case 'ai-vision': return Sparkles;
      case 'database': return Database;
      case 'cloud': return Cloud;
      case 'auth': return KeyRound;
      case 'custom': return Sparkles;
      default: return Layers;
    }
  };

  const getCategoryCount = (catId) => {
    return secrets.filter(sec => {
      const matchProj = activeProjectId === 'all' || sec.projectId === activeProjectId || sec.projectId === 'global-keys';
      const matchEnv = activeEnvironment === 'all' || sec.environment === activeEnvironment;
      const matchCat = catId === 'all' || sec.category === catId;
      return matchProj && matchEnv && matchCat;
    }).length;
  };

  const getProjectSecretCount = (projId) => {
    if (projId === 'all') return secrets.length;
    return secrets.filter(sec => sec.projectId === projId).length;
  };

  const sidebarContent = (
    <div className="w-72 p-4 flex flex-col gap-5 overflow-y-auto h-full bg-vault-950/95 lg:bg-vault-950/60">
      
      {/* Mobile Drawer Close Header */}
      <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-bold text-sm text-slate-200">Menú de Navegación</span>
        <button
          onClick={onCloseMobileMenu}
          className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 0. Primary Navigation Cards */}
      <div className="space-y-2">
        
        {/* Enciclopedia de 120+ APIs & IA */}
        <button
          onClick={() => { setMainViewMode('encyclopedia'); onCloseMobileMenu(); }}
          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-left shadow-lg group ${
            mainViewMode === 'encyclopedia'
              ? 'bg-gradient-to-r from-cyan-500/25 to-emerald-500/20 border-cyan-500 text-cyan-200 shadow-cyan-950/40 ring-1 ring-cyan-500'
              : 'bg-vault-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-100 font-extrabold text-xs">Enciclopedia de APIs & IA</span>
              <span className="text-[10px] text-cyan-300/80 font-mono">120+ APIs • 30+ Modelos IA</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-extrabold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/40">
            VER
          </span>
        </button>

        {/* Mi Bóveda */}
        <button
          onClick={() => { setMainViewMode('vault'); onCloseMobileMenu(); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-left ${
            mainViewMode === 'vault'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-950/30'
              : 'bg-vault-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FolderLock className="w-4 h-4 text-emerald-400" />
            <span>Mis Secretos Cifrados</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/30">
            {secrets.length}
          </span>
        </button>

        {/* Auto-Organizar con IA */}
        <button
          onClick={() => { onOpenAutoOrganizer(); onCloseMobileMenu(); }}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Auto-Organizar Bóveda (IA)</span>
          </div>
          <span className="text-[10px] text-purple-400 font-mono">AUTO</span>
        </button>

        {/* Copilot Chat */}
        <button
          onClick={() => { onOpenCopilotChat(); onCloseMobileMenu(); }}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Vault Copilot (Chat)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Chat</span>
        </button>
      </div>

      {/* 1. Projects Section (Visible for Vault) */}
      <div>
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            Proyectos ({projects.length})
          </span>
          <button
            onClick={() => { onOpenProjectManager(); onCloseMobileMenu(); }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-emerald-500/10 transition-colors cursor-pointer"
            title="Administrar Proyectos"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gestionar</span>
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => { setMainViewMode('vault'); setActiveProjectId('all'); onCloseMobileMenu(); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeProjectId === 'all' && mainViewMode === 'vault'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <FolderKanban className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Todos los Proyectos</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-800/80 text-slate-400 rounded-md">
              {secrets.length}
            </span>
          </button>

          {projects.map(proj => (
            <button
              key={proj.id}
              onClick={() => { setMainViewMode('vault'); setActiveProjectId(proj.id); onCloseMobileMenu(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeProjectId === proj.id && mainViewMode === 'vault'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: proj.color || '#10b981' }}
                />
                <span className="truncate">{proj.name}</span>
              </div>
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-800/80 text-slate-400 rounded-md shrink-0">
                {getProjectSecretCount(proj.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Environments Filter */}
      <div>
        <div className="px-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Entorno
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 bg-vault-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => { setMainViewMode('vault'); setActiveEnvironment('all'); onCloseMobileMenu(); }}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeEnvironment === 'all' ? 'bg-slate-800 text-slate-100 shadow-inner' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => { setMainViewMode('vault'); setActiveEnvironment('development'); onCloseMobileMenu(); }}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeEnvironment === 'development' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dev
          </button>
          <button
            onClick={() => { setMainViewMode('vault'); setActiveEnvironment('staging'); onCloseMobileMenu(); }}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeEnvironment === 'staging' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Staging
          </button>
          <button
            onClick={() => { setMainViewMode('vault'); setActiveEnvironment('production'); onCloseMobileMenu(); }}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeEnvironment === 'production' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prod
          </button>
        </div>
      </div>

      {/* 3. Categories Section */}
      <div>
        <div className="px-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Categorías
          </span>
        </div>
        <div className="space-y-1">
          {CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.id);
            const count = getCategoryCount(cat.id);
            const isSelected = activeCategory === cat.id && mainViewMode === 'vault';

            return (
              <button
                key={cat.id}
                onClick={() => { setMainViewMode('vault'); setActiveCategory(cat.id); onCloseMobileMenu(); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-slate-100 border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${cat.color || 'text-slate-400'}`} />
                  <span>{cat.name}</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-800/80 text-slate-400 rounded-md">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Pro Developer Tools Suite */}
      <div className="pt-3 border-t border-slate-800/80 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono px-2 block mb-1">
          Herramientas Pro
        </span>

        <button
          onClick={() => { onOpenAiSettings(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:bg-cyan-500/10 transition-colors text-left cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Piscina de IA (45 Slots)</span>
        </button>

        <button
          onClick={() => { onOpenAiPlayground(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-purple-300 hover:bg-purple-500/10 transition-colors text-left cursor-pointer"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>AI Prompt Playground</span>
        </button>

        <button
          onClick={() => { onOpenSecurityAudit(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:bg-emerald-500/10 transition-colors text-left cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Auditor de Vulnerabilidades</span>
        </button>

        <button
          onClick={() => { onOpenEnvDiff(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-300 hover:bg-blue-500/10 transition-colors text-left cursor-pointer"
        >
          <GitCompare className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Comparador Diff .env</span>
        </button>

        <button
          onClick={() => { onOpenSdk(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:bg-emerald-500/10 transition-colors text-left cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>SDK & DevOps Studio</span>
        </button>

        <button
          onClick={() => { onOpenSanitizer(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>Sanitizador Anti-Fugas</span>
        </button>

        <button
          onClick={() => { onOpenCalculator(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 hover:bg-amber-500/10 transition-colors text-left cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Calculadora de Tokens</span>
        </button>

        <button
          onClick={() => { onOpenEnvStudio(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:bg-cyan-500/10 transition-colors text-left cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Generar / Importar .env</span>
        </button>

        <button
          onClick={() => { onOpenGuide(); onCloseMobileMenu(); }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors text-left cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Manual & Guías</span>
        </button>

        {/* Trash Bin */}
        <button
          onClick={() => { onOpenTrashBin(); onCloseMobileMenu(); }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Papelera de Reciclaje</span>
          </div>
          {trashSecrets.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md">
              {trashSecrets.length}
            </span>
          )}
        </button>
      </div>

    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex shrink-0 border-r border-slate-800/90 bg-vault-950/60 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={onCloseMobileMenu}
          />
          <div className="relative z-10 animate-slideRight h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
