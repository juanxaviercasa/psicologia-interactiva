const LIBROS_DATA = {
  "modules": [
    {
      "bookNumber": 1,
      "title": "Psicología Oscura Vol 4 - Fundamentos",
      "badge": "Experto",
      "icon": "fa-brain",
      "description": "Domina los principios fundamentales de psicología oscura y manipulación.",
      "keyPillars": [
        {
          "title": "La Tríada Oscura",
          "realExample": "<p>Estudio de los tres rasgos de personalidad más peligrosos: narcisismo, maquiavelismo y psicopatía.</p>",
          "interactiveChallenge": {
            "question": "Ante una señal de manipulación encubierta, la respuesta más efectiva es:",
            "options": [
              {
                "text": "Nombrar el patrón y aplicar distancia emocional estratégica.",
                "isCorrect": true,
                "feedback": "¡Correcto! La consciencia interrumpe el ciclo automático."
              },
              {
                "text": "Ignorar la situación y esperar que cambie sola.",
                "isCorrect": false,
                "feedback": "Incorrecto. La ignorancia pasiva refuerza el patrón."
              },
              {
                "text": "Responder agresivamente.",
                "isCorrect": false,
                "feedback": "Incorrecto. Escala el conflicto a favor del manipulador."
              },
              {
                "text": "Aceptar todas las premisas sin cuestionarlas.",
                "isCorrect": false,
                "feedback": "Incorrecto. Eso es lo que el manipulador busca lograr."
              }
            ]
          }
        }
      ]
    },
    {
      "bookNumber": 2,
      "title": "Psicología Oscura Vol 4 - Técnicas Avanzadas",
      "badge": "Maestro",
      "icon": "fa-eye",
      "description": "Domina las técnicas de influencia y persuasión más sofisticadas.",
      "keyPillars": [
        {
          "title": "Influencia Encubierta",
          "realExample": "<p>Las técnicas de influencia encubierta operan bajo el umbral de la consciencia del objetivo.</p>",
          "interactiveChallenge": {
            "question": "El anclaje emocional se usa principalmente para:",
            "options": [
              {
                "text": "Asociar estímulos neutros con estados emocionales específicos para activarlos intencionalmente.",
                "isCorrect": true,
                "feedback": "¡Correcto! Esta es la definición exacta del anclaje emocional."
              },
              {
                "text": "Generar miedo inmediato en el objetivo.",
                "isCorrect": false,
                "feedback": "Incorrecto. El anclaje es más sutil que la intimidación directa."
              },
              {
                "text": "Crear confusión para desorientar a la víctima.",
                "isCorrect": false,
                "feedback": "Incorrecto. Eso describe el gaslighting, no el anclaje."
              },
              {
                "text": "Aislar al objetivo de su red de apoyo.",
                "isCorrect": false,
                "feedback": "Incorrecto. Eso describe el aislamiento progresivo."
              }
            ]
          }
        }
      ]
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "term": "Tríada Oscura",
      "definition": "Conjunto de tres rasgos de personalidad: narcisismo, maquiavelismo y psicopatía subclínica que predisponen a comportamientos manipuladores.",
      "tacticalUse": "Identificar individuos de alto riesgo en entornos personales y profesionales antes de que el daño ocurra.",
      "countermeasure": "Establecer límites claros desde el inicio, documentar comportamientos y construir red de apoyo confiable."
    },
    {
      "id": "fc2",
      "term": "Gaslighting",
      "definition": "Técnica de manipulación que hace dudar a la víctima de su propia percepción de la realidad mediante negación, distorsión y reencuadre.",
      "tacticalUse": "El manipulador niega eventos reales o los reencuadra para crear dependencia y confusión en la víctima.",
      "countermeasure": "Documentar interacciones, consultar perspectivas externas confiables y fortalecer la confianza en el propio juicio."
    },
    {
      "id": "fc3",
      "term": "Love Bombing",
      "definition": "Bombardeo de afecto, atención y elogios excesivos al inicio de una relación para crear dependencia emocional acelerada.",
      "tacticalUse": "Crea vínculos emocionales fuertes en tiempo récord que luego se usan como herramienta de control y chantaje.",
      "countermeasure": "Mantener ritmos naturales de construcción de relaciones. Si algo parece demasiado perfecto, investigar."
    },
    {
      "id": "fc4",
      "term": "Principio de Reciprocidad",
      "definition": "Tendencia humana innata a devolver favores recibidos, incluso cuando no fueron solicitados ni deseados.",
      "tacticalUse": "El manipulador da pequeños regalos o favores no pedidos para crear una deuda emocional que luego cobra.",
      "countermeasure": "Reconocer cuándo un favor no fue solicitado y no sentirse obligado a reciprocar proporcionalmente."
    },
    {
      "id": "fc5",
      "term": "Triangulación",
      "definition": "Introducir a una tercera persona o entidad en una relación para generar celos, competencia o inseguridad en el objetivo.",
      "tacticalUse": "Mantiene al objetivo en estado de ansiedad perpetua y búsqueda constante de aprobación del manipulador.",
      "countermeasure": "Identificar el patrón, rechazar la comparación como herramienta de evaluación y fortalecer la autoestima interna."
    }
  ],
  "caseScenarios": [
    {
      "id": "cs1",
      "category": "Detección en Entorno Laboral",
      "title": "El Colega Manipulador",
      "difficulty": "Alta",
      "badge": "Detective Social",
      "scenarioDescription": "Un compañero de trabajo te critica constantemente ante el jefe y luego te ofrece apoyo privado. Alterna críticas y halagos según le conviene. ¿Cómo respondes?",
      "options": [
        {
          "id": "opt1",
          "text": "Documentar los patrones, mantener conversaciones con testigos y establecer límites claros.",
          "outcome": "Éxito Estratégico",
          "wisdomScore": 100,
          "analysis": "La documentación y los límites protegen tu posición sin escalar el conflicto innecesariamente.",
          "bookInsight": "El manipulador prospera en la ambigüedad; la claridad y los registros son tu mejor defensa."
        },
        {
          "id": "opt2",
          "text": "Confrontarlo agresivamente en una reunión de equipo.",
          "outcome": "Error Estratégico",
          "wisdomScore": 10,
          "analysis": "La confrontación pública sin evidencia te posiciona como el agresor y valida su narrativa.",
          "bookInsight": "Actuar impulsivamente entrega el control de la situación al manipulador."
        }
      ]
    },
    {
      "id": "cs2",
      "category": "Defensa Personal Psicológica",
      "title": "El Ciclo de Idealización y Devaluación",
      "difficulty": "Media",
      "badge": "Guardián Mental",
      "scenarioDescription": "Una persona cercana alterna entre períodos de amor intenso y críticas crueles hacia ti. El ciclo se repite cada pocas semanas.",
      "options": [
        {
          "id": "opt1",
          "text": "Reconocer el ciclo, nombrar el patrón y buscar apoyo profesional para evaluar la relación.",
          "outcome": "Decisión Sabia",
          "wisdomScore": 100,
          "analysis": "Nombrar el ciclo es el primer paso para interrumpirlo. El apoyo profesional proporciona estrategias validadas.",
          "bookInsight": "Lo que se puede nombrar se puede examinar; lo que se puede examinar se puede cambiar."
        },
        {
          "id": "opt2",
          "text": "Aceptar las disculpas y esperar que la persona cambie sola con el tiempo.",
          "outcome": "Error Común",
          "wisdomScore": 20,
          "analysis": "Sin intervención ni límites, los ciclos de abuso tienden a intensificarse con el tiempo.",
          "bookInsight": "La esperanza sin acción es la trampa emocional que mantiene a las víctimas atrapadas."
        }
      ]
    }
  ]
};
