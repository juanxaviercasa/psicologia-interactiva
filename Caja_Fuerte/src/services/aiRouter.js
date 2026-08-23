/**
 * DevVault Multi-Provider AI Engine & Key Pool Router
 * Supports All Top Free Cloud AI Providers with up to 3 Key Slots each
 * 100% Cloud-based APIs with Free Tiers (No local installation needed)
 */

import { runPromptInference } from './aiPlayground';

export const AI_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google AI Studio (Gemini)',
    color: 'text-cyan-400',
    defaultModel: 'gemini-1.5-flash',
    consoleUrl: 'https://aistudio.google.com/app/apikey',
    freeInfo: '15 RPM / 1M TPM gratis por cuenta (Renovable diario)',
    group: 'LLM Líder'
  },
  {
    id: 'groq',
    name: 'Groq Cloud (LPU Llama 3.3)',
    color: 'text-amber-400',
    defaultModel: 'llama-3.3-70b-versatile',
    consoleUrl: 'https://console.groq.com/keys',
    freeInfo: '500+ tokens/s gratis en la nube sin tarjeta',
    group: 'Velocidad Extrema'
  },
  {
    id: 'qwen',
    name: 'Qwen / Alibaba ModelStudio',
    color: 'text-blue-400',
    defaultModel: 'qwen-plus',
    consoleUrl: 'https://bailian.console.aliyun.com',
    freeInfo: 'Millones de tokens gratuitos al registrarte',
    group: 'Modelos Qwen 2.5'
  },
  {
    id: 'cerebras',
    name: 'Cerebras Cloud',
    color: 'text-rose-400',
    defaultModel: 'llama3.1-70b',
    consoleUrl: 'https://cloud.cerebras.ai',
    freeInfo: '1 millón de tokens por día gratis (1800 tok/s)',
    group: 'Velocidad Extrema'
  },
  {
    id: 'sambanova',
    name: 'SambaNova Cloud',
    color: 'text-orange-400',
    defaultModel: 'Meta-Llama-3.1-70B-Instruct',
    consoleUrl: 'https://cloud.sambanova.ai',
    freeInfo: 'Inferencia gratuita en chips Reconfigurable Dataflow',
    group: 'Modelos Gigantes'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face (Serverless)',
    color: 'text-yellow-400',
    defaultModel: 'meta-llama/Meta-Llama-3-8B-Instruct',
    consoleUrl: 'https://huggingface.co/settings/tokens',
    freeInfo: 'Tokens de lectura de usuario gratuitos',
    group: 'Comunidad Open Source'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (Modelos :free)',
    color: 'text-purple-400',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    consoleUrl: 'https://openrouter.ai/keys',
    freeInfo: '50+ modelos gratuitos unificados en la nube',
    group: 'Agregador Cloud'
  },
  {
    id: 'mistral',
    name: 'Mistral AI (Codestral & Nemo)',
    color: 'text-red-400',
    defaultModel: 'codestral-latest',
    consoleUrl: 'https://console.mistral.ai/api-keys/',
    freeInfo: 'Tier gratuito para Codestral y desarrollo',
    group: 'Código & Modelos Europeos'
  },
  {
    id: 'cohere',
    name: 'Cohere (Command R+)',
    color: 'text-teal-400',
    defaultModel: 'command-r-plus',
    consoleUrl: 'https://dashboard.cohere.com/api-keys',
    freeInfo: 'Trial Key permanente gratuita para desarrollo',
    group: 'RAG Empresarial'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI (V3 & R1)',
    color: 'text-blue-400',
    defaultModel: 'deepseek-chat',
    consoleUrl: 'https://platform.deepseek.com/api_keys',
    freeInfo: 'Créditos iniciales gratuitos de bienvenida',
    group: 'Razonamiento & Código'
  },
  {
    id: 'kimi',
    name: 'Moonshot AI (Kimi)',
    color: 'text-indigo-400',
    defaultModel: 'moonshot-v1-8k',
    consoleUrl: 'https://platform.moonshot.cn/console/api-keys',
    freeInfo: 'Contexto gigante con créditos iniciales gratuitos',
    group: 'Contexto Largo'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Workers AI',
    color: 'text-amber-500',
    defaultModel: '@cf/meta/llama-3.1-8b-instruct',
    consoleUrl: 'https://dash.cloudflare.com/profile/api-tokens',
    freeInfo: '10,000 neuronas / peticiones gratuitas diarias',
    group: 'Edge Serverless'
  },
  {
    id: 'together',
    name: 'Together AI',
    color: 'text-cyan-500',
    defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    consoleUrl: 'https://api.together.ai/settings/api-keys',
    freeInfo: '$5.00 USD de crédito gratuito inicial',
    group: 'Open Source Cloud'
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    color: 'text-amber-500',
    defaultModel: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
    consoleUrl: 'https://fireworks.ai/account/api-keys',
    freeInfo: '$1.00 USD de crédito para desarrollo',
    group: 'Inferencia Rápida'
  },
  {
    id: 'hyperbolic',
    name: 'Hyperbolic AI',
    color: 'text-emerald-400',
    defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
    consoleUrl: 'https://app.hyperbolic.xyz/settings',
    freeInfo: 'Créditos iniciales gratuitos para GPUs',
    group: 'GPU Descentralizada'
  }
];

