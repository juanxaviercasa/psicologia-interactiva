/**
 * DevVault AI Smart Organizer & Copilot Engine
 * Analyzes messy vault contents, normalizes variable names, creates logical folders, and suggests clean structure.
 */

import { executeWithFallback } from './aiRouter';

/**
 * Extracts and sanitizes metadata from vault for AI analysis without exposing sensitive raw secret contents
 */
function prepareVaultSummary(vaultData) {
  const projects = vaultData?.projects || [];
  const secrets = (vaultData?.secrets || []).map(s => ({
    id: s.id,
    currentTitle: s.title || s.name || '',
    currentVarName: s.varName || s.key || '',
    currentCategory: s.category || 'custom',
    currentProjectId: s.projectId || 'global-keys',
    currentProjectName: projects.find(p => p.id === s.projectId)?.name || 'Global',
    currentEnvironment: s.environment || 'development',
    type: s.type || 'api_key',
    providerHint: s.providerId || '',
    valueHint: s.value ? `${s.value.slice(0, 4)}... (${s.value.length} chars)` : ''
  }));

  return {
    existingProjects: projects.map(p => ({ id: p.id, name: p.name, description: p.description })),
    secrets
  };
}

/**
 * Executes full AI reorganization analysis
 */
export async function analyzeVaultOrganization({ vaultData, configuredProviderSlots = {} }) {
  const summary = prepareVaultSummary(vaultData);

  if (summary.secrets.length === 0) {
    throw new Error('No hay secretos en la caja fuerte para organizar. Añade algunos primero.');
  }

  const systemPrompt = `Eres un Arquitecto de Software Senior y Líder Técnico experto en organización de proyectos, seguridad de credenciales y estándares de desarrollo (.env, Twelve-Factor App, Node.js, Python, DevOps).

Tu misión es analizar la lista de secretos y claves de un desarrollador y reorganizarlos de la manera más limpia, profesional y lógica posible.

Debes:
1. Normalizar nombres de variables al estándar de la industria (ej. \`GEMINI_API_KEY\`, \`GROQ_API_KEY\`, \`SUPABASE_URL\`, \`DATABASE_URL\`, \`GITHUB_TOKEN\`).
2. Asignar títulos claros y descriptivos con nombres de servicios formales (ej. "Google Gemini Flash API", "Supabase Database URL").
3. Asignar la categoría correcta entre: 'ai', 'database', 'cloud', 'auth', 'custom'.
4. Proponer una estructura de proyectos/carpetas coherente (ej. "Inteligencia Artificial & LLMs", "Bases de Datos & Backend", "Frontend & Aplicaciones", "Claves Globales / Compartidas").
5. Mapear cada secreto existente a su proyecto ideal.

Responde ÚNICAMENTE con un JSON con esta estructura exacta:
{
  "summary": "Resumen ejecutivo de las mejoras (ej. Se normalizaron 4 variables, se agruparon servicios de IA en una carpeta dedicada)",
  "suggestedProjects": [
    { "id": "proj-slug", "name": "Nombre Proyecto", "description": "Descripción", "color": "#10b981" }
  ],
  "items": [
    {
      "id": "secret-id-existente",
      "newTitle": "Título Limpio",
      "newVarName": "NOMBRE_ESTANDAR_ENV",
      "newCategory": "ai | database | cloud | auth | custom",
      "targetProjectId": "proj-slug o id existente",
      "targetProjectName": "Nombre del Proyecto Destino",
      "reason": "Motivo del cambio"
    }
  ]
}`;

  const userPrompt = `Aquí tienes el estado actual de la caja fuerte del desarrollador:
${JSON.stringify(summary, null, 2)}

Por favor elabora el plan óptimo de organización y normalización en formato JSON.`;

  const aiResult = await executeWithFallback({
    configuredProviderSlots,
    vaultSecrets: vaultData.secrets,
    systemPrompt,
    prompt: userPrompt,
    temperature: 0.2,
    jsonMode: true
  });

  try {
    let cleanText = aiResult.text.trim();
    if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
    if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
    if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
    cleanText = cleanText.trim();

    const parsedPlan = JSON.parse(cleanText);

    const itemsWithDiff = (parsedPlan.items || []).map(item => {
      const original = vaultData.secrets.find(s => s.id === item.id);
      const isVarNameChanged = original && original.varName !== item.newVarName;
      const isTitleChanged = original && original.title !== item.newTitle;
      const isCategoryChanged = original && original.category !== item.newCategory;
      const isProjectChanged = original && original.projectId !== item.targetProjectId;

      const hasChanges = isVarNameChanged || isTitleChanged || isCategoryChanged || isProjectChanged;

      return {
        ...item,
        original,
        hasChanges,
        diffDetails: {
          isVarNameChanged,
          isTitleChanged,
          isCategoryChanged,
          isProjectChanged
        }
      };
    });

    return {
      success: true,
      usedSlot: aiResult.usedSlot,
      latencyMs: aiResult.latencyMs,
      summary: parsedPlan.summary || 'Reorganización completada con éxito.',
      suggestedProjects: parsedPlan.suggestedProjects || [],
      items: itemsWithDiff,
      totalChanges: itemsWithDiff.filter(i => i.hasChanges).length
    };
  } catch (err) {
    console.error('Error parsing AI organization plan:', err, aiResult.text);
    throw new Error('La IA no devolvió un plan estructurado válido. Intenta nuevamente.');
  }
}

