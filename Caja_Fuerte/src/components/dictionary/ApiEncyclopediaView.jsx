import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  BookOpen, 
  BrainCircuit, 
  Mic, 
  Database, 
  Mail, 
  CreditCard, 
  ShieldCheck, 
  Cloud, 
  MapPin, 
  Layers,
  ArrowRight,
  Zap,
  Info,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { API_DICTIONARY, DICTIONARY_CATEGORIES } from '../../data/apiDictionary';

export function ApiEncyclopediaView({ onConnectApiToVault }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ai-llm'); // Default directly to AI & LLMs so the 30+ AI models are immediately in front of the user!
  const [copiedId, setCopiedId] = useState(null);
  const [selectedApiDetail, setSelectedApiDetail] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredApis = API_DICTIONARY.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.useCase.toLowerCase().includes(query) ||
      item.defaultVarName.toLowerCase().includes(query) ||
      (item.badge && item.badge.toLowerCase().includes(query));

    return matchCat && matchSearch;
  });

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'ai-llm': return BrainCircuit;
      case 'ai-voice': return Mic;
      case 'ai-search-scraping': return Search;
      case 'ai-vision-media': return Sparkles;
      case 'database-vector': return Database;
      case 'auth-security': return ShieldCheck;
      case 'email-messaging': return Mail;
      case 'payments-fintech': return CreditCard;
      case 'cloud-devops': return Cloud;
      case 'maps-geo-weather': return MapPin;
      case 'productivity-social': return Layers;
      default: return Sparkles;
    }
  };

  // Count items per category
  const getCategoryItemCount = (catId) => {
    if (catId === 'all') return API_DICTIONARY.length;
    return API_DICTIONARY.filter(item => item.category === catId).length;
  };

  const aiTotalCount = API_DICTIONARY.filter(i => i.category.startsWith('ai')).length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      
      {/* 1. Big Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-vault-900 via-vault-900/90 to-cyan-950/40 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-cyan-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DIRECTORIO VISUAL DE 120+ APIS Y MODELOS CLOUD</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Enciclopedia de APIs de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300">Inteligencia Artificial & Desarrollo</span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Aquí tienes la lista completa y organizada de <strong>más de {aiTotalCount} APIs de Inteligencia Artificial (Gemini, Groq, Qwen, Cerebras, SambaNova, Mistral, Hugging Face, DeepSeek...)</strong> y más de 100 servicios cloud. Todas cuentan con <strong>acceso 100% en la nube y cuotas gratuitas</strong> sin tener que instalar software pesado en tu PC.
          </p>
        </div>
      </div>

      {/* 2. Category Tabs & Search Bar */}
      <div className="space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Buscar por nombre (ej. Gemini, Groq, Qwen, DeepSeek), variable (ej. GEMINI_API_KEY) o caso de uso..."
            className="w-full pl-12 pr-10 py-3.5 bg-vault-900 border border-slate-700/90 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-sm text-slate-400 hover:text-slate-100"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {DICTIONARY_CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = selectedCategory === cat.id;
            const count = getCategoryItemCount(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                    : 'bg-vault-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950 stroke-[2.5]' : cat.color || 'text-slate-400'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. APIs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredApis.map(api => (
          <div
            key={api.id}
            className="p-5 bg-vault-900/90 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-cyan-950/30 group"
          >
            {/* Card Top: Title & Variable */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform shrink-0" />
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {api.name}
                    </h3>
                  </div>
                  {api.badge && (
                    <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {api.badge}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(api.id, api.defaultVarName)}
                  className="p-2 rounded-xl bg-vault-950 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 shrink-0 transition-colors cursor-pointer"
                  title="Copiar nombre de variable .env"
                >
                  {copiedId === api.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Recommended Variable Name */}
              <div className="p-2 rounded-xl bg-vault-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">Variable .env:</span>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {api.defaultVarName}
                </span>
              </div>

              {/* ¿De qué trata? */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  ¿De qué trata?
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {api.description}
                </p>
              </div>

              {/* ¿Para qué sirve en tus proyectos? */}
              <div className="p-3 rounded-2xl bg-vault-950/80 border border-slate-800/90 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <span>💡</span>
                  <span>¿Para qué te sirve?</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {api.useCase}
                </p>
              </div>

              {/* Free Tier Info Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <span className="text-base shrink-0">🎁</span>
                <div className="leading-snug">
                  <span className="font-bold block text-[11px] uppercase tracking-wider font-mono">Cuota Gratuita:</span>
                  <span className="text-[11px]">{api.freeTier}</span>
                </div>
              </div>
            </div>

            {/* Card Bottom: Action Buttons */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              {api.consoleUrl && (
                <a
                  href={api.consoleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-cyan-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                >
                  <span>Obtener Clave</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={() => onConnectApiToVault(api)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-950/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Guardar en Bóveda</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {filteredApis.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-vault-900/50 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No se encontraron APIs que coincidan con "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-xl font-bold text-xs hover:bg-cyan-500/30"
          >
            Ver todas las 120+ APIs
          </button>
        </div>
      )}

    </div>
  );
}