// Generates default 3 slots for each provider
export function generateDefaultProviderSlots() {
  const slots = {};
  AI_PROVIDERS.forEach(provider => {
    slots[provider.id] = [
      { id: `${provider.id}-slot-1`, name: `${provider.name} - Cuenta 1`, apiKey: '', secretId: '', enabled: true },
      { id: `${provider.id}-slot-2`, name: `${provider.name} - Cuenta 2`, apiKey: '', secretId: '', enabled: true },
      { id: `${provider.id}-slot-3`, name: `${provider.name} - Cuenta 3`, apiKey: '', secretId: '', enabled: true }
    ];
  });
  return slots;
}

/**
 * Resolves all active slots from provider configuration or vault secrets
 */
export function getActiveAiPool(configuredProviderSlots = {}, vaultSecrets = []) {
  const defaultSlots = generateDefaultProviderSlots();
  const merged = { ...defaultSlots, ...configuredProviderSlots };

  const pool = [];

  AI_PROVIDERS.forEach(provider => {
    const providerSlots = merged[provider.id] || defaultSlots[provider.id];

    providerSlots.forEach((slot, index) => {
      let resolvedKey = slot.apiKey || '';

      if (slot.secretId) {
        const sec = vaultSecrets.find(s => s.id === slot.secretId);
        if (sec) resolvedKey = sec.value;
      }

      if (!resolvedKey && vaultSecrets.length > 0) {
        const matchingSecrets = vaultSecrets.filter(s => {
          const vName = (s.varName || '').toUpperCase();
          const pId = s.providerId || '';

          if (provider.id === 'gemini') return pId === 'google-ai-studio' || vName.includes('GEMINI');
          if (provider.id === 'groq') return pId === 'groq' || vName.includes('GROQ');
          if (provider.id === 'qwen') return pId === 'qwen-alibaba' || vName.includes('DASHSCOPE') || vName.includes('QWEN');
          if (provider.id === 'cerebras') return pId === 'cerebras' || vName.includes('CEREBRAS');
          if (provider.id === 'sambanova') return pId === 'sambanova' || vName.includes('SAMBANOVA');
          if (provider.id === 'huggingface') return pId === 'huggingface' || vName.includes('HF');
          if (provider.id === 'openrouter') return pId === 'openrouter' || vName.includes('OPENROUTER');
          if (provider.id === 'mistral') return pId === 'mistral' || vName.includes('MISTRAL');
          if (provider.id === 'cohere') return pId === 'cohere' || vName.includes('COHERE');
          if (provider.id === 'deepseek') return pId === 'deepseek' || vName.includes('DEEPSEEK');
          if (provider.id === 'kimi') return pId === 'kimi-moonshot' || vName.includes('MOONSHOT') || vName.includes('KIMI');
          if (provider.id === 'cloudflare') return pId === 'cloudflare-workers-ai' || vName.includes('CLOUDFLARE');
          if (provider.id === 'together') return pId === 'together-ai' || vName.includes('TOGETHER');
          if (provider.id === 'fireworks') return pId === 'fireworks-ai' || vName.includes('FIREWORKS');
          if (provider.id === 'hyperbolic') return pId === 'hyperbolic' || vName.includes('HYPERBOLIC');
          return false;
        });

        if (matchingSecrets[index]) {
          resolvedKey = matchingSecrets[index].value;
        }
      }

      if (resolvedKey && resolvedKey.trim()) {
        pool.push({
          providerId: provider.id,
          providerName: provider.name,
          slotName: slot.name,
          model: provider.defaultModel,
          apiKey: resolvedKey.trim(),
          enabled: slot.enabled !== false
        });
      }
    });
  });

  return pool;
}

/**
 * Executes a prompt cascading through the pool of available keys across all providers
 */
export async function executeWithFallback({
  configuredProviderSlots = {},
  vaultSecrets = [],
  prompt,
  systemPrompt = '',
  temperature = 0.3,
  jsonMode = false,
  preferredProvider = null
}) {
  const pool = getActiveAiPool(configuredProviderSlots, vaultSecrets);

  if (pool.length === 0) {
    throw new Error('No hay ninguna API Key activa en tus proveedores de IA. Agrega una clave de Google AI Studio, Groq, Qwen, OpenRouter, Cerebras o Hugging Face.');
  }

  const sortedPool = [...pool].sort((a, b) => {
    if (preferredProvider) {
      if (a.providerId === preferredProvider && b.providerId !== preferredProvider) return -1;
      if (b.providerId === preferredProvider && a.providerId !== preferredProvider) return 1;
    }
    return 0;
  });

  const errors = [];

  for (let i = 0; i < sortedPool.length; i++) {
    const item = sortedPool[i];
    try {
      let finalPrompt = prompt;
      if (jsonMode) {
        finalPrompt += '\n\nIMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional antes o después, sin formato markdown ```json.';
      }

      const res = await runPromptInference({
        provider: item.providerId,
        model: item.model,
        apiKey: item.apiKey,
        systemPrompt: systemPrompt || 'Eres el Asistente Experto y Organizador Inteligente de DevVault.',
        prompt: finalPrompt,
        temperature
      });

      if (res.success && res.text) {
        return {
          success: true,
          text: res.text,
          usedSlot: `${item.providerName} (${item.slotName})`,
          provider: item.providerId,
          latencyMs: res.latencyMs,
          attempts: i + 1,
          totalPoolKeys: sortedPool.length
        };
      } else {
        errors.push(`[${item.slotName}]: ${res.error || 'Respuesta vacía'}`);
      }
    } catch (err) {
      errors.push(`[${item.slotName}]: ${err.message}`);
    }
  }

  throw new Error(`Se intentó con ${sortedPool.length} claves en los proveedores y todas fallaron:\n${errors.join('\n')}`);
}
