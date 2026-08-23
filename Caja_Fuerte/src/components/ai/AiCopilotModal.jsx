import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  Clock, 
  User, 
  Check, 
  Wand2,
  FolderKanban
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { askVaultCopilot } from '../../services/vaultAiOrganizer';

export function AiCopilotModal({
  isOpen,
  onClose,
  vaultData,
  slots = [],
  onOpenAutoOrganizer
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu **Copiloto de DevVault**. Puedo ayudarte a organizar tus proyectos, renombrar variables, categorizar tus claves de IA y responder preguntas sobre la seguridad de tu caja fuerte.\n\n¿En qué te puedo ayudar hoy?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    '🪄 Organiza mis proyectos y claves automáticamente',
    '🏷️ Normaliza los nombres de variables al estándar .env',
    '📁 Crea un proyecto para Bots de IA y clasifícalos',
    '🔍 Revisa si tengo alguna clave débil o duplicada'
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await askVaultCopilot({
        userMessage: text,
        vaultData,
        slots,
        conversationHistory: messages
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.message,
          usedSlot: response.usedSlot,
          latencyMs: response.latencyMs
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Hubo un problema al procesar tu solicitud: ${err.message}`,
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vault Copilot: Chat Asistente de Bóveda"
      maxWidth="max-w-3xl"
      icon={Bot}
    >
      <div className="space-y-4 flex flex-col h-[65vh]">
        
        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-800">
          {quickPrompts.map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (promptText.includes('Organiza mis proyectos')) {
                  onClose();
                  onOpenAutoOrganizer();
                } else {
                  handleSend(promptText);
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-vault-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-vault-950/90 rounded-2xl border border-slate-800 font-sans text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-xl space-y-1.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                    : msg.isError
                    ? 'bg-rose-500/10 border border-rose-500/30 text-rose-200'
                    : 'bg-vault-900/90 border border-slate-800 text-slate-200 rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.usedSlot && (
                  <div className="text-[10px] text-slate-400 pt-1 font-mono flex items-center gap-1 border-t border-slate-800/60">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{msg.usedSlot} ({msg.latencyMs} ms)</span>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-vault-900 border border-slate-800 rounded-2xl text-slate-400 text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Analizando instrucción y consultando el enrutador de IA...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pídele a la IA que mueva, renombre, organice o audite tus claves..."
            className="flex-1 px-4 py-2.5 bg-vault-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono shadow-inner"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </Modal>
  );
}
