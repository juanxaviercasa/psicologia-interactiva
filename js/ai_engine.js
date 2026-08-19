/**
 * AI ENGINE - NEURO-TACTICAL OS
 * Gestiona el Role-Play (Sparring), el Auditor de WhatsApp y la Generación Procedural usando Gemini API (u otra LLM).
 */

const AIEngine = {
  apiKey: localStorage.getItem('agy_llm_api_key') || '',
  modelName: 'gemini-1.5-flash-latest',
  
  hasKey() {
    return this.apiKey.length > 10;
  },

  setKey(key) {
    this.apiKey = key;
    localStorage.setItem('agy_llm_api_key', key);
  },

  async callGemini(prompt, systemInstruction = '') {
    if (!this.hasKey()) {
      throw new Error('API Key no configurada. Ve a Configuración de IA.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    let payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    };

    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      return data.candidates[0].content.parts[0].text;
    } catch (e) {
      console.error("AI Engine Error:", e);
      throw e;
    }
  },

  // Funcionalidad 1: Sparring de Role-Play
  async sparringChat(userMessage, conversationHistory) {
    const sysPrompt = `Eres un Simulador de Sparring Psicológico. Tu objetivo es atacar psicológicamente al usuario usando tácticas de la Tríada Oscura (Gaslighting, DARVO, Triangulación, Refuerzo Intermitente, Future Faking) para que el usuario practique cómo defenderse. 
    Actúa siempre en personaje. NO expliques las tácticas. Solo ataca sutilmente.
    Al final de cada interacción tuya, si el usuario usó una técnica de defensa correcta (Roca Gris, Desanclaje, Reencuadre), añade al final de tu mensaje [EVALUACIÓN: Éxito. Has usado Roca Gris]. Si el usuario falló, añade [EVALUACIÓN: Fallo. Cediste poder emocional].
    Mantén respuestas cortas y directas, como en una conversación de chat real.`;

    let prompt = "Historial de conversación:\n";
    conversationHistory.forEach(m => {
      prompt += `${m.role === 'user' ? 'Víctima (Usuario)' : 'Manipulador'}: ${m.text}\n`;
    });
    prompt += `Víctima (Usuario): ${userMessage}\nManipulador:`;

    if (!this.hasKey()) {
      return "Para usar el Sparring Generativo Dinámico, por favor configura tu API Key de Gemini en el Panel. [MODO OFFLINE SIMULADO: Ok, veo que intentas evitar mi pregunta. Siempre haces lo mismo. Eres imposible.]";
    }

    return await this.callGemini(prompt, sysPrompt);
  },

  // Funcionalidad 2: Auditor de Vida Real (Escudo WhatsApp)
  async analyzeToxicText(textToAnalyze) {
    const sysPrompt = `Eres un Auditor Forense de Comportamiento Humano basado en los libros de Benedict Goleman (Tríada Oscura, PNL, Gaslighting).
    Tu objetivo es analizar un mensaje enviado por un jefe, pareja o socio, e identificar las tácticas manipulativas que contiene.
    Responde estrictamente en este formato JSON, sin markdown extra de bloque de código, solo el JSON:
    {
      "redFlags": ["Bandera 1", "Bandera 2"],
      "tacticsDetected": ["Nombre de táctica 1", "Táctica 2"],
      "analysis": "Breve explicación forense del motivo subyacente.",
      "counterScript": "Guión exacto de respuesta recomendada (Método Roca Gris o Límites Firmes)."
    }`;

    if (!this.hasKey()) {
      return {
        redFlags: ["Modo Offline Activado", "Se requiere API Key para análisis profundo"],
        tacticsDetected: ["Posible Gaslighting"],
        analysis: "Este es un análisis simulado por falta de conexión a la API. El texto parece intentar alterar tu percepción.",
        counterScript: "Esa es tu perspectiva. Yo confío en mis propios datos. Hablemos cuando configures la API."
      };
    }

    const res = await this.callGemini(`Analiza este mensaje: "${textToAnalyze}"`, sysPrompt);
    try {
      const cleanJson = res.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch(e) {
      return { analysis: res, redFlags: ["Error parseando respuesta"], tacticsDetected: [], counterScript: "Maneja esto con cuidado." };
    }
  }
};