/**
 * Applies the approved AI organization plan into the vault data
 */
export function applyOrganizationPlan(currentVaultData, plan) {
  const existingProjects = [...(currentVaultData.projects || [])];
  const projectMap = new Map(existingProjects.map(p => [p.id, p]));

  // 1. Add new proposed projects that don't exist yet
  (plan.suggestedProjects || []).forEach(sp => {
    if (!projectMap.has(sp.id) && !existingProjects.some(p => p.name.toLowerCase() === sp.name.toLowerCase())) {
      const newProj = {
        id: sp.id.startsWith('proj_') ? sp.id : `proj_${sp.id}`,
        name: sp.name,
        description: sp.description || '',
        color: sp.color || '#06b6d4',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      existingProjects.push(newProj);
      projectMap.set(newProj.id, newProj);
      projectMap.set(sp.id, newProj);
    }
  });

  // 2. Update secrets
  const planItemsMap = new Map((plan.items || []).map(i => [i.id, i]));
  const updatedSecrets = (currentVaultData.secrets || []).map(secret => {
    const planItem = planItemsMap.get(secret.id);
    if (!planItem) return secret;

    let targetProjId = planItem.targetProjectId;
    const foundProj = existingProjects.find(p => p.id === targetProjId || p.name.toLowerCase() === planItem.targetProjectName?.toLowerCase());
    if (foundProj) targetProjId = foundProj.id;

    return {
      ...secret,
      title: planItem.newTitle || secret.title,
      varName: planItem.newVarName || secret.varName,
      category: planItem.newCategory || secret.category,
      projectId: targetProjId || secret.projectId || 'global-keys',
      updatedAt: new Date().toISOString()
    };
  });

  return {
    ...currentVaultData,
    projects: existingProjects,
    secrets: updatedSecrets
  };
}

/**
 * Copilot Chat Natural Language Action Interpreter
 */
export async function askVaultCopilot({
  userMessage,
  vaultData,
  configuredProviderSlots = {},
  conversationHistory = []
}) {
  const summary = prepareVaultSummary(vaultData);

  const systemPrompt = `Eres "Vault Copilot", el Asistente Inteligente de DevVault. Tu trabajo es ayudar al usuario a gestionar, consultar, organizar y modificar sus claves y proyectos de manera conversacional.

Estado actual de la bóveda:
${JSON.stringify(summary, null, 2)}

Si el usuario te pide una acción concreta (como mover claves, crear un proyecto, renombrar variables, organizar o consultar estadísticas), explica lo que harás y sugiere los pasos exactos.`;

  const messagesPrompt = `Usuario: ${userMessage}`;

  const aiResult = await executeWithFallback({
    configuredProviderSlots,
    vaultSecrets: vaultData.secrets,
    systemPrompt,
    prompt: messagesPrompt,
    temperature: 0.4
  });

  return {
    success: true,
    message: aiResult.text,
    usedSlot: aiResult.usedSlot,
    latencyMs: aiResult.latencyMs
  };
}
