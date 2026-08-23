import React, { useState } from 'react';
import { 
  Sparkles, 
  FolderKanban, 
  ArrowRight, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  Cpu,
  Settings
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { analyzeVaultOrganization, applyOrganizationPlan } from '../../services/vaultAiOrganizer';

export function AiOrganizerModal({
  isOpen,
  onClose,
  vaultData,
  slots = [],
  onApplyReorganization,
  onOpenAiSettings
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [filterMode, setFilterMode] = useState('changes'); // 'changes' | 'all'

  const handleRunAnalysis = async () => {
    setError('');
    setAnalyzing(true);
    setPlan(null);

    try {
      const result = await analyzeVaultOrganization({
        vaultData,
        slots
      });
      setPlan(result);
    } catch (err) {
      setError(err.message || 'Error al ejecutar el análisis con IA.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!plan) return;
    const updatedVault = applyOrganizationPlan(vaultData, plan);
    onApplyReorganization(updatedVault);
    onClose();
  };

  const itemsToDisplay = plan?.items?.filter(item => {
    if (filterMode === 'changes') return item.hasChanges;
    return true;
  }) || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Auto-Organizador Inteligente de Bóveda"
      maxWidth="max-w-5xl"
      icon={Sparkles}
    >
      <div className="space-y-6">
        
        {/* Top Action / Header Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-purple-500/15 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Limpieza y Reestructuración Autónoma con IA</span>
            </h4>
            <p className="text-slate-300 mt-1 max-w-xl">
              La IA analizará todas tus claves, normalizará variables desordenadas (ej. <code>gemini_key</code> → <code>GEMINI_API_KEY</code>), creará carpetas lógicas por proyecto y corregirá categorías.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenAiSettings}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
              title="Configurar Slots de IA"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analizando bóveda con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{plan ? 'Re-analizar Bóveda' : 'Analizar y Organizar Ahora'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Error en el análisis de IA:</span>
              <p className="text-rose-200/90 whitespace-pre-line">{error}</p>
              <button
                onClick={onOpenAiSettings}
                className="mt-2 inline-flex items-center gap-1 font-semibold text-cyan-300 underline"
              >
                Revisar configuración de API Keys / Slots de IA
              </button>
            </div>
          </div>
        )}

        {/* Plan Results View */}
        {plan && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* AI Summary Banner */}
            <div className="p-4 bg-vault-900/90 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Diagnóstico y Plan Propuesto:
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {plan.summary}
                </p>
                <span className="text-[11px] text-slate-500 font-mono">
                  Procesado con {plan.usedSlot} ({plan.latencyMs} ms) • {plan.totalChanges} cambios recomendados
                </span>
              </div>

              {/* Filter switch */}
              <div className="flex items-center gap-1 bg-vault-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setFilterMode('changes')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterMode === 'changes' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Solo Cambios ({plan.totalChanges})
                </button>
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterMode === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ver Todos ({plan.items.length})
                </button>
              </div>
            </div>

            {/* Suggested New Projects */}
            {plan.suggestedProjects && plan.suggestedProjects.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
                  <FolderKanban className="w-3.5 h-3.5" />
                  Nuevos Proyectos / Carpetas a Crear ({plan.suggestedProjects.length}):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {plan.suggestedProjects.map((p, idx) => (
                    <div key={idx} className="p-3 bg-vault-950 rounded-xl border border-slate-800 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color || '#06b6d4' }} />
                      <div>
                        <span className="font-bold text-xs text-slate-200 block truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{p.description || 'Carpeta organizada'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diff Table of Secrets */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-vault-900 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3">Secreto</th>
                      <th className="px-4 py-3">Estado Actual</th>
                      <th className="px-4 py-3 text-emerald-400">Propuesta de la IA</th>
                      <th className="px-4 py-3">Motivo / Razón</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {itemsToDisplay.map((item) => (
                      <tr key={item.id} className={`hover:bg-slate-800/30 transition-colors ${item.hasChanges ? 'bg-emerald-500/5' : ''}`}>
                        <td className="px-4 py-3 font-semibold text-slate-200 font-sans">
                          {item.original?.title || item.original?.varName || item.newTitle}
                        </td>

                        <td className="px-4 py-3 text-slate-400 space-y-1">
                          <div className="text-slate-300 font-bold">{item.original?.varName}</div>
                          <div className="text-[11px] text-slate-500 font-sans">Carpeta: {vaultData.projects.find(p => p.id === item.original?.projectId)?.name || 'Global'}</div>
                        </td>

                        <td className="px-4 py-3 space-y-1">
                          <div className={`font-bold flex items-center gap-1.5 ${item.diffDetails?.isVarNameChanged ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {item.diffDetails?.isVarNameChanged && <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />}
                            <span>{item.newVarName}</span>
                          </div>
                          <div className="text-[11px] text-cyan-300 font-sans">
                            📁 {item.targetProjectName || 'Global'}
                          </div>
                        </td>

                        <td className="px-4 py-3 font-sans text-slate-400 text-[11px]">
                          {item.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Apply Button Bar */}
            <div className="flex items-center justify-between p-4 bg-vault-950 rounded-2xl border border-emerald-500/30">
              <span className="text-xs text-slate-300">
                Al hacer clic, todos los cambios se aplicarán y se guardarán cifrados en tu caja fuerte.
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Descartar
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Aplicar Organización con IA</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </Modal>
  );
}
