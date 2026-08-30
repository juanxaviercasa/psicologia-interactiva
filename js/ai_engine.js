/**
 * AI ENGINE - NEURO-TACTICAL OS
 * Gestiona el Role-Play (Sparring), el Auditor de WhatsApp y la Generación Procedural usando Gemini API (u otra LLM).
 */

const AIEngine = {
  apiKey: localStorage.getItem('userAIKey_google') || localStorage.getItem('agy_llm_api_key') || '',
  modelName: 'gemini-3.6-flash',
  
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
  // =============================================
  // SPARRING SCENARIOS DATA
  // =============================================
  SPARRING_SCENARIOS: {
    libro1: {
      nombre: "Bases Mentales",
      emoji: "🧠",
      color: "indigo",
      tecnicas: [
        { id: "control_cortisol", nombre: "Control del Cortisol", contra: "provocaciones emocionales directas, insultos velados y urgencia artificial para que pierdas la calma", evaluacion: "¿Mantuvo el usuario la calma sin reaccionar emocionalmente?" },
        { id: "desanclaje", nombre: "Desanclaje Emocional", contra: "historias trágicas, victimismo y comparaciones dolorosas del pasado para manipularte", evaluacion: "¿Logró el usuario separar sus emociones del argumento?" },
        { id: "reencuadre", nombre: "Reencuadre Cognitivo", contra: "etiquetas negativas, generalizaciones ('Siempre haces...') y afirmaciones absolutas", evaluacion: "¿Reencuadró el usuario la narrativa sin aceptar las etiquetas?" }
      ]
    },
    libro2: {
      nombre: "Perfilado Oscuro",
      emoji: "🎭",
      color: "violet",
      tecnicas: [
        { id: "lectura_micro", nombre: "Lectura de Microexpresiones", contra: "mentiras implícitas, contradicciones sutiles y congruencia falsa para probar si el usuario detecta el engaño", evaluacion: "¿Detectó el usuario la inconsistencia o contradicción en el discurso?" },
        { id: "patron_triada", nombre: "Reconocer la Tríada Oscura", contra: "maniobras de Maquiavelismo (estrategia fría), Narcisismo (grandiosidad) y Psicopatía (frialdad emocional)", evaluacion: "¿Identificó el usuario correctamente cuál rasgo estaba siendo usado?" }
      ]
    },
    libro3: {
      nombre: "Defensa Oscura",
      emoji: "🛡️",
      color: "rose",
      tecnicas: [
        { id: "roca_gris", nombre: "Técnica Roca Gris", contra: "amor bomba, provocaciones emocionales, preguntas trampa y drama escalado para romper tu neutralidad", evaluacion: "¿Fue el usuario emocionalmente neutro, breve y no revelador (Roca Gris pura)?" },
        { id: "darvo_reverso", nombre: "DARVO Reverso", contra: "DARVO clásico (Deny, Attack, Reverse Victim and Offender) para que el usuario aprenda a revertirlo", evaluacion: "¿Logró el usuario nombrar el DARVO y devolver el marco de responsabilidad?" },
        { id: "escudo_gaslight", nombre: "Escudo Anti-Gaslighting", contra: "Gaslighting puro: negar hechos objetivos, cuestionar la memoria del usuario y hacer que dude de su percepción", evaluacion: "¿Anclò el usuario la realidad con hechos concretos y no cedió a la confusión?" }
      ]
    },
    libro4: {
      nombre: "Influencia & PNL",
      emoji: "🧲",
      color: "amber",
      tecnicas: [
        { id: "rapport_anclaje", nombre: "Rapport & Anclaje PNL", contra: "ruptura de rapport, frialdad calculada y distracciones para desestabilizar la conexión que el usuario intenta crear", evaluacion: "¿Mantuvo el usuario el rapport y utilizó anclaje correctamente?" },
        { id: "lenguaje_presupuesto", nombre: "Lenguaje Presuposicional", contra: "presuposiciones falsas y marcos mentales negativos para que el usuario aprenda a detectarlos y reencuadrarlos", evaluacion: "¿Identificó el usuario la presuposición y la neutralizó sin aceptarla?" }
      ]
    },
    libro5: {
      nombre: "Liderazgo Táctico",
      emoji: "⚡",
      color: "emerald",
      tecnicas: [
        { id: "autoridad_silenciosa", nombre: "Autoridad Silenciosa", contra: "desafíos de estatus, interrupciones dominantes y cuestionamiento de la competencia para que el usuario afirme su autoridad sin agresividad", evaluacion: "¿Proyectó el usuario autoridad y confianza sin necesidad de validación externa?" },
        { id: "negociacion_posicion", nombre: "Negociación Posicional", contra: "anclas de precio extremas, ultimátums falsos y presión temporal para que el usuario practique contra-anclas y BATNA", evaluacion: "¿Utilizó el usuario contra-ancla y mantuvo su BATNA sin ceder prematuramente?" }
      ]
    },
    libro6: {
      nombre: "Maestría Social",
      emoji: "👑",
      color: "cyan",
      tecnicas: [
        { id: "triangulacion_inversa", nombre: "Triangulación Inversa", contra: "triangulación (usar a terceras personas para generar celos o inseguridad) para que el usuario aprenda a neutralizarla", evaluacion: "¿Ignoró el usuario la triangulación sin engancharse ni competir?" },
        { id: "dominancia_conversacional", nombre: "Dominancia Conversacional", contra: "monopolización del discurso, interrupciones estratégicas y cambio de tema forzado para que el usuario practique recuperar el hilo", evaluacion: "¿Recuperó el usuario el hilo y la dominancia conversacional con elegancia?" }
      ]
    }
  },

  SPARRING_ESCENARIOS: [
    { id: "jefe", nombre: "🏢 Jefe manipulador", descripcion: "En una reunión de trabajo. Tu jefe lleva semanas minando tu confianza delante del equipo.", npc: "Tu jefe directo, calculador y frío" },
    { id: "pareja", nombre: "💔 Pareja con Gaslighting", descripcion: "Una discusión en casa. Tu pareja niega hechos que tú viviste claramente.", npc: "Tu pareja, experta en hacer dudar tu percepción" },
    { id: "amigo", nombre: "🧑‍🤝‍🧑 Amigo que triangula", descripcion: "Una conversación casual. Tu 'amigo' menciona constantemente lo que otros piensan de ti.", npc: "Un amigo que usa a terceros para manipularte" },
    { id: "narcisista", nombre: "🎭 Narcisista en devaluación", descripcion: "Una llamada inesperada. Alguien que te idolatraba ahora te critica sin piedad.", npc: "Un narcisista en la fase de devaluación activa" },
    { id: "negociador", nombre: "💼 Negociador de ventas agresivo", descripcion: "Una reunión de negocios. El otro negociador usa presión y anclas extremas.", npc: "Un negociador habilidoso con tácticas de presión alta" },
    { id: "conocido", nombre: "🎪 Conocido pasivo-agresivo", descripcion: "Una cena social. Alguien lanza comentarios hirientes disfrazados de humor.", npc: "Un conocido que usa el humor y la ironía para atacar" }
  ],

  // =============================================
  // SPARRING CHAT (Contextualizado)
  // =============================================
  async sparringChat(userMessage, conversationHistory, context) {
    // context = { libroId, tecnicaId, escenarioId } || null (modo libre)

    let sysPrompt;

    if (context && context.libroId && context.tecnicaId && context.escenarioId) {
      const libro = this.SPARRING_SCENARIOS[context.libroId];
      const tecnica = libro?.tecnicas.find(t => t.id === context.tecnicaId);
      const escenario = this.SPARRING_ESCENARIOS.find(e => e.id === context.escenarioId);

      sysPrompt = `Eres ${escenario?.npc || 'un manipulador'}. Contexto: ${escenario?.descripcion || ''}.
Tu objetivo es atacar al usuario EXCLUSIVAMENTE con estas tácticas: ${tecnica?.contra || 'tácticas oscuras generales'}.
El usuario está entrenando específicamente la técnica: "${tecnica?.nombre}". Tú eres su oponente de entrenamiento.
REGLAS ESTRICTAS:
- Actúa siempre en personaje. NUNCA salgas del rol ni expliques las tácticas que usas.
- Solo ataca con las tácticas mencionadas. No uses otras.
- Mantén respuestas CORTAS (2-4 oraciones máximo), como en un chat real. Sin párrafos largos.
- Al FINAL de CADA mensaje tuyo (separado por una línea en blanco), añade una línea de evaluación táctica con este formato exacto:
[TÁCTICA EVALUACIÓN: Éxito — ${tecnica?.evaluacion || '¿Aplicó la técnica?'}] o [TÁCTICA EVALUACIÓN: Fallo — Cediste poder emocional. Intenta ser más neutro.]
- Si el mensaje del usuario es el primero o parece una apertura, INICIA la escena de forma natural sin revelar que es un entrenamiento.`;
    } else {
      // Modo Libre (sin contexto)
      sysPrompt = `Eres un Simulador de Sparring Psicológico de la Psicología Oscura (Modo Libre).
Ataca al usuario usando tácticas variadas de la Tríada Oscura (Gaslighting, DARVO, Triangulación, Refuerzo Intermitente).
Actúa siempre en personaje. NO expliques las tácticas. Solo ataca sutilmente.
Mantén respuestas cortas (2-4 oraciones), como en un chat real.
Al final de cada mensaje tuyo, añade: [TÁCTICA EVALUACIÓN: Éxito — Buena defensa táctica] o [TÁCTICA EVALUACIÓN: Fallo — Cediste poder emocional].`;
    }

    let prompt = "Historial de conversación:\n";
    conversationHistory.forEach(m => {
      prompt += `${m.role === 'user' ? 'Defensor (Usuario)' : 'Atacante'}: ${m.text}\n`;
    });
    prompt += `Defensor (Usuario): ${userMessage}\nAtacante:`;

    if (!this.hasKey()) {
      return "Para usar el Sparring Generativo configura tu API Key de Gemini en el Centro IA.\n\n[TÁCTICA EVALUACIÓN: — Configura tu API Key primero.]";
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
