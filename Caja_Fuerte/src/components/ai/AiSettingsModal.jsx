import React, { useState } from 'react';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  Key, 
  Layers, 
  Globe, 
  ExternalLink,
  ShieldCheck,
  Check,
  Search,
  Flame,
  Wind
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { AI_PROVIDERS, generateDefaultProviderSlots } from '../../services/aiRouter';
import { testApiKey } from '../../services/apiTester';

export function AiSettingsModal({
  isOpen,
  onClose,
  configuredProviderSlots = {},
  onSaveSlots,
  vaultSecrets = []
}) {
  const [selectedProviderId, setSelectedProviderId] = useState('gemini');
  const [providerSearch, setProviderSearch] = useState('');
  const [slotsData, setSlotsData] = useState(() => {
    const defaultSlots = generateDefaultProviderSlots();
    return { ...defaultSlots, ...configuredProviderSlots };
  });

  const [testResults, setTestResults] = useState({});
  const [testingSlotId, setTestingSlotId] = useState(null);

  const activeProvider = AI_PROVIDERS.find(p => p.id === selectedProviderId) || AI_PROVIDERS[0];
  const currentProviderSlots = slotsData[selectedProviderId] || [];

  const handleUpdateSlot = (providerId, slotIndex, updates) => {
    setSlotsData(prev => {
      const currentList = [...(prev[providerId] || [])];
      currentList[slotIndex] = { ...currentList[slotIndex], ...updates };
      return { ...prev, [providerId]: currentList };
    });
  };

  const handleSelectFromVault = (providerId, slotIndex, secretId) => {
    const sec = vaultSecrets.find(s => s.id === secretId);
    if (!sec) return;

    handleUpdateSlot(providerId, slotIndex, {
      secretId,
      apiKey: sec.value
    });
  };

  const handleTestSlot = async (slot) => {
    setTestingSlotId(slot.id);
    const keyToTest = slot.apiKey;
    const res = await testApiKey(selectedProviderId, keyToTest);
    setTestResults(prev => ({ ...prev, [slot.id]: res }));
    setTestingSlotId(null);
  };

  const handleSave = () => {
    onSaveSlots(slotsData);
    onClose();
  };

  const getActiveKeyCount = (providerId) => {
    const list = slotsData[providerId] || [];
    return list.filter(s => Boolean(s.apiKey && s.apiKey.trim())).length;
  };

  const totalActiveKeys = AI_PROVIDERS.reduce((sum, p) => sum + getActiveKeyCount(p.id), 0);

  const filteredProviders = AI_PROVIDERS.filter(p => 
    p.name.toLowerCase().includes(providerSearch.toLowerCase()) ||
    p.group?.toLowerCase().includes(providerSearch.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Piscina de IA: 15 Proveedores Gratuitos x 3 Cuentas (45 Slots)"
      maxWidth="max-w-5xl"
      icon={Cpu}
    >
      <div className="space-y-5">
        
        {/* Top Header Banner */}
        <div className="p-4 bg-gradient-to-r from-purple-500/15 via-emerald-500/15 to-cyan-500/15 rounded-3xl border border-cyan-500/30 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Enrutador Multi-Proveedor de Cascada & Rotación Automática</span>
            </h4>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {totalActiveKeys} Claves Activas en la Piscina
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Puedes configurar <strong>hasta 3 cuentas o API Keys por cada proveedor gratuito</strong>. Si una cuenta agota sus límites de peticiones (429), el enrutador conmutará automáticamente a la siguiente cuenta o al siguiente proveedor disponible en la nube.
          </p>
        </div>

        {/* Search & Provider Selector Tabs */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Selecciona un Proveedor ({filteredProviders.length}):
            </span>

            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                placeholder="Buscar proveedor..."
                className="w-full pl-8 pr-3 py-1 bg-vault-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Provider Grid Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 bg-vault-950/60 rounded-2xl border border-slate-800/80">
            {filteredProviders.map(p => {
              const count = getActiveKeyCount(p.id);
              const isSelected = selectedProviderId === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProviderId(p.id)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-2 border-cyan-500 text-slate-100 shadow-md'
                      : 'bg-vault-900/70 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="truncate pr-1">
                    <span className="font-bold truncate block text-[11px]">{p.name.split(' (')[0]}</span>
                    <span className="text-[9px] text-slate-500 block truncate">{p.group}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                    count > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {count}/3
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Provider Info & Link */}
        <div className="p-3.5 bg-vault-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200 text-sm">{activeProvider.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                {activeProvider.group}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">{activeProvider.freeInfo}</p>
          </div>

          <a
            href={activeProvider.consoleUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 shrink-0 text-xs"
          >
            <span>Obtener Clave Gratis</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Slots for this Provider */}
        <div className="space-y-3">
          {currentProviderSlots.map((slot, index) => {
            const isTesting = testingSlotId === slot.id;
            const testResult = testResults[slot.id];

            return (
              <div
                key={slot.id || index}
                className="p-3.5 bg-vault-900/90 rounded-2xl border border-slate-800 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-mono font-bold text-[11px] flex items-center justify-center border border-slate-700">
                      {index + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-200">{slot.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {vaultSecrets.length > 0 && (
                      <select
                        onChange={(e) => handleSelectFromVault(selectedProviderId, index, e.target.value)}
                        defaultValue=""
                        className="px-2 py-1 bg-vault-950 border border-slate-700 rounded-lg text-[11px] text-slate-300 focus:outline-none max-w-[160px] truncate"
                      >
                        <option value="" disabled>Elegir de bóveda...</option>
                        {vaultSecrets.map(s => (
                          <option key={s.id} value={s.id}>{s.title || s.varName}</option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => handleTestSlot(slot)}
                      disabled={!slot.apiKey || isTesting}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1 shrink-0"
                    >
                      {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-amber-400" />}
                      <span>Test</span>
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    type="password"
                    value={slot.apiKey || ''}
                    onChange={(e) => handleUpdateSlot(selectedProviderId, index, { apiKey: e.target.value, secretId: '' })}
                    placeholder={`Pega tu API Key de ${activeProvider.name} (Cuenta ${index + 1})...`}
                    className="w-full px-3 py-2 bg-vault-950 border border-slate-700 rounded-xl font-mono text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {testResult && (
                  <div className={`p-2 rounded-xl text-[11px] flex items-center gap-2 ${
                    testResult.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    <span>{testResult.message} ({testResult.latencyMs} ms)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
          >
            Guardar Piscina de Claves ({totalActiveKeys} activas)
          </button>
        </div>

      </div>
    </Modal>
  );
}
