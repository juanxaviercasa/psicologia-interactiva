import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  BrainCircuit, 
  Terminal, 
  ShieldCheck, 
  Lock, 
  Check, 
  Copy, 
  ExternalLink, 
  FolderKanban, 
  Zap, 
  Database, 
  Search,
  Globe,
  Mic,
  Cpu,
  Layers
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { PROVIDER_TEMPLATES } from '../../data/providers';

export function InteractiveGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'structure' | 'env-usage' | 'devops' | 'security'
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCatalog = PROVIDER_TEMPLATES.filter(p => {
    const matchCat = catalogCategoryFilter === 'all' || p.category === catalogCategoryFilter;
    const matchSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                        p.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                        p.defaultVarName.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Centro de Aprendizaje: Manual Pro & Catálogo de IA Gratuita"
      maxWidth="max-w-5xl"
      icon={BookOpen}
    >
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Catálogo 30+ APIs Cloud Gratuitas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'structure'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-cyan-400" />
            <span>Estructura de Proyectos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('env-usage')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'env-usage'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Cómo Usar .env en Código Real</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('devops')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'devops'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Buenas Prácticas Git & CI/CD</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Seguridad Zero-Knowledge</span>
          </button>
        </div>

        {/* TAB 1: CATALOG OF 30+ FREE AI APIS */}
        {activeTab === 'catalog' && (
          <div className="space-y-5 animate-fadeIn">
            
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent rounded-2xl border border-emerald-500/20 text-xs space-y-1">
              <h4 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>30+ APIs de Inteligencia Artificial y Cloud 100% en la Nube</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Todas estas plataformas ofrecen <strong>acceso directo por API sin tener que descargar software local ni modelos en tu PC</strong>. Puedes crear cuentas gratuitas y guardar tus claves aquí en DevVault para usarlas en cualquier momento.
              </p>
            </div>

            {/* Filter and search bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setCatalogCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    catalogCategoryFilter === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  Todos ({PROVIDER_TEMPLATES.length})
                </button>
                <button
                  onClick={() => setCatalogCategoryFilter('ai')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    catalogCategoryFilter === 'ai' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  LLMs & Razonamiento
                </button>
                <button
                  onClick={() => setCatalogCategoryFilter('ai-voice')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    catalogCategoryFilter === 'ai-voice' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  Voz & Audio
                </button>
                <button
                  onClick={() => setCatalogCategoryFilter('ai-search')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    catalogCategoryFilter === 'ai-search' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  Búsqueda & RAG
                </button>
                <button
                  onClick={() => setCatalogCategoryFilter('vector-db')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    catalogCategoryFilter === 'vector-db' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  Vector DBs
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Buscar por nombre o variable..."
                  className="w-full pl-8 pr-3 py-1 bg-vault-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredCatalog.map(p => (
                <div
                  key={p.id}
                  className="p-4 bg-vault-900/80 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-sm">{p.name}</span>
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {p.defaultVarName}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{p.description}</p>
                    <div className="text-[11px] text-emerald-400 font-medium">
                      🎁 {p.quotaInfo}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(p.id, p.defaultVarName)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === p.id ? 'Copiado' : 'Copiar Variable'}</span>
                    </button>

                    {p.consoleUrl && (
                      <a
                        href={p.consoleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
                      >
                        <span>Consola Oficial</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: STRUCTURE */}
        {activeTab === 'structure' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed animate-fadeIn">
            <h4 className="font-bold text-base text-slate-100">Cómo organizar tus claves estratégicamente</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-vault-900 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-400 block text-sm">1. Espacio Global (Compartido)</span>
                <p>
                  Guarda aquí tus <strong>API Keys personales de IA</strong> (Google AI Studio, Groq, Hugging Face, OpenRouter) que reutilizas en múltiples proyectos. Así solo las registras una vez.
                </p>
              </div>
              <div className="p-4 bg-vault-900 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 block text-sm">2. Por Proyecto Específico</span>
                <p>
                  Crea una carpeta por cada aplicación (ej. <em>"SaaS Cuentos"</em>, <em>"Bot Telegram"</em>) y guarda allí las bases de datos (Supabase/Neon), secretos JWT y webhooks exclusivos de esa app.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: .ENV USAGE */}
        {activeTab === 'env-usage' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed animate-fadeIn">
            <h4 className="font-bold text-base text-slate-100">Cómo cargar variables en tus proyectos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-vault-900 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
                <span className="font-bold text-cyan-400 font-sans block text-sm">🐍 En Python (FastAPI / Scripts)</span>
                <pre className="text-slate-300 bg-vault-950 p-2.5 rounded-xl border border-slate-800">
{`from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")`}
                </pre>
              </div>
              <div className="p-4 bg-vault-900 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
                <span className="font-bold text-emerald-400 font-sans block text-sm">⚡ En Node.js / Express</span>
                <pre className="text-slate-300 bg-vault-950 p-2.5 rounded-xl border border-slate-800">
{`import 'dotenv/config';

const apiKey = process.env.GROQ_API_KEY;`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEVOPS */}
        {activeTab === 'devops' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed animate-fadeIn">
            <h4 className="font-bold text-base text-slate-100">Reglas de Oro de Seguridad en Git y DevOps</h4>
            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-rose-200 space-y-2">
              <span className="font-bold text-sm">⚠️ NUNCA subas tus archivos `.env` a GitHub</span>
              <p>
                Asegúrate de que tu archivo <code>.gitignore</code> contenga la línea <code>.env</code>. Para tus compañeros de equipo, usa el botón <strong>"Descargar .env.example"</strong> en el Studio .env de DevVault.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed animate-fadeIn">
            <h4 className="font-bold text-base text-slate-100">Criptografía Militar Zero-Knowledge</h4>
            <p>
              Tus secretos se cifran localmente con el algoritmo autenticado <strong>AES-GCM (256 bits)</strong> y la derivación <strong>PBKDF2-SHA256 con 100,000 iteraciones</strong>. Tu contraseña maestra nunca se envía a ningún servidor y solo existe en la memoria volátil de tu navegador.
            </p>
          </div>
        )}

      </div>
    </Modal>
  );
}
