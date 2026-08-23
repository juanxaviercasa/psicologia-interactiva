import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Code2, 
  Layers, 
  BrainCircuit, 
  Mic, 
  Database, 
  Mail, 
  CreditCard, 
  ShieldCheck, 
  Cloud, 
  MapPin, 
  ChevronRight,
  Terminal,
  FileCode
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { API_DICTIONARY, DICTIONARY_CATEGORIES } from '../../data/apiDictionary';

export function ApiDictionaryModal({
  isOpen,
  onClose,
  onConnectApiToVault
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [inspectingSnippetApi, setInspectingSnippetApi] = useState(null);
  const [snippetLang, setSnippetLang] = useState('python'); // 'python' | 'node'

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Diccionario Universal de APIs (100+ Plataformas con Free Tiers)"
      maxWidth="max-w-6xl"
      icon={BookOpen}
    >
      <div className="space-y-5">
        
        {/* Top Header Banner */}
        <div className="p-4 bg-gradient-to-r from-cyan-500/15 via-emerald-500/15 to-purple-500/15 rounded-3xl border border-cyan-500/30 text-xs space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Directorio & Enciclopedia de APIs para Desarrolladores</span>
            </h4>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold self-start sm:self-auto">
              {filteredApis.length} APIs Encontradas
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Explora más de 100 APIs de Inteligencia Artificial, Voz, Scraping, Bases de Datos, Pagos y DevOps con <strong>planes gratuitos en la nube</strong>. Conoce para qué sirve cada una, cómo estructurar sus variables de entorno y guárdalas directamente en tu bóveda con 1 clic.
          </p>
        </div>

        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, tecnología, variable (ej. GEMINI, RESEND, STRIPE) o caso de uso..."
              className="w-full pl-10 pr-8 py-2.5 bg-vault-950 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Horizontal Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {DICTIONARY_CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 border-2 border-cyan-500 text-slate-100 shadow-md'
                    : 'bg-vault-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${cat.color || 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* APIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredApis.map(api => (
            <div
              key={api.id}
              className="p-4 bg-vault-900/90 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 text-xs flex flex-col justify-between group"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">
                      {api.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                        {api.defaultVarName}
                      </span>
                      {api.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {api.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(api.id, api.defaultVarName)}
                    className="p-1.5 rounded-lg bg-vault-950 text-slate-400 hover:text-slate-200 border border-slate-800 shrink-0"
                    title="Copiar nombre de variable .env"
                  >
                    {copiedId === api.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Description & Use Case */}
                <p className="text-slate-300 text-xs leading-relaxed">
                  {api.description}
                </p>

                <div className="p-2.5 rounded-xl bg-vault-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-amber-400 block font-mono">
                    💡 ¿Para qué usarlo en tus apps?
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {api.useCase}
                  </p>
                </div>

                {/* Free Tier Info */}
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <span>🎁</span>
                  <span>{api.freeTier}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {api.consoleUrl && (
                    <a
                      href={api.consoleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
                    >
                      <span>Obtener Clave</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {api.docsUrl && (
                    <a
                      href={api.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      <span>Docs</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onConnectApiToVault(api);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Guardar en mi Bóveda</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Modal>
  );
}
