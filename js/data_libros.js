// data_libros.js - EDICIÓN MAESTRA COMPLETA v3.0
// Contenido: 6 Módulos, 24 Pilares (todos con diagrama + desafío), 20 Fichas Táctica,
// 8 Escenarios, 15 BodyLab, 30 Flashcards, 13 Quizzes, 55 Glosario
const LIBROS_DATA = {
  modules: [
    {
      id: 'm1', bookNumber: 1, title: 'Introducción a la Psicología', subtitle: 'Fundamentos de la Mente Humana',
      badge: 'Bases Mentales', icon: 'fa-brain', readTime: '45 min',
      overview: 'Comprender cómo procesamos la información, sesgos cognitivos y la arquitectura del cerebro para anticipar el comportamiento.',
      keyPillars: [
        {
          title: 'Arquitectura del Comportamiento (Sistema 1 vs Sistema 2)',
          clinicalCase: "En el estudio clásico de Kahneman y Tversky (1981) sobre 'El problema de la enfermedad asiática', se demostró cómo el Sistema 1 es altamente susceptible al 'Efecto Marco'. Cuando a grupos clínicos se les presentó exactamente el mismo riesgo estadístico, el 72% eligió una opción cuando se enmarcó como 'salvar vidas' (ganancia), pero solo el 22% la eligió cuando se enmarcó como 'evitar muertes' (pérdida). La amígdala reacciona al lenguaje emocional antes de que el córtex prefrontal evalúe la matemática real.",
          academicCitation: "Kahneman, D. (2011). Thinking, fast and slow. Farrar, Straus and Giroux. | Tversky, A., & Kahneman, D. (1981). The framing of decisions and the psychology of choice. Science, 211(4481), 453-458. PMID: 7455683.",
          storytellingConcept: `Imagina que tu cerebro tiene dos modos de conducción: el Piloto Automático (Sistema 1) y el Conducción Manual (Sistema 2).

El **Sistema 1** es instintivo, emocional y ultrarrápido. Es el que te hace saltar hacia atrás cuando ves algo parecido a una serpiente, incluso si luego descubres que era solo una manguera. Consume muy poca energía, por lo que el 95% de tus decisiones diarias las toma este sistema sin que te des cuenta.

El **Sistema 2**, en cambio, es lento, analítico y lógico. Entra en juego cuando resuelves un problema matemático complejo o cuando debes leer un contrato legal. El problema es que el Sistema 2 es "perezoso" y consume muchísima glucosa (energía cerebral).

**La raíz de toda manipulación** consiste en crear un entorno (urgencia, miedo, adulación, confusión) que desactive tu Sistema 2 y obligue a tu Sistema 1 a tomar el control. Cuando operas en Sistema 1, no estás razonando, estás reaccionando a estímulos. Eres, neurológicamente, un títere.`,
          dialogueBreakdown: [
              { speaker: 'Manipulador (Vendedor)', text: 'Solo nos queda este modelo en stock. Si no te lo llevas ahora, otro cliente que viene en 10 minutos se lo va a llevar. No puedo guardártelo.', analysis: 'Activa la heurística de escasez y urgencia temporal. El cerebro percibe pérdida potencial (FOMO), lo que dispara la amígdala (Sistema 1).' },
              { speaker: 'Tú (Víctima potencial)', text: 'Wow, bueno... no quiero perder la oportunidad. Supongo que me lo llevo.', analysis: 'El Sistema 1 tomó el control por el pánico a perder. El Sistema 2 (que habría preguntado: "¿Realmente necesito este modelo hoy?") fue desactivado por la urgencia artificial.' }
          ],
          tacticalShield: `**El Escudo: La Pausa Refractaria**

La única forma de invocar al Sistema 2 cuando estás bajo ataque emocional es insertar **espacio (tiempo) y fricción cognitiva**.

Cuando sientas urgencia repentina, confusión o una emoción intensa (positiva o negativa), la regla absoluta es:
**1. Cállate.** No respondas inmediatamente.
**2. Rompe el anclaje físico:** Da un paso atrás o mira tu reloj.
**3. Exige tiempo:** "Es una decisión importante, mi regla es consultar todo esto con la almohada. Te llamaré mañana con mi respuesta definitiva".

Forzar la pausa obliga al manipulador a cambiar de táctica y le da a tu Córtex Prefrontal el tiempo biológico necesario (unos 15 minutos) para limpiar el cortisol o la dopamina y empezar a pensar lógicamente.`,

          chapters: ["Tema_01_P____SICOLOGIA_OSCURA", "Tema_02_Introduction", "Tema_03_El_Antiguo_Pensamiento_Psicolo", "Tema_04_El_papiro_de_Edwin_Smith"],
          deepDive: 'La teoría del proceso dual (Kahneman) demuestra que la presión emocional desactiva el córtex prefrontal. En alto estrés, la amígdala toma el control. El dominio táctico requiere respiración diafragmática para mantener el flujo sanguíneo frontal y obligar al adversario a justificar sus demandas.',
          diagram: `graph TD
    A[ESTÍMULO EXTERNO] --> B{¿Amenaza o urgencia?}
    B -- Sí --> C[SISTEMA 1 Amígdala]
    B -- No --> D[SISTEMA 2 Córtex]
    C --> E[Reacción Emocional / Impulsiva]
    D --> F[Análisis Lógico / Pausado]
    E --> G((VULNERABLE a manipulación))
    F --> H((ESCUDO táctico activo))
    style G fill:#7f1d1d,color:#fca5a5
    style H fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Un reclutador te dice: 'Tienes 10 minutos para firmar o pierdes la oferta'. ¿Qué sistema está atacando?",
            options: ["Sistema 2 (Análisis Lógico)", "Sistema 1 (Urgencia / Supervivencia)", "Memoria a largo plazo", "Hemisferio izquierdo"],
            correctIndex: 1,
            successMessage: "Exacto. La urgencia artificial desactiva el Córtex Prefrontal para que no puedas analizar. Tu defensa: pausar 24 horas."
          }
        },
        {
          title: 'Sesgos Cognitivos Centrales',
          concept: 'Errores sistemáticos en el pensamiento. Sesgo de Confirmación, Efecto Halo y Anclaje son las herramientas primarias de influencia.',
          tacticalRule: 'Cuestiona tu primera impresión. ¿Estoy de acuerdo porque es lógico o porque me agrada la persona?',
          realExample: 'Creerle a un estafador porque viste un traje caro (Efecto Halo).',
          chapters: ["Tema_05_Describa", "Tema_06_Explique", "Tema_07_Predecir", "Tema_08_Cambier", "Tema_09_La_Perspectiva_Cognitiva", "Tema_10_La_Perspectiva_Humanista"],
          deepDive: 'El cerebro está diseñado para confirmar creencias previas. Los manipuladores alimentan tus creencias existentes (Sesgo de Confirmación) para insertar su agenda oculta.',
          diagram: `graph LR
    A[INFORMACIÓN NUEVA] --> B{¿Confirma mi creencia?}
    B -- Sí --> C[ACEPTA automáticamente]
    B -- No --> D[RECHAZA o distorsiona]
    C --> E[Sesgo de Confirmación instalado]
    D --> F[Disonancia Cognitiva]
    style E fill:#78350f,color:#fde68a
    style F fill:#1e1b4b,color:#c4b5fd`,
          interactiveChallenge: {
            question: "Un abogado muy bien vestido te pide un favor cuestionable. Tu primera reacción es confiar. ¿Qué sesgo estás sufriendo?",
            options: ["Sesgo de Confirmación", "Efecto Halo", "Sesgo de Anclaje", "Heurístico de Disponibilidad"],
            correctIndex: 1,
            successMessage: "Correcto. El Efecto Halo hace que un atributo positivo (apariencia) contamine toda tu evaluación de la persona. La defensa: separar atributos conscientemente."
          }
        },
        {
          title: 'Disonancia Cognitiva',
          concept: 'El malestar psicológico de mantener dos creencias contradictorias. Las personas harán cualquier cosa para resolverlo, incluso autoengañarse.',
          tacticalRule: 'Nunca ataques creencias centrales directamente. Usa preguntas socráticas para que ellos mismos vean la contradicción.',
          realExample: '"¿Cómo se alinea esa decisión con tu meta de ahorrar?" en lugar de "tu idea es mala".',
          chapters: ["Tema_11_Conciencia_de_si_mismo", "Tema_12_Autoregulacion", "Tema_13_Las_Emociones_Universales"],
          deepDive: 'Festinger (1957) demostró que cuando la realidad choca con la creencia, la gente ajusta la creencia. Los manipuladores crean disonancia para forzarte a ceder y restablecer el equilibrio psicológico.',
          diagram: `graph TD
    A[Creencia A] --> C{CHOQUE}
    B[Creencia B opuesta] --> C
    C --> D[MALESTAR: Disonancia Cognitiva]
    D --> E[El cerebro busca resolverlo]
    E --> F[Cambia la creencia más débil]
    E --> G[Racionaliza para mantener ambas]
    E --> H[Ignora una de las dos]
    style D fill:#7c2d12,color:#fed7aa`,
          interactiveChallenge: {
            question: "Un manipulador creó disonancia. ¿Cuál es la defensa correcta al notar que estás a punto de ceder solo para aliviar el malestar?",
            options: ["Argumentar más intensamente", "Pausar y preguntar: ¿Estoy cediendo por lógica o por incomodidad emocional?", "Cambiar de tema rápidamente", "Pedir tiempo y decidir desde el estrés"],
            correctIndex: 1,
            successMessage: "Exacto. Nombrar la disonancia la neutraliza. El simple acto de reconocer el malestar como una táctica te devuelve el control racional."
          }
        },
        {
          title: 'El Principio de Reciprocidad',
          concept: 'Presión evolutiva profunda de devolver favores. Una técnica clásica de infiltración social.',
          tacticalRule: 'Acepta favores declarando explícitamente que no generan deuda: "Gracias, es un gesto desinteresado".',
          realExample: 'Un compañero te trae café 3 días seguidos y al cuarto pide que cubras su turno de 8 horas.',
          chapters: ["Tema_14_Capitulo_5__Gestion_de_los_Pen", "Tema_15_Gestionar_los_Pensamientos_y_l", "Tema_16_Afirmaciones", "Tema_17_Regulacion_Emotional", "Tema_18_Metodo_de_puesta_a_tierra", "Tema_19_Respiracion_profunda", "Tema_20_El_Problema_de_la_Procrastinac", "Tema_21_Sobornos", "Tema_22_Conclusion"],
          deepDive: 'Cialdini: la reciprocidad asimétrica es el arma más letal. Un favor de $2 genera una obligación percibida de $100. Neutralizar requiere desvincular el acto del intercambio.',
          diagram: `graph LR
    A[Dar Favor Pequeño] --> B[Activar Deuda Social Percibida]
    B --> C[Solicitar Favor GRANDE]
    C --> D{¿Víctima reconoce el patrón?}
    D -- No --> E[CEDE: Reciprocidad explotada]
    D -- Sí --> F[DEFIENDE: Desvincula el favor]
    style E fill:#7f1d1d,color:#fca5a5
    style F fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Un colega te regala entradas a un concierto sin razón aparente. Dos semanas después te pide que firmes un documento cuestionable. ¿Cuál es la respuesta táctica correcta?",
            options: ["Firmar para no quedar mal después del regalo", "Declinar el favor diciendo: 'El regalo fue un gesto, no genera obligación de ningún tipo'", "Regalarle algo equivalente para quedar en paz", "Ignorarlo sin explicación"],
            correctIndex: 1,
            successMessage: "Correcto. Nombrar la desvinculación en voz alta desactiva el mecanismo de reciprocidad antes de que te atrape."
          }
        }
      ],
      masteryChecklist: ['Identificar Sistema 1 vs Sistema 2 en tiempo real', 'Reconocer 3 sesgos cognitivos propios', 'Desactivar la reciprocidad asimétrica', 'Usar preguntas socráticas']
    },
    {
      id: 'm2', bookNumber: 2, title: 'Cómo Analizar a las Personas', subtitle: 'Lectura en Frío y Lenguaje No Verbal',
      badge: 'Perfilado', icon: 'fa-eye', readTime: '55 min',
      overview: 'Técnicas de perfilamiento utilizadas por agencias de inteligencia para leer intenciones ocultas antes de que se pronuncien palabras.',
      keyPillars: [
        {
          title: 'Línea Base Conductual (Baseline)',
          storytellingConcept: `Imagínate intentar afinar un instrumento musical sin saber cómo suena cuando está perfectamente afinado. Es imposible. Lo mismo ocurre con la detección de mentiras y el análisis del comportamiento humano.

La **Línea Base Conductual** (Baseline) es el comportamiento "normal" y relajado de una persona cuando no está bajo estrés. Todos tenemos tics únicos: algunos parpadean mucho normalmente, otros cruzan los brazos cuando están cómodos (no cerrados), y algunos hablan rápido por naturaleza.

Los novatos en lenguaje corporal asumen que "cruzar los brazos es estar a la defensiva" o "mirar hacia la derecha es mentir". Eso es falso. Lo que revela la mentira o la incomodidad no es el gesto en sí, sino el **desvío repentino de la línea base** en respuesta a un estímulo específico.`,
          dialogueBreakdown: [
              { speaker: 'Tú (Analizando)', text: '¿Qué hiciste el viernes por la noche? (Pregunta de calibración relajada)', analysis: 'La persona responde fluidamente, mantiene contacto visual y mueve las manos libremente. Esa es su línea base.' },
              { speaker: 'Tú (Estímulo)', text: '¿Viste a Carlos el viernes? Me pareció verte cerca de su oficina.', analysis: 'Pregunta crítica que inyecta estrés si hay algo que ocultar.' },
              { speaker: 'Sujeto', text: '(Pausa de 2 segundos. Las manos se congelan. Parpadeo rápido). No... no lo vi.', analysis: 'Desvío dramático de la línea base: congelamiento motor (Efecto Tortuga) y aumento de parpadeo. Indica estrés agudo o carga cognitiva, no necesariamente mentira, pero sí ocultamiento.' }
          ],
          tacticalShield: `**La Técnica de Calibración Rápida**

Antes de empezar una negociación o conversación difícil, dedica 5 minutos a hablar del clima, mascotas, o el viaje en auto. Durante esos 5 minutos, observa 3 cosas:
1. **Ritmo de parpadeo y contacto visual** (¿Mantiene la mirada cuando está relajado?)
2. **Uso de las manos** (¿Habla con las manos o las mantiene quietas?)
3. **Volumen y tono de voz**.

Una vez establecida la Baseline, suelta la pregunta difícil. Si notas que de repente oculta las manos, su tono sube media octava o rompe el contacto visual, tienes tu primer **indicador de engaño o estrés**. Busca 3 de estos indicadores (Cluster) para confirmar.`,

          chapters: ["Tema_23_Introduction", "Tema_24_Apertura", "Tema_25_Conciencia"],
          deepDive: 'El sistema límbico rige el lenguaje corporal genuino. Al mentir, el córtex debe inventar la historia y suprimir la verdad (Carga Cognitiva). Esta sobrecarga produce filtraciones límbicas o congelamiento motor.',
          diagram: `graph TD
    A[Observar 5 minutos relajado] --> B[LÍNEA BASE establecida]
    B --> C[Hacer pregunta clave]
    C --> D{¿Desviación de la línea base?}
    D -- Un solo gesto --> E[Ruido, no conclusión]
    D -- 3+ gestos en cluster --> F[SEÑAL REAL de estrés o mentira]
    style F fill:#7c2d12,color:#fed7aa
    style E fill:#1e3a5f,color:#93c5fd`,
          interactiveChallenge: {
            question: "Durante una entrevista, el candidato se toca el cuello una sola vez. ¿Qué debes concluir?",
            options: ["Está mintiendo definitivamente", "Tiene picazón", "Es solo un dato, no conclusión. Necesitas un cluster de 3+ gestos desviados de su baseline", "Está nervioso porque miente"],
            correctIndex: 2,
            successMessage: "Perfecto. La Regla del Cluster: un solo gesto es ruido. Solo 3 o más gestos simultáneos de su línea base establecen una señal tácticamente válida."
          }
        },
        {
          title: 'Microexpresiones de Paul Ekman',
          concept: 'Fugas faciales involuntarias que duran menos de 1/5 de segundo y revelan la emoción real, imposibles de suprimir completamente.',
          tacticalRule: 'Observa la asimetría. Expresiones genuinas son simétricas. Asimetría = emoción fabricada o desprecio.',
          realExample: 'Un colega te felicita pero la comisura izquierda se tensa por un milisegundo: desprecio puro.',
          chapters: ["Tema_26_Haptica"],
          deepDive: 'Las 7 emociones universales (Ekman) tienen firmas musculares involuntarias. El desprecio es la única unilateral. Es el mayor predictor de fracaso relacional.',
          diagram: `graph LR
    A[EMOCIÓN REAL] --> B[Sistema Límbico]
    B --> C{Cerebro intenta suprimir}
    C --> D[Filtración: MICROEXPRESIÓN]
    D --> E[Dura 1/25 - 1/5 de segundo]
    E --> F[7 Categorías Universales]
    F --> F1[Alegría] & F2[Tristeza] & F3[Miedo] & F4[Asco] & F5[Ira] & F6[Sorpresa] & F7[Desprecio]`,
          interactiveChallenge: {
            question: "Ves en el rostro de alguien una elevación unilateral de la comisura del labio durante 1/10 de segundo mientras te explica por qué confía en ti. ¿Qué emoción real detectas?",
            options: ["Alegría genuina", "Desprecio / Superioridad moral", "Sorpresa", "Tristeza reprimida"],
            correctIndex: 1,
            successMessage: "Exacto. La elevación unilateral de la comisura es la firma muscular única del Desprecio (músculo cigomático menor). Alguien que dice confiar pero siente desprecio, no confía."
          }
        },
        {
          title: 'Gestos Pacificadores del Nervio Vago',
          concept: 'Acciones repetitivas de autotoque para calmar el estrés: acariciar el cuello, frotar manos, tocarse la cara.',
          tacticalRule: 'Cuando el estrés aumenta sin justificación verbal visible, estás ante un punto ciego o mentira activa.',
          realExample: 'Le preguntas al proveedor sobre el retraso y comienza a ajustarse el cuello de la camisa.',
          chapters: ["Tema_27_Ejemplo_2__Ventas_con_Persuasi", "Tema_28_Ejempllo_3__Manipulacion_Emoti"],
          deepDive: 'El nervio vago regula el parasimpático. El toque en el cuello estimula barorreceptores, reduciendo la frecuencia cardíaca. Es una respuesta biológica incontrolable al estrés.',
          diagram: `graph TD
    A[Pregunta generadora de estrés] --> B[AMÍGDALA activada]
    B --> C[Frecuencia cardíaca sube]
    C --> D[NERVIO VAGO envía señal de calma]
    D --> E[Autotoque: Cuello / Cara / Manos]
    E --> F[Barómetro de estrés TÁCTICO]
    style F fill:#164e63,color:#67e8f9`,
          interactiveChallenge: {
            question: "Durante una negociación crítica, tu contraparte se frota el cuello vigorosamente justo después de que presentas tu propuesta. ¿Qué acción táctica tomas?",
            options: ["Ignorarlo y continuar", "Concluir que está mintiendo y acusarlo", "Hacer una pausa estratégica: 'Tómate el tiempo que necesitas para evaluar esto', y observar qué dice a continuación", "Retirar la propuesta inmediatamente"],
            correctIndex: 2,
            successMessage: "Correcto. El pacificador del nervio vago revela estrés agudo, no necesariamente mentira. La pausa estratégica invita a revelar más información sin presión."
          }
        },
        {
          title: 'Proxémica y Dirección de los Pies',
          concept: 'El cerebro dirige instintivamente los pies hacia donde quiere ir (escape) o hacia quien le interesa. Los pies no mienten.',
          tacticalRule: 'Si el torso de una persona te enfrenta pero sus pies apuntan a la puerta, la conversación terminó para ellos.',
          realExample: 'Tu jefe te sonríe mientras te atiende, pero sus dos pies apuntan hacia la salida de la oficina.',
          chapters: ["Tema_29_Senales_de_Manipulacion", "Tema_30_Conclusion"],
          deepDive: 'Las piernas son la parte del cuerpo más sincera. El cerebro evolucionó para priorizar la huida (supervivencia) antes que la diplomacia facial. Ignorar la cara y mirar los pies revela la intención real.',
          diagram: `graph LR
    A[Cara: Sonría / Cortesía] --- B[Puede ser fabricada]
    C[Pies apuntando hacia...] --- D[INTENCIÓN REAL del cerebro]
    D --> E{Dirección}
    E -- Hacia ti --> F[Interés genuino]
    E -- Hacia la puerta --> G[Quiere salir: conversación terminó]
    E -- Perpendicular --> H[Indiferencia / Neutral]
    style F fill:#064e3b,color:#6ee7b7
    style G fill:#7f1d1d,color:#fca5a5`,
          interactiveChallenge: {
            question: "En una reunión de negocios, el ejecutivo te escucha atentamente y asiente, pero sus pies apuntan hacia la puerta lateral. ¿Cuál es la lectura táctica correcta?",
            options: ["Está muy comprometido con tu propuesta", "Físicamente quiere salir de la conversación aunque cortésmente escuche", "Solo está cómodo en esa postura", "Está esperando que llegue alguien más"],
            correctIndex: 1,
            successMessage: "Exacto. Los pies son los detectores de intención más honestos. Cierra la reunión eficientemente o cambia el tema a algo de mayor interés para él."
          }
        }
      ],
      masteryChecklist: ['Establecer línea base en 3 minutos', 'Detectar asimetría facial (Desprecio)', 'Identificar 2 gestos pacificadores', 'Leer intenciones mediante los pies']
    },
    {
      id: 'm3', bookNumber: 3, title: 'Manipulación y Control Mental', subtitle: 'La Tríada Oscura',
      badge: 'Defensa Oscura', icon: 'fa-user-ninja', readTime: '1h 10m',
      overview: 'Desmontando las tácticas de Maquiavelismo, Psicopatía y Narcisismo. Cómo se infiltra el control mental en el día a día.',
      keyPillars: [
        {
          title: 'El Ciclo de Abuso Maquiavélico (IDE)',
          concept: 'Idealización (Love Bombing) → Devaluación (Crítica sutil) → Descarte. Un ciclo predecible y repetible.',
          tacticalRule: 'Si una relación avanza a velocidad irreal y la persona parece un espejo perfecto de tus gustos, frena en seco.',
          realExample: 'Un nuevo socio dice que eres el único genio que lo comprende, para luego exigirte dinero prestado.',
          chapters: ["Tema_31_Introduction", "Tema_32_El_Proceso_de_Manipulacion"],
          deepDive: 'El Refuerzo Intermitente libera dopamina en picos extremos, creando un vínculo traumático idéntico a la adicción al juego. Cortar el suministro es la única defensa.',
          diagram: `graph LR
    A[LOVE BOMBING] --> B[DEVALUACIÓN]
    B --> C[DESCARTE]
    C --> D{¿Víctima protesta?}
    D -- Sí --> A
    D -- No --> E[Nuevo objetivo]
    A -. Dopamina intensa .-> F[Vínculo Traumático]
    style A fill:#4a1942,color:#f9a8d4
    style B fill:#7c2d12,color:#fed7aa
    style C fill:#1c1917,color:#a8a29e`,
          interactiveChallenge: {
            question: "Conoces a alguien que en 2 semanas ya habla de 'destino', 'nunca conocí a nadie como tú' y quiere formalizar la relación. ¿Qué patrón reconoces?",
            options: ["Una persona genuinamente enamorada", "Love Bombing: Idealización artificial para crear vínculo rápido y dependencia", "Una persona impulsiva pero honesta", "Alguien con alta compatibilidad genuina"],
            correctIndex: 1,
            successMessage: "Correcto. La velocidad sobrenatural es la firma del Love Bombing. El antídoto: desacelera deliberadamente. Si se incomoda por tu ritmo normal, es la confirmación."
          }
        },
        {
          title: 'Luz de Gas (Gaslighting) Avanzado',
          concept: 'Control mental que destruye la confianza de la víctima en su propia cordura mediante negación sistemática de la realidad.',
          tacticalRule: 'No discutas la realidad. Documenta. Responde: "Esa es tu percepción; yo confío en mi memoria y mis registros".',
          realExample: '"Yo nunca dije eso. Estás imaginando cosas. Siempre exageras todo."',
          chapters: ["Tema_33_Ethos", "Tema_34_Pathos", "Tema_35_Logos"],
          deepDive: 'Altera la topología neuronal al causar disonancia cognitiva prolongada. El antídoto es el reality-testing externo: validar con terceros de confianza y mantener un diario de hechos.',
          diagram: `graph TD
    A[MANIPULADOR niega realidad] --> B[Víctima duda de su memoria]
    B --> C[Busca validación del MANIPULADOR]
    C --> D[MANIPULADOR niega más] 
    D --> E[Dependencia total instalada]
    F[DEFENSA: Documenta hechos] --> G[Reality Testing externo]
    G --> H[Rompe el ciclo]
    style E fill:#7f1d1d,color:#fca5a5
    style H fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Tu pareja dice que 'nunca prometió nada' sobre las vacaciones que planeaste juntos hace 3 semanas. Tienes los mensajes guardados. ¿Cuál es la respuesta táctica?",
            options: ["Discutir emocionalmente para probarle que sí lo dijo", "Decir: 'Entiendo tu percepción, aquí están los mensajes del 3 de agosto'", "Ceder para evitar conflicto", "Dudar de tu propia memoria"],
            correctIndex: 1,
            successMessage: "Perfecto. Los documentos son el escudo del Gaslighting. La frase clave es 'entiendo tu percepción' (no debates la realidad) + evidencia objetiva."
          }
        },
        {
          title: 'Triangulación',
          concept: 'Introducir a un tercero real o imaginario para generar celos, competencia y control sobre la víctima.',
          tacticalRule: 'Retírate de la competencia inmediatamente. La única forma de ganar en un triángulo es no jugar.',
          realExample: '"Mi ex nunca me habría tratado así" o "Mi otro empleado hace esto en la mitad del tiempo".',
          chapters: ["Tema_36_Palabras_Cargadas", "Tema_37_Anclaje"],
          deepDive: 'Explota la necesidad humana de pertenencia. Al retirar tu deseo de competir con esa tercera persona, colapsas el andamiaje psicológico del manipulador.',
          diagram: `graph TD
    M[MANIPULADOR] -->|Compara| V[VÍCTIMA]
    M -->|Elogia| T[TERCERO Real o Imaginario]
    T -->|Genera| C[CELOS / Inseguridad en Víctima]
    C -->|Produce| P[COMPLACENCIA Excesiva]
    P -->|Refuerza poder de| M
    D[DEFENSA: No competir] --> R[Colapsa el triángulo]
    style C fill:#7c2d12,color:#fed7aa
    style R fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Tu jefe dice: 'El equipo de Carlos siempre entrega a tiempo. ¿Por qué el tuyo no puede hacer lo mismo?' ¿Cuál es la respuesta táctica?",
            options: ["Trabajar más horas para superar al equipo de Carlos", "Defender tu equipo comparándolo directamente", "Responder sobre tu propia gestión sin entrar en la comparación: 'Nuestro timeline tiene estos factores específicos...'", "Ignorar el comentario completamente"],
            correctIndex: 2,
            successMessage: "Exacto. Rechazar la comparación y hablar solo de tu propio contexto cancela el juego de triangulación. No valides el marco comparativo."
          }
        },
        {
          title: 'Proyección Defensiva',
          concept: 'El manipulador acusa a su víctima de hacer exactamente lo que él mismo está haciendo. Sus acusaciones son confesiones.',
          tacticalRule: 'Las acusaciones sin base de un perfil oscuro suelen ser confesiones de sus propios comportamientos.',
          realExample: 'Una pareja que te es infiel te acusa repentinamente de coquetear con otros sin razón.',
          chapters: ["Tema_38_Disociacion", "Tema_39_Reccuadre_de_Contentos", "Tema_40_Conclusion"],
          deepDive: 'Mecanismo freudiano: incapaces de procesar la culpa, externalizan la disonancia atacando ese rasgo en otra persona. Cada acusación sin base es un revelador de sus propias acciones.',
          diagram: `graph LR
    A[MANIPULADOR comete acto X] --> B[Genera culpa / Disonancia]
    B --> C[No puede procesarlo internamente]
    C --> D[PROYECTA: Acusa a la víctima de X]
    D --> E[Víctima se defiende de acusación falsa]
    E --> F[MANIPULADOR desvía foco de su acto real]
    G[DEFENSA: Analizar la acusación como confesión] --> H[¿Él mismo hace lo que acusa?]
    style D fill:#7c2d12,color:#fed7aa`,
          interactiveChallenge: {
            question: "Sin razón aparente, tu socio empieza a acusarte de 'no ser honesto en las cuentas'. Nunca ha habido un problema financiero de tu parte. ¿Cuál es la lectura táctica?",
            options: ["Revisar tus registros para ver si cometiste algún error", "Interpretar la acusación como posible confesión y auditar las cuentas DE ÉL", "Disculparte para mantener la paz", "Ignorarlo como un malentendido"],
            correctIndex: 1,
            successMessage: "Correcto. La Proyección Defensiva convierte cada acusación sin base en una pista de lo que el acusador puede estar haciendo. Audita silenciosamente sin confrontar."
          }
        }
      ],
      masteryChecklist: ['Identificar Love Bombing en las primeras 72h', 'Aplicar respuesta Roca Gris', 'Desarmar la Triangulación', 'Traducir Proyección como Confesión']
    },
    {
      id: 'm4', bookNumber: 4, title: 'Persuasión de Alto Impacto (PNL)', subtitle: 'Programación Neurolingüística',
      badge: 'Influencia PNL', icon: 'fa-comments-dollar', readTime: '50 min',
      overview: 'Cómo las palabras, la sintaxis y los anclajes alteran el estado emocional. PNL aplicada a la influencia y la negociación.',
      keyPillars: [
        {
          title: 'Rapport y Espejeo (Mirroring)',
          concept: 'La sincronización inconsciente genera confianza extrema. Espejear postura, ritmo y vocabulario activa las neuronas espejo.',
          tacticalRule: 'Espejea con un retraso de 3-5 segundos. Usa las mismas palabras clave del canal VAK de la persona.',
          realExample: 'Si alguien dice "Siento que esto pesa mucho", respondes: "Quitémosle esa presión".',
          chapters: ["Tema_41_Introduction", "Tema_42_Reconocer_al_Manipulador"],
          deepDive: 'Activa neuronas espejo en la corteza premotora. Al lograr resonancia límbica, las defensas del sujeto bajan porque su cerebro identifica al otro como parte del in-group.',
          diagram: `graph TD
    A[Observar canal VAK] --> B{¿Visual, Auditivo o Kinestésico?}
    B -- Visual --> C[Usa: VEO, CLARO, BRILLANTE]
    B -- Auditivo --> D[Usa: SUENA BIEN, RESONAR, ESCUCHAR]
    B -- Kinestésico --> E[Usa: SIENTO, PESADO, SÓLIDO]
    C & D & E --> F[ESPEJEO de vocabulario]
    F --> G[RAPPORT profundo establecido]
    G --> H[Neuronas espejo activas: confianza]
    style H fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Tu cliente dice: 'No VEO claramente cómo esto podría funcionar para nosotros'. ¿Cuál respuesta usa correctamente el canal VAK?",
            options: ["'Entiendo cómo te sientes al respecto'", "'¿Qué parte no suena bien?'", "'Déjame MOSTRARTE un esquema que lo dejará CLARO'", "'Es una opción muy sólida y firme'"],
            correctIndex: 2,
            successMessage: "Perfecto. El cliente usa canal Visual ('VEO', 'claramente'). La respuesta correcta usa 'MOSTRARTE' y 'CLARO': mismo canal, resonancia establecida."
          }
        },
        {
          title: 'Anclaje Emocional',
          concept: 'Asociar un estímulo externo a un estado emocional intenso para dispararlo a voluntad. Condicionamiento pavloviano avanzado.',
          tacticalRule: 'Instala el ancla SOLO cuando la persona esté en el pico (clímax) de la emoción, no antes ni después.',
          realExample: 'Hacer un gesto único cada vez que tu equipo ríe intensamente. Usarlo en una crisis para evocar calma.',
          chapters: ["Tema_43_Principios_de_la_Persuasion"],
          deepDive: 'Se requiere pureza (estímulo único), intensidad (pico emocional real) y timing exacto (1-3 segundos antes del clímax) para instalar un ancla kinestésica o espacial válida.',
          diagram: `graph TD
    A[Identificar emoción fuerte en la persona] --> B[Esperar el PICO del clímax emocional]
    B --> C[Instalar estímulo único y específico]
    C --> D[Repetir el proceso 3-5 veces]
    D --> E[ANCLA instalada]
    E --> F[Usar el estímulo cuando se necesita la emoción]
    F --> G[Emoción se dispara automáticamente]
    style E fill:#1e1b4b,color:#c4b5fd`,
          interactiveChallenge: {
            question: "Quieres instalar un ancla de confianza en un cliente cuando hablas de tu producto. ¿En qué momento exacto debes activar el estímulo ancla?",
            options: ["Al inicio de la conversación para prepararlo", "Exactamente cuando el cliente está en el momento más emocionalmente intenso de entusiasmo", "Al final de la reunión como cierre", "Cuando el cliente parece neutral y tranquilo"],
            correctIndex: 1,
            successMessage: "Correcto. El timing lo es todo. Instalar el ancla fuera del pico emocional es inefectivo. Sin intensidad neuroquímica, no hay condicionamiento."
          }
        },
        {
          title: 'Patrones de Lenguaje Milton',
          concept: 'Hipnosis conversacional usando lenguaje vagamente específico y presuposiciones para pasar órdenes al subconsciente.',
          tacticalRule: 'Detecta presuposiciones: "¿Qué te gustaría comprar hoy?" presupone que COMPRARÁS, solo falta elegir qué.',
          realExample: '"No sé qué tan rápido te darás cuenta de que este acuerdo es la mejor opción."',
          chapters: ["Tema_44_Ethos", "Tema_45_Pathos"],
          deepDive: 'Sobrecarga el hemisferio izquierdo (analítico) con estructuras ambiguas complejas, permitiendo que las sugestiones pasen directamente al hemisferio derecho (inconsciente).',
          diagram: `graph LR
    A[Patrón de lenguaje ambiguo] --> B[Sobrecarga hemisferio izquierdo]
    B --> C[Filtro crítico ocupado analizando]
    C --> D[Sugestión pasa al hemisferio derecho]
    D --> E[Subconsciente acepta la orden]
    F[TIPOS de patrones] --> F1[Presuposiciones] & F2[Comandos ocultos] & F3[Citas indirectas]`,
          interactiveChallenge: {
            question: "La frase 'Antes de decidir si estás listo para empezar, ¿qué dudas tienes?' contiene una presuposición. ¿Cuál es?",
            options: ["Que tienes dudas", "Que ya estás listo para empezar (solo falta resolver dudas)", "Que debes decidir", "Que no estás seguro"],
            correctIndex: 1,
            successMessage: "Exacto. La presuposición embebida es: 'ya estás listo'. La pregunta no es IF sino WHEN y con qué dudas. El cerebro acepta la premisa sin cuestionarla."
          }
        },
        {
          title: 'Reencuadre (Reframing)',
          concept: 'Cambiar el significado emocional de un evento alterando el marco contextual sin cambiar los hechos.',
          tacticalRule: 'Ante una objeción, no la niegues. Cambia el marco temporal, de escala o de significado.',
          realExample: 'Objeción: "Es muy caro". Reencuadre: "Precisamente por eso garantiza que no tendrás que comprarlo dos veces".',
          chapters: ["Tema_46_PNL_y_Ritmo_y_Liderazgo", "Tema_47_Conclusion"],
          deepDive: 'El significado depende del marco. El Reframing mueve el comportamiento a un entorno donde adquiere un valor diferente, o cambia la evaluación del mismo evento.',
          diagram: `graph LR
    A[MISMO HECHO objetivo] --> B[Marco 1: Pérdida]
    A --> C[Marco 2: Inversión]
    A --> D[Marco 3: Aprendizaje]
    B --> B1[Respuesta emocional negativa]
    C --> C1[Respuesta emocional neutral/positiva]
    D --> D1[Respuesta emocional de crecimiento]
    style B1 fill:#7f1d1d,color:#fca5a5
    style C1 fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Un cliente dice: 'Su producto lleva solo 2 años en el mercado, es muy nuevo'. ¿Cuál es el reencuadre correcto?",
            options: ["'Tiene razón, somos nuevos pero mejoraremos'", "'2 años es mucho tiempo en tecnología'", "'Precisamente por eso incorporamos lo más reciente del sector, sin las limitaciones de sistemas heredados obsoletos'", "'Le mostramos más testimonios para generar confianza'"],
            correctIndex: 2,
            successMessage: "Correcto. Convertiste 'nuevo = riesgo' en 'nuevo = ventaja competitiva'. El marco no cambió el hecho (2 años), cambió su significado emocional."
          }
        }
      ],
      masteryChecklist: ['Establecer Rapport físico sutil', 'Identificar canal VAK', 'Detectar 2 comandos ocultos de Milton', 'Aplicar Reframing a una objeción']
    },
    {
      id: 'm5', bookNumber: 5, title: 'Terapia Cognitivo Conductual (TCC)', subtitle: 'Hackeando el Sistema',
      badge: 'Blindaje TCC', icon: 'fa-shield-heart', readTime: '1h',
      overview: 'La armadura mental. Cómo desmantelar pensamientos intrusivos, ansiedad y secuelas de manipulación.',
      keyPillars: [
        {
          title: 'Reestructuración Cognitiva (Tríada de Beck)',
          concept: 'Modelo Pensamiento → Emoción → Comportamiento. No sufres por el evento, sufres por tu interpretación del evento.',
          tacticalRule: 'Atrapa el pensamiento distorsionado, examínalo con lógica y reemplázalo antes de que genere la emoción tóxica.',
          realExample: 'En vez de "soy un fracaso", pensar "esta tarea falló; ajustaré el método para la siguiente".',
          chapters: ["Tema_48_Introduction", "Tema_49_La_Historia_de_la_Inteligencia", "Tema_50_Como_Funciona_la_TCC", "Tema_51_Por_que_se_Utiliza_la_TCC"],
          deepDive: 'Las distorsiones cognitivas (catastrofización, personalización, pensamiento todo-nada) son vulnerabilidades explotables. El Registro de Pensamientos audita la lógica y neutraliza el secuestro emocional.',
          diagram: `graph TD
    E[EVENTO] --> P[PENSAMIENTO automático]
    P --> EM[EMOCIÓN]
    EM --> C[COMPORTAMIENTO]
    C --> E
    P -- Distorsión detectada --> PR[Pregunta: ¿Es un hecho o interpretación?]
    PR --> RP[PENSAMIENTO ALTERNATIVO]
    RP --> EMB[Emoción más equilibrada]
    style P fill:#7c2d12,color:#fed7aa
    style RP fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Piensas: 'Si no consigo este cliente, mi carrera está arruinada'. ¿Qué distorsión cognitiva es esta?",
            options: ["Personalización", "Catastrofización (pensamiento todo-o-nada)", "Lectura mental", "Abstracción selectiva"],
            correctIndex: 1,
            successMessage: "Correcto. Catastrofización: convertir un revés en una catástrofe total. La reestructuración: '¿Hay evidencia de que UNO cliente define TODA mi carrera? No. Los datos dicen: tengo X otros clientes potenciales'."
          }
        },
        {
          title: 'Desensibilización Sistemática',
          concept: 'Exposición gradual y controlada a estímulos que generan miedo para reentrenar el cerebro límbico.',
          tacticalRule: 'No evites el conflicto. Divide la confrontación en 5 pasos y expónte al Nivel 1 primero.',
          realExample: 'Miedo a hablar en público: grábate solo → habla con 1 amigo → habla ante 5 personas → conferencia.',
          chapters: ["Tema_52_Entender_la_Terapia_Conductual", "Tema_53_Cuando_la_Terapia_Cognitiva_y_"],
          deepDive: 'El miedo evitativo refuerza la fobia (condicionamiento operante). La exposición progresiva rompe el ciclo, creando nuevas vías neuronales de tolerancia.',
          diagram: `graph TD
    A[Jerarquía de Miedo: 10 niveles] --> B[Nivel 1: Mínima incomodidad]
    B --> C[Exposición repetida hasta habituación]
    C --> D[Nivel 2]
    D --> E[...]
    E --> F[Nivel 10: Mayor miedo]
    F --> G[DESENSIBILIZACIÓN COMPLETA]
    style G fill:#064e3b,color:#6ee7b7
    style B fill:#1e3a5f,color:#93c5fd`,
          interactiveChallenge: {
            question: "Tienes fobia a confrontar a tu jefe. ¿Cuál es el primer paso correcto de la Desensibilización Sistemática?",
            options: ["Confrontarlo directamente sobre el tema más difícil primero para superar el miedo de golpe", "Visualizar la confrontación exitosa en un entorno relajado, sin acción real todavía", "Evitarlo durante un mes y luego intentarlo", "Pedir a otro que lo confronte por ti"],
            correctIndex: 1,
            successMessage: "Exacto. La exposición comienza en el nivel más bajo: la visualización. El sistema nervioso aprende que el estímulo no es amenaza antes de la exposición real."
          }
        },
        {
          title: 'Detención del Pensamiento (Thought Stopping)',
          concept: 'Interrupción física o verbal de rumiaciones obsesivas para romper el ciclo neuronal de ansiedad.',
          tacticalRule: 'Cuando la rumiación comience, usa una señal contundente (aplaudir, decir ALTO en voz alta, ligar de goma en la muñeca).',
          realExample: 'Llevas 2 horas sobrepensando un mensaje. Dices "ALTO" y te pones a hacer ejercicio físico.',
          chapters: ["Tema_54_TCC_y_Anisiedad", "Tema_55_Exposicion_Graduada", "Tema_56_Juegos_de_Rol__Que_pasa_si"],
          deepDive: 'Las rumiaciones fortalecen sinapsis tóxicas. El Thought Stopping induce un shock cognitivo que permite redirigir el foco atencional al córtex prefrontal dorsolateral.',
          diagram: `graph LR
    A[Pensamiento obsesivo inicia] --> B[Bucle de Rumiación]
    B --> C[Ansiedad aumenta]
    C --> D[Más rumiación: círculo vicioso]
    E[SEÑAL DE INTERRUPCIÓN: ALTO / Aplauso] --> F[Shock cognitivo momentáneo]
    F --> G[Bucle interrumpido]
    G --> H[Redirigir a actividad física o externa]
    style E fill:#1e1b4b,color:#c4b5fd
    style G fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Llevas 3 horas rumiando sobre un correo de tu jefe. La técnica de Thought Stopping dice:",
            options: ["Analizar el correo 10 veces más hasta encontrar la intención real", "Escribir todos tus pensamientos hasta agotarlos", "Emitir una señal de interrupción física inmediata (ALTO o aplauso) y cambiar el entorno físicamente", "Llamar a alguien para contarle la historia completa"],
            correctIndex: 2,
            successMessage: "Correcto. El shock cognitivo físico (no mental) es lo que rompe el bucle. La acción corporal corta la conexión prefrontal-límbica de la rumiación."
          }
        },
        {
          title: 'Reatribución Matemática de la Culpa',
          concept: 'Las víctimas de abuso asumen el 100% de la culpa. La reatribución distribuye la responsabilidad real con lógica visual.',
          tacticalRule: 'Dibuja una tarta de porcentajes y asigna responsabilidad real a TODAS las partes implicadas.',
          realExample: '"Me gritó por el retraso". Reatribución: 10% retraso, 90% su falta de control emocional.',
          chapters: ["Tema_57_Aproximacion_Sucesiva", "Tema_58_Programacion_de_Actividades", "Tema_59_Conclusion"],
          deepDive: 'Al usar lógica espacial y visual, el cerebro activa el hemisferio analítico, disolviendo el secuestro emocional de la culpa internalizada artificialmente.',
          diagram: `graph LR
    A[Evento traumático] --> B[Víctima asume 100% culpa]
    B --> C[EJERCICIO: Listar todos los actores]
    C --> D[Asignar % a cada uno con lógica]
    D --> E[Víctima típicamente: 5-20%]
    E --> F[Culpa real: proporcional]
    F --> G[LIBERACIÓN: Autocompasión fundamentada]
    style B fill:#7f1d1d,color:#fca5a5
    style G fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Tras ser manipulado en una negociación, piensas: 'Fui un idiota, todo fue mi culpa'. ¿Cuál es el primer paso de la Reatribución Matemática?",
            options: ["Aceptar la culpa y aprender la lección", "Listar todos los factores y personas implicadas, incluyendo las tácticas del otro, y asignar % de responsabilidad a cada uno", "Buscar a alguien que te diga que no fue tu culpa", "Olvidarlo rápidamente"],
            correctIndex: 1,
            successMessage: "Correcto. La lógica visual (la tarta) impide que la emoción dicte el resultado. Distribuir responsabilidad no es negar la tuya; es calibrarla con precisión."
          }
        }
      ],
      masteryChecklist: ['Identificar catastrofización propia', 'Aplicar reencuadre lógico en tiempo real', 'Ejecutar Thought Stopping en < 5 segundos', 'Realizar Reatribución Matemática']
    },
    {
      id: 'm6', bookNumber: 6, title: 'Recuperación del Abuso Narcisista', subtitle: 'Reconstrucción del Yo',
      badge: 'Recuperación', icon: 'fa-house-medical-flag', readTime: '45 min',
      overview: 'Protocolos de emergencia y recuperación a largo plazo tras sobrevivir a perfiles de la Tríada Oscura.',
      keyPillars: [
        {
          title: 'Protocolo Contacto Cero y DARVO',
          concept: 'DARVO: Deny (Negar), Attack (Atacar), Reverse Victim and Offender. Nunca te defiendas: les das suministro emocional.',
          tacticalRule: 'Aplica Contacto Cero radical o el Método de la Roca Gris si el contacto es inevitable.',
          realExample: 'Dices "me lastimaste" y responde "tú estás loca, siempre dramatizas". Te retiras en silencio.',
          chapters: ["Tema_60_Introduction", "Tema_61_Abuso_sexual", "Tema_62_Abuso_espiritual", "Tema_63_Abuso_narcisista"],
          deepDive: 'Explicar tus sentimientos le da suministro emocional. El narcisismo maligno carece de empatía estructural. La única victoria es retirar completamente la atención.',
          diagram: `graph TD
    V[Víctima confronta] --> D[DARVO activado]
    D --> D1[Negar hecho]
    D --> D2[Atacar a la víctima]
    D --> D3[Invertir roles: yo soy la víctima]
    D1 & D2 & D3 --> E[Víctima se defiende: SUMINISTRO dado]
    F[DEFENSA: Roca Gris] --> G[Respuesta plana: Ok. Entiendo. Mmm.]
    G --> H[Sin suministro: manipulador pierde interés]
    style E fill:#7f1d1d,color:#fca5a5
    style H fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "Le dices a tu ex: 'Fuiste cruel cuando hiciste X'. Responde: '¡ERES UN PSICÓPATA POR DECIR ESO! Yo soy quien sufre aquí'. ¿Qué táctica es y cómo respondes?",
            options: ["Es Gaslighting. Explicas con más detalle lo que hizo", "Es DARVO. No debatir roles. Roca Gris: 'Entiendo que lo ves así' y retirarte", "Es Triangulación. Nombrar a la tercera persona", "Es Proyección. Acusarlo de lo mismo que hace él"],
            correctIndex: 1,
            successMessage: "Exacto. DARVO reconocido y neutralizado. La Roca Gris corta el suministro sin darle material para escalar. El silencio y la retirada son la victoria."
          }
        },
        {
          title: 'Sanar el Vínculo Traumático (Trauma Bond)',
          concept: 'Vínculo químico generado por el refuerzo intermitente. Idéntico neurológicamente a la adicción a sustancias.',
          tacticalRule: 'Trátalo como rehabilitación de narcóticos. Acepta el síndrome de abstinencia como proceso necesario.',
          realExample: 'Sientes necesidad de llamarlo después de que te insultó, porque él mismo era tu "curación" del dolor que causaba.',
          chapters: ["Tema_64_Perdonate_a_ti_Mismo", "Tema_65_Reclama_tu_Narrativa", "Tema_66_El_Narcisista", "Tema_67_DARVO_y_el_Narcisista"],
          deepDive: 'El Trauma Bond requiere 90 días de abstinencia total para que los receptores dopaminérgicos del cerebro vuelvan a regularse. La terapia de pareja empeora el trauma.',
          diagram: `graph LR
    A[Abuso] --> B[Dolor intenso]
    B --> C[Amabilidad esporádica del abusador]
    C --> D[Alivio: Pico de dopamina]
    D --> E[El abusador = fuente del alivio]
    E --> F[ADICCIÓN NEUROQUÍMICA: Trauma Bond]
    G[DESINTOXICACIÓN: 90 días Contacto Cero] --> H[Receptores dopaminérgicos se regulan]
    H --> I[Autonomía emocional restaurada]
    style F fill:#7f1d1d,color:#fca5a5
    style I fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "A los 30 días de contacto cero, la ansiedad es intensa y quieres llamarlo. Esto significa:",
            options: ["Que lo amas de verdad y debes llamarlo", "Síndrome de abstinencia neuroquímica normal. La ansiedad confirma que el proceso de desintoxicación está funcionando", "Que cometiste un error al alejarte", "Que necesitas terapia de pareja"],
            correctIndex: 1,
            successMessage: "Correcto. La ansiedad en el Día 30 es evidencia de que el cerebro está recalibrando, no de que debas volver. Completar los 90 días es no negociable para la recuperación real."
          }
        },
        {
          title: 'Monos Voladores (Flying Monkeys)',
          concept: 'Terceros reclutados consciente o inconscientemente por el narcisista para hacer el trabajo sucio: espiarte, persuadirte o transmitir mensajes.',
          tacticalRule: 'No intentes convencerlos de la verdad. Son extensiones del abusador. Córtalos también.',
          realExample: 'Tu suegra te llama para decirte: "Él está muy triste, dale otra oportunidad".',
          chapters: ["Tema_68_Perder_la_Confianza_en_uno_Mis", "Tema_69_Problemas_de_Salud_Mental"],
          deepDive: 'El narcisista externaliza el acoso. Proveerles información a ellos es proveerle al abusador. Compartimentación extrema y contacto cero extendido son necesarios.',
          diagram: `graph TD
    N[NARCISISTA] -->|Recluta o manipula| M1[Mono 1: Familiar]
    N -->|Recluta o manipula| M2[Mono 2: Amigo común]
    N -->|Recluta o manipula| M3[Mono 3: Colega]
    M1 & M2 & M3 -->|Mensajes, espionaje, presión| V[VÍCTIMA]
    D[DEFENSA] --> D1[No compartir información]
    D --> D2[Cortar también a los monos]
    D --> D3[Compartimentar vida social]`,
          interactiveChallenge: {
            question: "Un amigo común te dice que el narcisista 'está devastado y ha cambiado mucho'. ¿Cuál es la respuesta táctica correcta?",
            options: ["Agradecer la información y considerar retomar el contacto", "Responder: 'Gracias, no tengo información que compartir' y terminar la conversación", "Explicarle todo lo que el narcisista te hizo para que lo entienda", "Preguntarle detalles sobre cómo está el narcisista"],
            correctIndex: 1,
            successMessage: "Correcto. El amigo puede ser un Mono Volador involuntario. Cualquier información que des llegará al narcisista. La respuesta mínima no alimenta el canal."
          }
        },
        {
          title: 'Reconstrucción de Límites Rígidos',
          concept: 'Un límite no es decirle al otro lo que debe hacer. Es decirle lo que TÚ harás si cruza una línea. Autoejecutable e irrefutable.',
          tacticalRule: 'Formula límites con acción propia que puedas cumplir inmediatamente, sin condiciones ni negociación.',
          realExample: 'No dices "deja de llamarme a las 3 AM". Dices "mi teléfono estará apagado después de las 10 PM".',
          chapters: ["Tema_70_Cortar_el_Contacto_por_Complet", "Tema_71_Convirette_en_la_Roca_Gris", "Tema_72_Buscar_Apoyo", "Tema_73_Escriba_sus_Razones_para_Irse", "Tema_74_Inteligencia_Emocional", "Tema_75_Afirmaciones", "Tema_76_Conclusion"],
          deepDive: 'Las víctimas tienen límites amorfos o inexistentes. La recuperación requiere reconstruir el Ego sintónico mediante acciones autoejecutables que restauran el locus de control interno.',
          diagram: `graph LR
    A[Límite difuso: El otro no debe hacer X] --> B[Depende del comportamiento del otro]
    B --> C[Manipulable e inefectivo]
    D[Límite rígido: YO haré Y si se cruza la línea] --> E[Depende de MI acción]
    E --> F[Autoejecutable e irrefutable]
    F --> G[Locus de control interno restaurado]
    style C fill:#7f1d1d,color:#fca5a5
    style G fill:#064e3b,color:#6ee7b7`,
          interactiveChallenge: {
            question: "¿Cuál de estas es una formulación correcta de límite rígido?",
            options: ["'Necesito que dejes de gritarme'", "'Si me gritas, termino la conversación inmediatamente y la retomamos cuando ambos estemos calmados'", "'Por favor, trata de controlar tu tono'", "'No me gusta cuando te comportas así'"],
            correctIndex: 1,
            successMessage: "Exacto. El límite correcto describe TU ACCIÓN (terminar la conversación), no el comportamiento del otro. Es autoejecutable: no necesita su cooperación para funcionar."
          }
        }
      ],
      masteryChecklist: ['Reconocer ataque DARVO en < 10 segundos', 'Aplicar Contacto Cero 90 días', 'Identificar y cortar Monos Voladores', 'Redactar 3 Límites Autoejecutables']
    }
  ],

  tacticalMatrix: [
    { id: 't1', category: 'Manipulación Psicológica', name: 'Gaslighting (Luz de Gas)', severity: 'Crítica', icon: 'fa-fire-burner',
      howItWorks: 'Alteración sistemática de la realidad de la víctima para hacerle dudar de su cordura y depender del manipulador como árbitro de la verdad.',
      redFlags: ['Niega cosas que claramente ocurrieron', 'Te dice que eres "demasiado sensible"', 'Usa tu historial emocional contra ti', 'Reescribe conversaciones pasadas'],
      counterScript: 'Sé lo que vi y confío en mi memoria. No debatiré la realidad. Aquí está la documentación.',
      deepMechanics: 'Desgasta el locus de control interno. Mantén un diario de hechos con fechas y testigos como ancla externa de realidad.' },

    { id: 't2', category: 'Abuso Narcisista', name: 'DARVO (Deflexión)', severity: 'Alta', icon: 'fa-rotate',
      howItWorks: 'Invertir los roles con velocidad para que el abusador parezca la víctima y la víctima el agresor, desorientando a la persona.',
      redFlags: ['Culpabilización inversa instantánea', 'Llanto estratégico repentino', 'Acusaciones que invalidan tu percepción', 'Tergiversación histórica en segundos'],
      counterScript: 'No hablamos de mis reacciones ahora. Hablamos de tus acciones. No cambiaré el tema.',
      deepMechanics: 'Requiere Disco Rayado para devolver el enfoque al tema original sin importar cuántas veces desvíen.' },

    { id: 't3', category: 'Persuasión & Negociación', name: 'Sesgo de Anclaje Numérico', severity: 'Media', icon: 'fa-anchor',
      howItWorks: 'Lanzar primero un número extremo (alto o bajo) para que todas las negociaciones posteriores graviten hacia ese ancla de referencia.',
      redFlags: ['Precio inicial absurdamente alto o bajo', 'Urgencia extrema para no perder el ancla', 'Datos de comparación presentados inmediatamente después del ancla'],
      counterScript: 'Esa cifra está fuera del rango de mercado. Empecemos desde una base objetiva: [TU ANCLA PROPIA con datos].',
      deepMechanics: 'Para desanclar: mostrar shock genuino al ancla, nombrar el sesgo explícitamente, y lanzar tu propio ancla respaldada por datos de mercado.' },

    { id: 't4', category: 'Defensa Táctica', name: 'Roca Gris (Grey Rock)', severity: 'Escudo', icon: 'fa-cubes-stacked',
      howItWorks: 'Convertirse en una persona tan emocionalmente plana y predecible que el manipulador pierde interés por falta de recompensa emocional.',
      redFlags: ['Provocaciones gratuitas y repetitivas', 'Buscan tu enfado o llanto', 'Preguntan sobre tu vida privada insistentemente'],
      counterScript: '[Tono completamente neutro, sin inflexión]: Ok. Ya veo. Mmm. Entendido. Que tengas un buen día.',
      deepMechanics: 'Sin recompensa neuroquímica (tu reacción emocional), el manipulador se aburre. La respuesta plana no los ataca: simplemente los "des-alimenta".' },

    { id: 't5', category: 'Manipulación Psicológica', name: 'Triangulación', severity: 'Alta', icon: 'fa-triangle-exclamation',
      howItWorks: 'Introducir a un tercero real o imaginario para generar celos, comparaciones dañinas e inseguridad que el manipulador controla.',
      redFlags: ['Comparaciones constantes con ex, colegas o amigos', 'Menciona lo que "otros" harían en tu lugar', 'Elogia a terceros en tu presencia para verte reaccionar'],
      counterScript: 'Me alegra que seas feliz con esa persona/opción. Mi posición es esta y permanece igual.',
      deepMechanics: 'Retirar completamente tu deseo de competir colapsa el andamiaje. El poder del triángulo depende de que TÚ quieras "ganar".' },

    { id: 't6', category: 'Abuso Narcisista', name: 'Love Bombing (Bombardeo Afectivo)', severity: 'Crítica', icon: 'fa-heart-circle-bolt',
      howItWorks: 'Abrumar a la víctima con atención excesiva, elogios intensos y compromiso prematuro para crear dependencia emocional rápida.',
      redFlags: ['"Nunca conocí a alguien como tú" en la primera semana', 'Planes de futuro formales muy temprano', 'Mensajes constantes que generan ansiedad si no respondes', 'Se ofenden si desaceleran el ritmo'],
      counterScript: 'Aprecio tu interés. Me tomo el tiempo necesario para conocer a las personas. Respeto eso en ambas direcciones.',
      deepMechanics: 'La velocidad sobrenatural crea un vínculo artificial antes de que tu cerebro pueda evaluar la persona real. Desacelerar deliberadamente y observar la reacción es el test definitivo.' },

    { id: 't7', category: 'Persuasión & Negociación', name: 'Escasez Artificial (FOMO)', severity: 'Media', icon: 'fa-hourglass-half',
      howItWorks: 'Crear un sentido de urgencia o escasez falsa para presionar una decisión rápida que evite el análisis del Sistema 2.',
      redFlags: ['"Solo quedan 2 unidades"', '"La oferta expira en 24 horas"', '"Hay otros 3 interesados en esto"', 'Presión antes de que puedas consultar'],
      counterScript: 'Si la oferta no existe mañana, no era la oferta correcta para mí. Necesito 24 horas para decidir.',
      deepMechanics: 'La urgencia artificial activa la amígdala y apaga el Sistema 2 (análisis lógico). La frase "si no hay tiempo para pensar, no hay trato" es tu escudo universal.' },

    { id: 't8', category: 'Manipulación Psicológica', name: 'Future Faking (Falso Futuro)', severity: 'Alta', icon: 'fa-wand-magic-sparkles',
      howItWorks: 'Hacer promesas elaboradas de un futuro brillante que nunca ocurrirá, para extraer tiempo, recursos o esfuerzo de la víctima en el presente.',
      redFlags: ['Promesas grandes con plazos vagos', 'El futuro prometido siempre requiere "un poco más de ti ahora"', 'Cuando preguntas detalles, el tema cambia', 'Historial de promesas no cumplidas racionalizado'],
      counterScript: 'Eso suena bien. ¿Podemos poner esto por escrito con una fecha específica? Compromisos claros me ayudan a planificar.',
      deepMechanics: 'El antídoto es siempre llevar el futuro al presente: "¿Qué paso concreto ocurre HOY?". Si no hay respuesta concreta, no hay futuro real.' },

    { id: 't9', category: 'Defensa Táctica', name: 'Técnica del Disco Rayado', severity: 'Escudo', icon: 'fa-record-vinyl',
      howItWorks: 'Repetir calmadamente la misma posición una y otra vez, sin importar las objeciones, presiones o cambios de tema del interlocutor.',
      redFlags: ['Sientes presión de ceder para "no ser terco"', 'Te dan vueltas con argumentos distintos a la misma solicitud', 'Cada vez que rechazas, aparece un argumento nuevo'],
      counterScript: 'Entiendo tu punto. Mi posición sigue siendo [X]. [Repetir cuantas veces sea necesario con tono neutro].',
      deepMechanics: 'La variación de argumento es la táctica. El Disco Rayado funciona porque tú nunca debes responder AL ARGUMENTO, sino volver siempre a tu posición fija.' },

    { id: 't10', category: 'Abuso Narcisista', name: 'Proyección Defensiva', severity: 'Alta', icon: 'fa-mirror',
      howItWorks: 'El manipulador acusa a la víctima de exactamente lo que él mismo está haciendo, para desviar la atención y procesar su propia culpa.',
      redFlags: ['Acusaciones repentinas y sin base', 'El tema acusado es algo que tú nunca has hecho', 'La intensidad de la acusación no corresponde al supuesto hecho'],
      counterScript: 'Eso es interesante. Voy a revisar los registros para ver si hay algo que haya pasado desapercibido. [Audita silenciosamente al acusador].',
      deepMechanics: 'La Proyección es una radiografía del acusador. Cada acusación sin base debe tratarse como una pista para investigar al acusador, no como una verdad a defender.' },

    { id: 't11', category: 'Persuasión & Negociación', name: 'Pie en la Puerta (Foot-in-the-Door)', severity: 'Media', icon: 'fa-door-open',
      howItWorks: 'Pedir un favor pequeño primero para establecer un precedente de cooperación y luego escalar a solicitudes mucho mayores.',
      redFlags: ['Solicitudes que siempre escalan gradualmente', 'Apelan a tu consistencia: "Pero si antes dijiste sí..."', 'Pequeños favores que nunca parecen tener fin'],
      counterScript: 'Acepto esto específico. Eso no establece ningún precedente para solicitudes futuras. Cada solicitud la evalúo de forma independiente.',
      deepMechanics: 'Explotan el principio de coherencia: las personas quieren ser consistentes con su propio historial de decisiones. Romper explícitamente el precedente en el momento oportuno desmonta la escalada.' },

    { id: 't12', category: 'Manipulación Psicológica', name: 'Aislamiento Progresivo', severity: 'Crítica', icon: 'fa-user-slash',
      howItWorks: 'Separar a la víctima de su red de apoyo (amigos, familia) de forma gradual para aumentar la dependencia del manipulador.',
      redFlags: ['Críticas constantes a tus seres queridos', 'Incidentes que "siempre ocurren" cuando ves a ciertos amigos', 'Necesidad de que reportes con quién estás', 'Tus amigos expresan preocupación'],
      counterScript: 'Mi red de apoyo es no negociable. El cuidado hacia otras personas no compite con mi relación contigo.',
      deepMechanics: 'El aislamiento es el prerrequisito de todo abuso severo. Mantener conexiones externas activas es el escudo estructural más poderoso contra cualquier tipo de control.' },

    { id: 't13', category: 'Defensa Táctica', name: 'Técnica BIFF (Breve, Informativo, Firme, Amistoso)', severity: 'Escudo', icon: 'fa-message',
      howItWorks: 'Metodología de comunicación para responder a mensajes hostiles o manipuladores sin dar material para escalar el conflicto.',
      redFlags: ['Mensajes que buscan provocar respuesta emocional larga', 'Acusaciones que merecen defensa extensa', 'Comunicación con ex abusivos o en disputas legales'],
      counterScript: '[Breve] Recibí tu mensaje. [Informativo] Los documentos están donde acordamos. [Firme] Seguiré el proceso establecido. [Amistoso] Que tengas un buen día.',
      deepMechanics: 'Cada línea extra que añades es material para ser tergiversado. BIFF corta la provisión de información al mínimo funcional, eliminando vectores de ataque.' },

    { id: 't14', category: 'Abuso Narcisista', name: 'Hoovering (La Aspiradora)', severity: 'Alta', icon: 'fa-arrows-spin',
      howItWorks: 'Después del descarte, el narcisista reaparece para "aspirar" a la víctima de vuelta a la relación con promesas de cambio.',
      redFlags: ['Reaparecer después de períodos de silencio', '"Esta vez es diferente, cambié de verdad"', 'Uso de fechas significativas (cumpleaños, aniversarios)', 'Contacto a través de terceros cuando el directo falla'],
      counterScript: '[Sin respuesta o si es inevitable]: Necesito mantener el acuerdo que tomé. No está disponible el contacto en este momento.',
      deepMechanics: 'El Hoovering explota el Trauma Bond. La respuesta más poderosa es el silencio absoluto. Cualquier respuesta, incluso negativa, confirma que el canal existe.' },

    { id: 't15', category: 'Manipulación Psicológica', name: 'Control a través de la Culpa', severity: 'Alta', icon: 'fa-weight-hanging',
      howItWorks: 'Inducir culpa por acciones normales o por ejercer derechos propios para controlar el comportamiento de la víctima.',
      redFlags: ['"Después de todo lo que hice por ti"', '"Si me quisieras de verdad, no harías esto"', 'Tu bienestar se convierte en motivo de culpa permanente', '"Eres muy egoísta"'],
      counterScript: 'Te escucho. Tomar decisiones que me cuidan a mí no significa que no me importe tu bienestar.',
      deepMechanics: 'La culpa inducida explota la empatía. La defensa es distinguir entre culpa funcional (violé mis valores) y culpa tóxica (me cuido a mí mismo). Solo la primera merece acción.' },

    { id: 't16', category: 'Persuasión & Negociación', name: 'Framing (Encuadre Selectivo)', severity: 'Media', icon: 'fa-crop-simple',
      howItWorks: 'Presentar información seleccionada estratégicamente para que la única conclusión lógica disponible sea la que el influenciador quiere.',
      redFlags: ['Las opciones presentadas no incluyen la que más te conviene', 'Datos estadísticos sin contexto', '"¿Preferiría A o B?" cuando C es la opción real'],
      counterScript: '¿Cuáles son todas las opciones disponibles, incluyendo las que no me has mencionado? ¿Qué información existe que no está en este análisis?',
      deepMechanics: 'Expandir el marco conscientemente: siempre preguntar por las opciones excluidas, el período de tiempo diferente y la perspectiva de un tercero neutral.' },

    { id: 't17', category: 'Defensa Táctica', name: 'Método de Validación Estratégica', severity: 'Escudo', icon: 'fa-handshake',
      howItWorks: 'Reconocer y validar el estado emocional del interlocutor sin ceder a su demanda, para reducir la reactividad y mantener el control.',
      redFlags: ['Conversaciones que escalan emocionalmente', 'Cuando la otra parte se siente "no escuchada"', 'Negociaciones con alto contenido emocional'],
      counterScript: 'Entiendo que esto es importante para ti y que te sientes frustrado. Nuestro acuerdo sigue siendo [X].',
      deepMechanics: 'Separar la validación emocional ("entiendo cómo te sientes") de la concesión de la demanda ("pero mi posición no cambia") es la llave de la negociación avanzada.' },

    { id: 't18', category: 'Abuso Narcisista', name: 'Silent Treatment (Silencio Punitivo)', severity: 'Alta', icon: 'fa-volume-xmark',
      howItWorks: 'Usar el silencio deliberado como castigo para generar ansiedad, hacer que la víctima "ruegue" y restablecer el poder.',
      redFlags: ['Silencio repentino sin explicación', 'El silencio termina cuando cedes o te disculpas', 'Dura exactamente hasta que el narcisista necesita algo de ti'],
      counterScript: 'Estoy disponible para hablar cuando quieras. Mientras tanto, seguiré con mi vida normalmente.',
      deepMechanics: 'El Silent Treatment funciona si se convierte en tu problema. Al normalizar el silencio como "está bien, cada quien en lo suyo", pierdes el poder del castigo.' },

    { id: 't19', category: 'Manipulación Psicológica', name: 'Splitting (Pensamiento Blanco-Negro)', severity: 'Media', icon: 'fa-circle-half-stroke',
      howItWorks: 'El manipulador percibe y trata a las personas como perfectas o terribles sin término medio, cambiando entre ambos extremos según le convenga.',
      redFlags: ['Eres "lo mejor que les pasó" y días después "lo peor"', 'No hay conversación en zona gris', '"O estás conmigo o contra mí"', 'Sus valoraciones de terceros oscilan extremas'],
      counterScript: 'Las personas somos complejas. Prefiero conversaciones donde ambos podemos ser imperfectos y aún estar de acuerdo.',
      deepMechanics: 'Característico del Trastorno de Personalidad Límite y el Narcisismo. No confrontes el splitting directamente: habla siempre desde la complejidad y los matices.' },

    { id: 't20', category: 'Defensa Táctica', name: 'Información Mínima Viable (Info Control)', severity: 'Escudo', icon: 'fa-filter',
      howItWorks: 'Táctica defensiva de compartir solo la información estrictamente necesaria con personas de confianza cuestionable o en situaciones de alto riesgo.',
      redFlags: ['Personas que siempre buscan detalles de tu vida privada', 'Información que siempre "termina" en manos incorrectas', 'Preguntas demasiado específicas sobre tus planes futuros'],
      counterScript: 'Todo bien. Las cosas van su curso. [No ampliar. No explicar. No justificar].',
      deepMechanics: 'La información es poder. Cada dato sobre tus vulnerabilidades, planes o relaciones puede ser usado como vector de ataque. El silencio es protección, no descortesía.' }
  ],

  caseScenarios: [
    {
      id: 'case-1', category: 'Laboral', title: 'La Promoción Secuestrada', difficulty: 'Alta', badge: 'LABORAL',
      scenarioDescription: 'Tu jefe prometió ascenderte si completabas un mega-proyecto. Lo hiciste. Hoy anuncia que el presupuesto fue "congelado", pero si lideras el SIGUIENTE proyecto gratis, te garantiza el puesto. Delante de todos te dice: "Sé que cuento con tu lealtad, eres nuestro mejor soldado".',
      options: [
        { id: 'opt-A', text: 'Confrontarlo públicamente, llamarlo mentiroso y amenazar con renunciar.', outcome: 'Autodestrucción Profesional', wisdomScore: 5, analysis: 'Perdiste el Sistema 2. Él justificó su decisión ante los demás y tú quedas como el inestable.', bookInsight: 'El maquiavélico espera que te autodestruyas en público. Es parte del plan.' },
        { id: 'opt-B', text: 'Aceptar callado para no perder el trabajo.', outcome: 'Sumisión Validada', wisdomScore: 0, analysis: 'Refuerzas su táctica de falso futuro. Serás explotado indefinidamente sin ascenso real.', bookInsight: 'Premiar el Future Faking garantiza su repetición (Refuerzo Intermitente).' },
        { id: 'opt-C', text: 'Agradecer neutralmente en público. En privado, pedir compromisos escritos con fecha y reducir horas extra al mínimo contractual.', outcome: 'Contra-Táctica Activa', wisdomScore: 100, analysis: 'No le das supply público. En privado, recuperas tu poder cortando la entrega no remunerada y documentando.', bookInsight: 'Future Faking se neutraliza con: ¿qué paso concreto ocurre HOY? + documentación.' }
      ]
    },
    {
      id: 'case-2', category: 'Relaciones', title: 'El Ataque DARVO en Pareja', difficulty: 'Crítica', badge: 'PAREJA',
      scenarioDescription: 'Descubres mensajes comprometedores de tu pareja. Al confrontarlo, explota: "¡Eres un psicópata controlador por revisar mi teléfono! ¡Por tu inseguridad yo no puedo respirar!" Termina llorando y diciendo que él es quien sufre.',
      options: [
        { id: 'opt-A', text: 'Disculparte por revisar el teléfono y consolarlo.', outcome: 'Inversión Total de Roles', wisdomScore: 0, analysis: 'Caíste en DARVO completamente. Ahora tú eres el acusado y él la víctima.', bookInsight: 'DARVO transforma al perpetrador en víctima en segundos. Tu disculpa lo valida.' },
        { id: 'opt-B', text: 'Gritar más fuerte para probar que tú también puedes ser intenso.', outcome: 'Escalada Emocional', wisdomScore: 20, analysis: 'Validas su argumento de que estás "inestable". Ambos pierden el hilo.', bookInsight: 'El contagio emocional elimina el córtex prefrontal de ambos.' },
        { id: 'opt-C', text: 'Roca Gris: "No debatimos el teléfono. Debatimos los mensajes. Hablaré cuando estés calmado." Retirarse.', outcome: 'Neutralización DARVO', wisdomScore: 100, analysis: 'Disco rayado + desapego emocional. Rehusar el cebo desmantela la defensa.', bookInsight: 'El ancla en la realidad rompe el trance DARVO. El silencio y la claridad son devastadores para esta táctica.' }
      ]
    },
    {
      id: 'case-3', category: 'Negociación', title: 'El Ancla de Apertura', difficulty: 'Media', badge: 'NEGOCIOS',
      scenarioDescription: 'Vendes un servicio valorado en $5,000. El comprador abre con "máximo tenemos $1,200 para esto". Hay 3 personas en la sala mirándote.',
      options: [
        { id: 'opt-A', text: 'Aceptar $1,200 para no perder el negocio.', outcome: 'Ancla aceptada: pérdida de $3,800', wisdomScore: 0, analysis: 'El ancla funcionó perfectamente. Negociaste desde su marco, no el tuyo.', bookInsight: 'El primer número ancla toda la conversación. Aceptarlo define el techo del negociador.' },
        { id: 'opt-B', text: 'Mostrar sorpresa genuina: "Esa cifra está significativamente por debajo del mercado". Presentar datos y lanzar tu ancla: $6,500.', outcome: 'Counter-Anchor efectivo', wisdomScore: 100, analysis: 'El shock interrumpe el ancla. Tu contra-ancla más alta da margen para llegar al valor real.', bookInsight: 'Siempre contra-anclá con un número más extremo respaldado con datos. El rango de negociación lo determina quien ancla primero y más alto.' },
        { id: 'opt-C', text: 'Decir que necesitas consultar con tu equipo y terminar la reunión.', outcome: 'Oportunidad perdida', wisdomScore: 40, analysis: 'Evitaste el ancla pero perdiste el momentum de la negociación.', bookInsight: 'Salir sin contra-anclar permite que la cifra de $1,200 se consolide como "tu posición".' }
      ]
    },
    {
      id: 'case-4', category: 'Social', title: 'El Mono Volador Familiar', difficulty: 'Alta', badge: 'FAMILIA',
      scenarioDescription: 'Llevas 45 días de contacto cero con tu ex narcisista. Tu madre te llama: "Él me llamó llorando. Dice que está en tratamiento y que cambió. ¿No crees que merece otra oportunidad? Pienso que estás siendo muy dura".',
      options: [
        { id: 'opt-A', text: 'Explicarle a tu madre todo el abuso con detalle para que entienda por qué no puedes volver.', outcome: 'Canal de información abierto', wisdomScore: 10, analysis: 'Todo lo que cuentes a tu madre puede llegar al narcisista. Abriste el canal de inteligencia.', bookInsight: 'Los Flying Monkeys son inconscientes. Tu madre no es el enemigo, pero es el vector.' },
        { id: 'opt-B', text: 'Responder: "Mamá, te quiero. Esta decisión ya está tomada y no está a debate. Cambiemos de tema"', outcome: 'Límite con amor', wisdomScore: 100, analysis: 'Límite claro, afecto mantenido, sin información entregada. El canal queda cerrado.', bookInsight: 'Los límites con personas amadas usan: Validación + Posición firme + Redirección. Sin debate, sin datos.' },
        { id: 'opt-C', text: 'Ponerse a llorar y ceder, llamarlo esa noche.', outcome: 'Hoovering exitoso', wisdomScore: 0, analysis: 'El narcisista usó a tu madre para hacer el trabajo. El Hoovering funcionó.', bookInsight: 'Usar terceros amados (familia, amigos) para romper el Contacto Cero es la táctica de Hoovering más efectiva.' }
      ]
    },
    {
      id: 'case-5', category: 'Laboral', title: 'El Compañero Proyector', difficulty: 'Media', badge: 'TRABAJO',
      scenarioDescription: 'Sin ninguna razón, un compañero empieza a decirle al equipo que tú "te atribuyes méritos ajenos". En los últimos 3 proyectos, ha sido él quien tomó crédito de tu trabajo en reuniones con jefatura.',
      options: [
        { id: 'opt-A', text: 'Confrontarlo públicamente en la siguiente reunión del equipo.', outcome: 'Guerra abierta', wisdomScore: 20, analysis: 'Escalas sin evidencia suficiente. Arriesgas parecer el conflictivo.', bookInsight: 'La confrontación pública sin evidencia da ventaja al agresor.' },
        { id: 'opt-B', text: 'Ignorarlo para evitar drama y esperar que pase.', outcome: 'Narrativa instalada', wisdomScore: 10, analysis: 'La narrativa de que eres quien se atribuye méritos se instala sin resistencia.', bookInsight: 'El silencio ante Proyección es consentimiento implícito de la narrativa.' },
        { id: 'opt-C', text: 'Documentar contribuciones en correos con fecha. Informar a jefatura proactivamente con evidencia. Ante la acusación: "Qué interesante. Revisemos el historial de correos de cada proyecto."', outcome: 'Proyección neutralizada con datos', wisdomScore: 100, analysis: 'La evidencia convierte su acusación (Proyección) en evidencia contra él.', bookInsight: 'Proyección + documentación = su acusación se convierte en confesión auditable.' }
      ]
    },
    {
      id: 'case-6', category: 'Social', title: 'La Urgencia del Vendedor', difficulty: 'Baja', badge: 'CONSUMIDOR',
      scenarioDescription: 'En una tienda, el vendedor te dice: "Este precio solo es válido hoy. Ya vendí 3 igual esta mañana y solo queda 1. Si te vas, no puedo garantizarlo".',
      options: [
        { id: 'opt-A', text: 'Comprar inmediatamente para no perder la oportunidad.', outcome: 'FOMO activado con éxito', wisdomScore: 0, analysis: 'Las 3 tácticas (urgencia, escasez, presión social) funcionaron perfectamente. Sistema 1 explotado.', bookInsight: 'Urgencia + Escasez + Prueba Social = triple activación del Sistema 1. Desactívalas nombrandolas.' },
        { id: 'opt-B', text: 'Salir de la tienda, buscar el mismo producto online, volver mañana.', outcome: 'Sistema 2 activado', wisdomScore: 100, analysis: 'Rompiste la urgencia. El precio "solo por hoy" probablemente seguirá mañana.', bookInsight: 'La regla: si hay prisa artificial, hay manipulación. El tiempo es siempre tu arma.' },
        { id: 'opt-C', text: 'Pedir hablar con el gerente para negociar un descuento adicional.', outcome: 'Parcialmente correcto', wisdomScore: 60, analysis: 'Buen instinto de negociar, pero no saliste de la escasez artificial. El gerente validará la urgencia.', bookInsight: 'Negociar dentro del marco del FOMO sigue siendo jugar su juego.' }
      ]
    },
    {
      id: 'case-7', category: 'Personal', title: 'El Gaslighter Familiar', difficulty: 'Crítica', badge: 'FAMILIA',
      scenarioDescription: 'Tu padre lleva años negando promesas que hizo. Hoy niegas frente a tus hermanos: "Yo nunca prometí pagar tu universidad. Siempre fuiste muy dramático y exagerado con todo". Tienes el mensaje de texto donde lo prometió hace 3 años.',
      options: [
        { id: 'opt-A', text: 'Explotar emocionalmente y acusarlo de mentiroso delante de toda la familia.', outcome: 'Confirma el relato de que eres el "dramático"', wisdomScore: 5, analysis: 'Tu reacción emocional valida exactamente la narrativa que él está instalando.', bookInsight: 'El Gaslighter espera tu explosión emocional para decir: "¿Ves? Siempre exageras".' },
        { id: 'opt-B', text: 'Callar y ceder para mantener la paz familiar.', outcome: 'Gaslighting validado', wisdomScore: 0, analysis: 'La narrativa de que eres "dramático y mentiroso" se instala sin resistencia.', bookInsight: 'El silencio ante Gaslighting es aceptar una realidad falsa públicamente.' },
        { id: 'opt-C', text: 'Con calma: "Entiendo que tu recuerdo es diferente. Yo confío en el mío. Tengo el mensaje del 14 de marzo de 2022 si quieres revisarlo." Mostrarlo sin emoción.', outcome: 'Realidad anclada con evidencia', wisdomScore: 100, analysis: 'Validación sin debate + evidencia fría. No atacas su percepción, presentas datos.', bookInsight: 'Contra el Gaslighting: documentación + tono neutro + "entiendo que lo ves diferente" = invulnerable.' }
      ]
    },
    {
      id: 'case-8', category: 'Negociación', title: 'El Pie en la Puerta Empresarial', difficulty: 'Media', badge: 'NEGOCIOS',
      scenarioDescription: 'Un cliente te pide "solo revisar un documento rápido, sin costo, es un favor". Lo haces. La siguiente semana pide "otro pequeño favor". Ahora lleva 5 "pequeños favores" y pide que lideres un proyecto completo "como siempre lo has hecho gratis".',
      options: [
        { id: 'opt-A', text: 'Explicarle que ahora sí necesitas cobrar y disculparte por no haberlo dicho antes.', outcome: 'Posición débil', wisdomScore: 40, analysis: 'Te disculpas por cobrar algo que siempre debió ser cobrado. Validas que los favores eran obligatorios.', bookInsight: 'Nunca te disculpes por cobrar el valor de tu trabajo.' },
        { id: 'opt-B', text: 'Aceptar el proyecto también gratis para mantener la relación.', outcome: 'Escalada Pie en la Puerta completada', wisdomScore: 0, analysis: 'El patrón de escalar solicitudes gratuitas indefinidamente está ahora completamente instalado.', bookInsight: 'Cada "sí" gratuito establece un precedente que el cliente usa como argumento futuro.' },
        { id: 'opt-C', text: '"Me alegra que hayas valorado mi ayuda. Para proyectos como este, mi tarifa es [X]. Cada solicitud la evalúo independientemente. ¿Procedemos?"', outcome: 'Límite profesional claro', wisdomScore: 100, analysis: 'Rompes el precedente explícitamente, sin disculpas, con propuesta de valor.', bookInsight: 'La frase "cada solicitud la evalúo independientemente" cancela cualquier precedente acumulado.' }
      ]
    }
  ],

  bodyLanguageLab: [
    { id: 'bl1', category: 'DETECCIÓN', title: 'Microexpresión: Desprecio', cue: 'Elevación unilateral de la comisura labial. Solo en un lado del rostro.', interpretation: 'Superioridad moral. El mayor predictor de fracaso relacional según Gottman.', practicalDrill: 'Practica identificándola en entrevistas de TV con el volumen apagado. Si ves media sonrisa durante una disculpa, la disculpa es falsa.', accuracyNote: 'Fiabilidad: 98% según FACS. La única microexpresión unilateral.' },
    { id: 'bl2', category: 'PACIFICADORES', title: 'Autotoque del Cuello (Nervio Vago)', cue: 'Acariciarse el cuello, ajustarse el cuello de la camisa o tragar saliva repetidamente.', interpretation: 'Estrés agudo. El cerebro intenta bajar artificialmente la frecuencia cardíaca.', practicalDrill: 'Haz una pregunta inesperadamente difícil. Observa si aparece el gesto en los siguientes 3 segundos.', accuracyNote: 'Indica ESTRÉS, no mentira necesariamente. Contexto + cluster son clave.' },
    { id: 'bl3', category: 'DETECCIÓN', title: 'Movimientos Oculares VAK (PNL)', cue: 'Arriba-derecha (diestros): construcción visual. Arriba-izquierda: recuerdo visual. Abajo-derecha: diálogo interno.', interpretation: 'Diferencia entre recordar (verdad) y construir (posible invención) imágenes mentales.', practicalDrill: 'Pide que describan su habitación de infancia (recuerdo). Luego pide que imaginen cómo sería con muebles nuevos (construcción). Observa la diferencia.', accuracyNote: 'Útil como indicador de carga cognitiva. No absoluto en diagnóstico.' },
    { id: 'bl4', category: 'LENGUAJE CORPORAL', title: 'Dirección de los Pies', cue: 'Pies apuntando hacia la puerta, hacia ti o perpendiculares a la conversación.', interpretation: 'Pies = intención real del cerebro. El torso puede mentir, los pies rara vez.', practicalDrill: 'En tu próxima reunión, ignora completamente las caras y solo mira los pies. Nota cuándo cambia la dirección.', accuracyNote: 'Más fiable que la expresión facial para determinar deseo de retirarse o interés genuino.' },
    { id: 'bl5', category: 'MICROEXPRESIONES', title: 'Microexpresión: Miedo', cue: 'Cejas elevadas y juntas, ojos abiertos, comisuras de la boca tensas hacia atrás y abajo.', interpretation: 'Alerta de peligro. Si aparece sin estímulo amenazante visible, el sujeto anticipa consecuencias.', practicalDrill: 'Observa la cara de alguien mientras firman algo importante. Miedo leve es normal. Miedo intenso: revalúa el contexto.', accuracyNote: 'No confundir con Sorpresa: el Miedo tiene cejas juntas y abajo; la Sorpresa, separadas.' },
    { id: 'bl6', category: 'MICROEXPRESIONES', title: 'Microexpresión: Asco', cue: 'Arruga en el puente de la nariz, labio superior levantado, ojos ligeramente entrecerrados.', interpretation: 'Rechazo visceral a una idea, persona o situación. Más profundo que desacuerdo intelectual.', practicalDrill: 'Presenta una propuesta y observa el primer medio segundo de reacción facial antes de que el filtro social active la respuesta verbal.', accuracyNote: 'La cara de "asco" ante una propuesta de negocios significa rechazo emocional, no solo lógico.' },
    { id: 'bl7', category: 'PROXÉMICA', title: 'Invasión del Espacio Personal (Dominancia)', cue: 'Acercarse deliberadamente más allá de la zona social (1.2m) sin permiso implícito.', interpretation: 'Demostración de dominancia o prueba de límites. Táctica de intimidación de alta presión.', practicalDrill: 'Cuando alguien invada tu espacio, da un paso lateral (no hacia atrás). Esto establece tu espacio sin ceder terreno.', accuracyNote: 'Retroceder = señal de sumisión. Lateral = reafirmación neutral del espacio propio.' },
    { id: 'bl8', category: 'DETECCIÓN', title: 'Asimetría Facial', cue: 'Una expresión genuina se activa simétricamente. Una expresión fabricada tiende a ser asimétrica.', interpretation: 'Sonrisa auténtica (Duchenne): simétrica, llega a los ojos. Sonrisa social: asimétrica, solo labios.', practicalDrill: 'Fotografíate cuando estás genuinamente feliz vs. cuando poses. Compara la simetría de ambas. Calibra qué diferencia ves en otros.', accuracyNote: 'La sonrisa de Duchenne activa el músculo orbicular del ojo. No puede activarse voluntariamente.' },
    { id: 'bl9', category: 'PACIFICADORES', title: 'Fricción de Manos', cue: 'Frotar las manos entre sí vigorosamente o frotarse los muslos con las palmas.', interpretation: 'Autoconsuelo intenso. Estrés moderado-alto buscando estabilización.', practicalDrill: 'Observa a alguien antes de una presentación importante. Frecuencia de frotamiento de manos = termómetro de ansiedad.', accuracyNote: 'Distinto de "frotarse las manos" con entusiasmo (palmas abiertas rápidas = anticipación positiva).' },
    { id: 'bl10', category: 'LENGUAJE CORPORAL', title: 'Postura de Cierre (Barrera de Brazos)', cue: 'Brazos cruzados sobre el pecho, especialmente cuando aparece durante la conversación.', interpretation: 'Barrera psicológica. Puede ser defensividad, desacuerdo no expresado o incomodidad.', practicalDrill: 'Nota cuándo exactamente aparecen los brazos cruzados. ¿Qué acabas de decir? Ahí está el punto de resistencia real.', accuracyNote: 'El momento de aparición es más informativo que la postura en sí. Siempre busca el disparador.' },
    { id: 'bl11', category: 'DETECCIÓN', title: 'Mentira por Omisión (Carga Cognitiva)', cue: 'Respuestas con exceso de detalles irrelevantes, pausas largas antes de respuestas simples, o respuestas que evitan confirmar o negar directamente.', interpretation: 'Alta carga cognitiva: el cerebro construye una narrativa alternativa consumiendo más recursos.', practicalDrill: 'Haz preguntas que requieran sí/no. Si obtiens un párrafo lleno de detalles, la persona está gestionando una respuesta, no recordando.', accuracyNote: 'Las personas honestas responden con brevedad a preguntas simples. La elaboración excesiva sin preguntas de seguimiento es un indicador.' },
    { id: 'bl12', category: 'PROXÉMICA', title: 'Sincronía Postural Inconsciente', cue: 'Dos personas en rapport profundo sincronizan postura, gestos y ritmo de movimiento.', interpretation: 'La sincronía postural involuntaria indica alineación emocional genuina.', practicalDrill: 'En una reunión, adopta sutilmente la postura del otro. Si en 2 minutos te imita sin darse cuenta, el rapport está establecido.', accuracyNote: 'Puedes verificar el rapport: cambia tu postura intencionalmente y observa si la persona te sigue.' },
    { id: 'bl13', category: 'MICROEXPRESIONES', title: 'Flash de Satisfacción Mal Disimulado', cue: 'Microsonrisa que aparece brevemente durante el relato de una desgracia ajena o propia (si es fabricada).', interpretation: 'Satisfacción real ante el sufrimiento ajeno (schadenfreude) o actuación de tristeza detectada.', practicalDrill: 'Cuando alguien te cuente una "tragedia" que te afecta a ti, observa su rostro durante el relato. Un flash de satisfacción en el primer segundo es revelador.', accuracyNote: 'Requiere entrenamiento para distinguir del nerviosismo. Busca el contexto: ¿por qué sentiría satisfacción aquí?' },
    { id: 'bl14', category: 'LENGUAJE CORPORAL', title: 'Ventilación (Collar Tirante)', cue: 'Tirar del cuello de la camisa, soplarse el cuello, sacudir la cabeza de un lado a otro.', interpretation: 'El cuerpo intenta liberar calor generado por el estrés de la mentira o la ansiedad intensa.', practicalDrill: 'Observa a interlocutores en el momento exacto en que presentas evidencia contraria a lo que dicen. ¿Ven el cuello de la camisa?', accuracyNote: 'Especialmente útil en ambientes climatizados. Si no hace calor y se ventilan, el calor es interno (estrés).' },
    { id: 'bl15', category: 'DETECCIÓN', title: 'Respuesta Pupilar Involuntaria', cue: 'Dilatación pupilar (mayor oscuridad del iris) o contracción brusca.', interpretation: 'Dilatación: interés genuino, excitación positiva o alta carga cognitiva. Contracción: aversión o dolor.', practicalDrill: 'Observa las pupilas de tu interlocutor bajo luz constante mientras cambias los temas. Qué topic las dilata y cuál las contrae es el mapa de sus intereses reales.', accuracyNote: 'Involuntario e incontrolable. Requiere buena iluminación y línea visual directa.' }
  ],

  flashcards: [
    { id: 'f1', bookNumber: 1, category: 'Sesgos', front: '¿Qué es el Heurístico de Disponibilidad?', back: 'Creer que si algo se recuerda fácilmente (repetido en noticias o conversaciones), es más común o cierto.', mnemonic: 'Disponibilidad = Repetición = Verdad Falsa' },
    { id: 'f2', bookNumber: 3, category: 'Defensa', front: 'Describe el ciclo completo del Abuso Narcisista (IDE)', back: '1. Idealización (Love Bombing) → 2. Devaluación (crítica sutil) → 3. Descarte. El ciclo puede reiniciarse.', mnemonic: 'IDE: Idealiza, Devalúa, Elimina' },
    { id: 'f3', bookNumber: 4, category: 'PNL', front: 'Diferencia entre ancla kinestésica y visual', back: 'Kinestésica: estímulo de tacto en el pico emocional. Visual: gesto o posición espacial en el pico. Ambas requieren el clímax emocional.', mnemonic: 'K=Tacto, V=Gesto, ambas en el PICO' },
    { id: 'f4', bookNumber: 6, category: 'Defensa', front: '¿Qué significa DARVO?', back: 'Deny (Negar), Attack (Atacar), Reverse Victim and Offender (Invertir quién es víctima y agresor).', mnemonic: 'Niega → Ataca → Voltea los roles' },
    { id: 'f5', bookNumber: 2, category: 'Perfilado', front: '¿Qué es el Efecto Tortuga?', back: 'Congelamiento motor: hombros que suben, cuello que se "esconde", como respuesta de supervivencia primaria al estrés o mentira.', mnemonic: 'Tortuga = Esconde cuello = Verdad oculta' },
    { id: 'f6', bookNumber: 5, category: 'TCC', front: 'Regla principal del Thought Stopping (TCC)', back: 'Usar un estímulo físico abrupto (ALTO en voz alta, aplauso, ligar de goma) para romper el ciclo neuronal de rumiación obsesiva.', mnemonic: 'Shock Físico = Interrumpir Bucle Neural' },
    { id: 'f7', bookNumber: 3, category: 'Abuso Narcisista', front: '¿Qué es un Mono Volador (Flying Monkey)?', back: 'Persona reclutada consciente o inconscientemente por el narcisista para espiarte, presionarte o hacer su trabajo sucio.', mnemonic: 'Mago de Oz → Peones del narcisista' },
    { id: 'f8', bookNumber: 4, category: 'PNL', front: '¿Qué es el Rapport Kinestésico?', back: 'Sincronizar ritmo respiratorio y posturas corporales con un retraso de 3-5 segundos para activar neuronas espejo y generar confianza.', mnemonic: 'Espejo Retardado = Confianza Profunda' },
    { id: 'f9', bookNumber: 1, category: 'Influencia', front: 'Explica la Reciprocidad Asimétrica (Cialdini)', back: 'Dar un favor pequeño ($2) genera una obligación social percibida enormemente mayor ($100). Explotada deliberadamente para extraer favores.', mnemonic: 'Café Gratis = Deuda de Turno de 8 horas' },
    { id: 'f10', bookNumber: 4, category: 'PNL', front: '¿Qué es el Reencuadre (Reframing) en PNL?', back: 'Cambiar el significado emocional de un evento alterando el marco contextual sin cambiar los hechos objetivos.', mnemonic: 'Cambia el Marco = Cambia el Significado' },
    { id: 'f11', bookNumber: 2, category: 'No Verbal', front: 'Importancia de la Proxémica de los pies', back: 'Los pies apuntan hacia donde el cerebro realmente quiere ir: interés (hacia ti) o escape (hacia la puerta). Son la parte más honesta del cuerpo.', mnemonic: 'Pies = Brújula de Intención Real' },
    { id: 'f12', bookNumber: 3, category: 'Manipulación', front: '¿Qué busca la técnica de Triangulación?', back: 'Crear competencia artificial mediante un tercero real o imaginario para generar celos, inseguridad y control sobre la víctima.', mnemonic: 'Divide = Compara = Controla' },
    { id: 'f13', bookNumber: 1, category: 'Cognición', front: '¿Qué es la Disonancia Cognitiva? (Festinger 1957)', back: 'Malestar psicológico al sostener simultáneamente dos ideas contradictorias. El cerebro lo resuelve cambiando la creencia más débil, ignorando una o racionalizando.', mnemonic: 'Choque de Creencias = Autoengaño para resolverlo' },
    { id: 'f14', bookNumber: 5, category: 'TCC', front: 'Método de Reatribución Matemática de la Culpa', back: 'Dibujar un gráfico circular y distribuir el porcentaje de responsabilidad real a TODAS las partes. Las víctimas de abuso suelen cargarse el 100% cuando les corresponde el 10-20%.', mnemonic: 'Tarta de Culpa = Lógica vs. Emoción' },
    { id: 'f15', bookNumber: 4, category: 'Hipnosis', front: '¿Qué es un Patrón de Lenguaje Milton?', back: 'Uso de lenguaje ambiguo y presuposiciones para sobrecargar el hemisferio analítico y que las sugestiones pasen directamente al subconsciente.', mnemonic: 'Ambigüedad = Hackeo del Filtro Crítico' },
    { id: 'f16', bookNumber: 6, category: 'Recuperación', front: '¿Por qué se necesitan 90 días de Contacto Cero?', back: 'El Trauma Bond es una adicción neuroquímica (dopamina). Los receptores dopaminérgicos necesitan 90 días de abstinencia para regularse y restaurar la autonomía emocional.', mnemonic: '90 Días = Detox Dopaminérgico' },
    { id: 'f17', bookNumber: 2, category: 'Lectura', front: '¿Qué revela la dilatación pupilar involuntaria?', back: 'Dilatación: interés genuino, excitación positiva o alta carga cognitiva. Contracción brusca: aversión o dolor. Es involuntaria e incontrolable.', mnemonic: 'Pupila Dilatada = Interés Real Incontrolable' },
    { id: 'f18', bookNumber: 3, category: 'Tríada Oscura', front: 'Diferencia clave entre Psicópata y Maquiavélico', back: 'Psicópata: impulsivo, carece de miedo y empatía estructural. Maquiavélico: planificador a largo plazo, calculador, puede simular empatía como herramienta.', mnemonic: 'Psicópata=Caos Impulsivo, Maquiavélico=Ajedrez a 20 movimientos' },
    { id: 'f19', bookNumber: 1, category: 'Cognición', front: 'Define el Sesgo de Confirmación', back: 'Tendencia a buscar, interpretar y recordar información que confirma las creencias previas, ignorando evidencia contraria.', mnemonic: 'Buscas lo que ya crees = Confirmas lo que ya sabes' },
    { id: 'f20', bookNumber: 2, category: 'No Verbal', front: '¿Qué es la Regla del Cluster?', back: 'Un solo gesto desviado de la línea base es ruido. Se necesitan 3 o más gestos desviados simultáneamente para considerar la señal tácticamente válida.', mnemonic: 'Cluster de 3 = Señal Real de Estrés' },
    { id: 'f21', bookNumber: 3, category: 'Defensa', front: '¿Qué es el Future Faking?', back: 'Promesas elaboradas de un futuro brillante que nunca ocurrirá, usadas para extraer tiempo, dinero o esfuerzo en el presente. Se detecta preguntando: ¿qué paso concreto pasa HOY?', mnemonic: 'Futuro Brillante + Nada Hoy = Trampa' },
    { id: 'f22', bookNumber: 5, category: 'TCC', front: 'Las 3 distorsiones más comunes según Aaron Beck', back: '1. Catastrofización (todo o nada). 2. Personalización (asumir culpa total). 3. Lectura mental (suponer intenciones ajenas).', mnemonic: 'Catástrofe + Culpa + Mente Leída = Tríada Tóxica' },
    { id: 'f23', bookNumber: 4, category: 'PNL', front: '¿Cuándo es válido un ancla emocional?', back: 'Solo cuando se instala en el PICO exacto del clímax emocional (1-3 segundos antes), con un estímulo único y no ambiguo, repetido 3-5 veces.', mnemonic: 'Pico + Estímulo Único + 3 Repeticiones = Ancla' },
    { id: 'f24', bookNumber: 6, category: 'Abuso Narcisista', front: '¿Qué es el Hoovering?', back: 'Táctica post-descarte en la que el narcisista reaparece con promesas de cambio para "aspirar" a la víctima de vuelta a la relación. Explota el Trauma Bond.', mnemonic: 'Aspiradora Emocional: Promesas Vacías Post-Descarte' },
    { id: 'f25', bookNumber: 1, category: 'Negociación', front: '¿Cómo funciona el Sesgo de Anclaje en negociaciones?', back: 'El primer número presentado ancla toda la negociación posterior. Quién ancla primero (y más alto) controla el rango. La contra-táctica: mostrar shock y lanzar tu propio ancla.', mnemonic: 'Primer Número = Gravedad de la Negociación' },
    { id: 'f26', bookNumber: 2, category: 'No Verbal', front: 'La Sonrisa de Duchenne: ¿qué la diferencia?', back: 'La sonrisa genuina activa el músculo orbicular del ojo (patas de gallo) involuntariamente. No puede activarse de forma voluntaria. Sin patas de gallo = sonrisa social fabricada.', mnemonic: 'Patas de Gallo = Alegría Real Incontrolable' },
    { id: 'f27', bookNumber: 3, category: 'Defensa', front: '¿Qué es el Refuerzo Intermitente?', back: 'Recompensas impredecibles e inconsistentes que crean adicción conductual más potente que las recompensas consistentes. Base neurológica del Trauma Bond.', mnemonic: 'Ruleta Emocional = Adicción más Fuerte que Droga' },
    { id: 'f28', bookNumber: 6, category: 'Recuperación', front: '¿Qué es un Límite Rígido (autoejecutable)?', back: 'Declaración de lo que TÚ harás si se cruza una línea, sin depender del comportamiento del otro. Ejemplo: "Mi teléfono estará apagado después de las 10 PM" (no "deja de llamarme tarde").', mnemonic: 'YO haré X si Y pasa = Límite Real' },
    { id: 'f29', bookNumber: 4, category: 'Persuasión', front: 'El principio de Escasez en persuasión (Cialdini)', back: 'Las personas valoran más lo que perciben como escaso o a punto de perderse. La escasez real es legítima; la escasez artificial es manipulación FOMO.', mnemonic: 'Escasez Real = Valor. Escasez Artificial = FOMO Fabricado' },
    { id: 'f30', bookNumber: 5, category: 'TCC', front: 'La Desensibilización Sistemática: ¿por qué funciona?', back: 'El miedo evitativo refuerza la fobia (condicionamiento operante). La exposición gradual y repetida crea nuevas vías neuronales de tolerancia, reduciendo la respuesta de alarma.', mnemonic: 'Exposición Progresiva = Cerebro Aprende que No Hay Amenaza' }
  ],

  quizzes: [
    { id: 'q1', bookNumber: 2, question: '¿Cuál es el error más común al intentar detectar mentiras?', options: ['Mirar a los ojos fijamente', 'No establecer una línea base conductual primero', 'Analizar microexpresiones demasiado pronto', 'Escuchar el tono de voz antes que las palabras'], correctIndex: 1, explanation: 'Sin línea base, confundes tics naturales y nerviosismo normal con señales de engaño. La línea base es el mapa del comportamiento honesto.' },
    { id: 'q2', bookNumber: 3, question: 'Ante un ataque de Gaslighting, la peor reacción es:', options: ['Documentar lo ocurrido con fecha y detalle', 'Aplicar Roca Gris emocionalmente', 'Intentar convencerlos de la realidad lógicamente', 'Alejarte de la situación sin explicaciones'], correctIndex: 2, explanation: 'El Gaslighting busca drenar tu energía en debates de realidad. Cada argumento lógico que das alimenta el ciclo. La documentación silenciosa es el escudo.' },
    { id: 'q3', bookNumber: 1, question: '"Solo quedan 2 unidades, oferta termina en 5 minutos." ¿Qué sistema ataca esta frase?', options: ['Sistema 2 (Córtex Analítico)', 'Sistema 1 (Amígdala / Urgencia)', 'Memoria declarativa a largo plazo', 'Área de Broca (lenguaje)'], correctIndex: 1, explanation: 'La urgencia artificial desactiva el Sistema 2 (análisis lógico) disparando la amígdala. Tu defensa: "Si no hay tiempo para pensar, no hay trato".' },
    { id: 'q4', bookNumber: 4, question: 'Si tu cliente dice "No VEO clara esta propuesta", la respuesta correcta es:', options: ['"Vamos a hablarlo con más detalle"', '"Siento que tienes dudas válidas"', '"Déjame MOSTRARTE un esquema que lo hará más CLARO"', '"Es la opción más sólida del mercado"'], correctIndex: 2, explanation: 'El cliente usa canal Visual (ver, claro). La respuesta efectiva refleja el mismo canal: mostrar, claro, brillante. Esto activa resonancia límbica.' },
    { id: 'q5', bookNumber: 6, question: '¿Cuál es el primer paso ante un ataque DARVO?', options: ['Defenderte de la acusación punto por punto', 'Llorar para mostrar que eres la víctima real', 'Volver al tema original (Disco Rayado) sin reaccionar', 'Explicar calmadamente cómo te sientes con eso'], correctIndex: 2, explanation: 'Defenderte de la acusación valida la inversión de roles. El Disco Rayado en el tema original desmonta el DARVO sin darle material nuevo.' },
    { id: 'q6', bookNumber: 5, question: 'El Thought Stopping (Detención del Pensamiento) es más efectivo cuando:', options: ['Lo piensas mentalmente sin acción física', 'Usas un estímulo físico abrupto como aplaudir o decir ALTO en voz alta', 'Lo practicas en sesión de terapia solo', 'Meditas en silencio para reemplazar el pensamiento'], correctIndex: 1, explanation: 'El impacto físico es lo que rompe el bucle neuronal. El pensamiento solo genera más pensamiento. El cuerpo interrumpe el ciclo donde la mente no puede.' },
    { id: 'q7', bookNumber: 3, question: 'Un jefe promete ascenso "cuando el presupuesto mejore" pero siempre hay un nuevo proyecto gratis primero. Táctica:', options: ['Refuerzo Positivo legítimo', 'Gaslighting laboral', 'Future Faking (Falso Futuro)', 'Espejeo (Mirroring)'], correctIndex: 2, explanation: 'Future Faking: promesas brillantes de un futuro que nunca llega para extraer trabajo, dinero o tiempo en el presente. Antídoto: ¿qué paso concreto pasa HOY?' },
    { id: 'q8', bookNumber: 4, question: 'Un ancla emocional (PNL) solo es efectiva si:', options: ['Se instala visualmente con un gesto claro', 'Se instala cuando el sujeto está en calma total', 'Se instala exactamente en el CLÍMAX del pico emocional', 'Se repite 50 veces en sesiones distintas'], correctIndex: 2, explanation: 'Sin el clímax emocional (el pico neuroquímico), no hay condicionamiento. La dopamina en el pico es el "pegamento" que consolida la asociación estímulo-emoción.' },
    { id: 'q9', bookNumber: 2, question: 'La persona sonríe ampliamente pero NO hay arrugas en los ojos (patas de gallo). Conclusión:', options: ['Usa bótox en esa zona', 'Es una sonrisa social fabricada, no genuina (Duchenne)', 'Está excepcionalmente feliz', 'Es una microexpresión de desprecio'], correctIndex: 1, explanation: 'La sonrisa genuina de Duchenne activa involuntariamente el músculo orbicular del ojo. Sin esa contracción no hay alegría genuina, hay performance social.' },
    { id: 'q10', bookNumber: 1, question: '¿Por qué la Reciprocidad Asimétrica (Cialdini) es tan peligrosa?', options: ['Porque somos egoístas por naturaleza', 'Un favor de $2 genera una obligación percibida de $100 o más', 'Porque viola la ley en muchos países', 'Porque hace que parezcamos débiles'], correctIndex: 1, explanation: 'La desproporción es el arma. La obligación social percibida es irracionalmente mayor que el favor recibido. La defensa: desvincular el favor explícitamente al recibirlo.' },
    { id: 'q11', bookNumber: 5, question: '¿Qué es la Reatribución Matemática de la Culpa?', options: ['Calcular el costo económico del abuso recibido', 'Distribuir porcentajes de culpa reales a todos los actores para romper la asunción del 100%', 'Dividir activos en un proceso de divorcio', 'Técnica de negociación salarial en TCC'], correctIndex: 1, explanation: 'Al usar lógica visual (el gráfico), el cerebro activa el hemisferio analítico, disolviendo el secuestro emocional de la culpa internalizada artificialmente.' },
    { id: 'q12', bookNumber: 6, question: 'El Trauma Bond se soluciona principalmente con:', options: ['Terapia de pareja con el narcisista', 'Explicarle al narcisista el daño que causó con calma', 'Venganza calculada para recuperar el poder', '90 días de Contacto Cero para desintoxicación neuroquímica'], correctIndex: 3, explanation: 'Es una adicción neuroquímica real. La terapia de pareja con un perfil oscuro empeora el trauma. La única cura es la abstinencia total de 90 días mínimo.' },
    { id: 'q13', bookNumber: 2, question: 'La dirección de los pies es más informativa que la expresión facial porque:', options: ['Los pies son más visibles que la cara', 'El cerebro evolucionó para priorizar la huida (pies) antes que la diplomacia facial', 'La cara miente más que los pies en perfiles psicópatas', 'Es más fácil observarlos discretamente'], correctIndex: 1, explanation: 'El sistema límbico dirige los pies instintivamente hacia el escape o el interés. La cara puede ser controlada conscientemente. Los pies, rara vez.' }
  ],

  glossary: [
    { term: 'Trastorno de la Personalidad Narcisista (NPD)', category: 'DSM-5', definition: 'Según el DSM-5, un patrón dominante de grandeza (en la fantasía o en el comportamiento), necesidad de admiración y falta de empatía, que comienza en las primeras etapas de la vida adulta.', example: '"Exhibe un sentido grandioso de prepotencia, esperando ser reconocido como superior sin logros proporcionales." (Criterio 1, DSM-5).' },
    { term: 'Trastorno de la Personalidad Antisocial (ASPD)', category: 'DSM-5', definition: 'Patrón dominante de inatención y vulneración de los derechos de los demás, que se produce desde los 15 años de edad. Correlaciona fuertemente con la psicopatía y maquiavelismo de la Tríada Oscura.', example: '"Engaño, que se manifiesta por mentiras repetidas, uso de alias o estafa para provecho o placer personal." (Criterio 2, DSM-5).' },
    { term: 'Control Coercitivo', category: 'Psicología Forense', definition: 'Patrón estratégico de comportamiento diseñado para explotar, controlar, crear dependencia e infundir miedo en la víctima. Un término académico usado en literatura sobre violencia doméstica y sectas.', example: 'El perpetrador aísla a la víctima de sus redes de apoyo (amigos/familia) para monopolizar su percepción de la realidad.' },

    { term: 'DARVO', category: 'Abuso Narcisista', definition: 'Deny, Attack, Reverse Victim and Offender. Táctica para invertir roles y convertir al agresor en víctima.', example: '"Yo nunca te hice nada, tú eres el abusador por acusarme así."' },
    { term: 'Love Bombing', category: 'Tríada Oscura', definition: 'Bombardeo de afecto, atención e idealización extrema en etapas tempranas para crear dependencia emocional artificial rápida.', example: '"Nunca conocí a nadie como tú. Eres lo que siempre busqué." — en la primera semana.' },
    { term: 'Línea Base (Baseline)', category: 'No Verbal', definition: 'Patrón de comportamiento normal de una persona cuando está relajada y habla con verdad. Referencia para detectar desviaciones.', example: 'Si alguien siempre gesticula y de pronto se paraliza, esa parálisis es la señal.' },
    { term: 'Efecto Halo', category: 'Sesgo Cognitivo', definition: 'Asumir cualidades positivas en una persona basándose en un solo rasgo atractivo (apariencia, título, acento, etc.).', example: 'Creerle a un estafador porque lleva un traje caro y habla con confianza.' },
    { term: 'Roca Gris (Grey Rock)', category: 'Defensa Táctica', definition: 'Estrategia de volverse emocionalmente plano e impredecible para privar al manipulador de recompensa emocional y hacerlo perder interés.', example: '"Ok. Entiendo. Mmm. Ya veo." — sin inflexión, sin reactividad.' },
    { term: 'Refuerzo Intermitente', category: 'Abuso Psicológico', definition: 'Recompensas impredecibles que crean adicción conductual más potente que las consistentes. Base del Trauma Bond.', example: 'Un cónyuge que a veces es amable y otras cruel: el cerebro se engancha esperando la próxima recompensa.' },
    { term: 'Sistema 1', category: 'Neurociencia Cognitiva', definition: 'Pensamiento rápido, automático, emocional e heurístico (Kahneman). Vulnerable a manipulación por urgencia y emociones.', example: 'Comprar por impulso cuando el vendedor dice "última unidad".' },
    { term: 'Sistema 2', category: 'Neurociencia Cognitiva', definition: 'Pensamiento lento, deliberado, analítico y lógico (Kahneman). Escudo contra la manipulación. Se activa pidiendo tiempo y datos.', example: '"Necesito 24 horas para revisar los números antes de decidir."' },
    { term: 'Proxémica', category: 'No Verbal', definition: 'Estudio del uso y significado del espacio físico entre personas como comunicación no verbal.', example: 'Invadir el espacio personal (menos de 45cm) sin invitación = táctica de dominancia.' },
    { term: 'Future Faking', category: 'Manipulación', definition: 'Crear promesas de un futuro brillante que nunca materializará para mantener a la víctima aportando recursos en el presente.', example: '"Cuando consiga el proyecto grande, te compenso todo lo que has hecho." (Nunca llega el proyecto.)' },
    { term: 'Disonancia Cognitiva', category: 'Psicología', definition: 'Malestar psicológico generado por sostener simultáneamente dos creencias contradictorias. El cerebro lo resuelve cambiando la creencia más débil.', example: 'Saber que alguien te hace daño pero seguir justificándolo para no perder la relación.' },
    { term: 'Trauma Bond (Vínculo Traumático)', category: 'Abuso Narcisista', definition: 'Adicción neuroquímica creada por el refuerzo intermitente del ciclo abuso-amabilidad. Requiere 90 días de abstinencia para desintoxicarse.', example: 'La necesidad intensa de llamar al ex que abusaba de ti.' },
    { term: 'Microexpresión', category: 'No Verbal', definition: 'Fuga facial involuntaria que dura 1/25 a 1/5 de segundo y revela la emoción real antes de que el filtro social la suprima.', example: 'Flash de desprecio cuando alguien dice "me alegra tu éxito".' },
    { term: 'Gaslighting', category: 'Abuso Psicológico', definition: 'Manipulación sistemática que lleva a la víctima a dudar de su propia memoria, percepción y cordura.', example: '"Eso nunca ocurrió. Lo estás imaginando. Siempre exageras todo."' },
    { term: 'Hoovering', category: 'Abuso Narcisista', definition: 'Táctica post-descarte en que el narcisista reaparece para "aspirar" a la víctima de vuelta, explotando el Trauma Bond.', example: 'Mensaje de texto el día de tu cumpleaños después de 6 meses de silencio: "Te pienso."' },
    { term: 'Triangulación', category: 'Manipulación', definition: 'Introducir a un tercero real o imaginario para generar celos, comparaciones y control sobre la víctima.', example: '"Mi ex nunca me ponía este tipo de objeciones. Era más flexible."' },
    { term: 'Flying Monkeys (Monos Voladores)', category: 'Abuso Narcisista', definition: 'Terceros reclutados consciente o inconscientemente por el narcisista para espiarte, presionarte o transmitir mensajes.', example: 'Tu suegra que llama para decirte "dale otra oportunidad, está muy triste".' },
    { term: 'Sesgo de Anclaje', category: 'Cognitivo / Negociación', definition: 'El primer número presentado en una negociación actúa como ancla, sesgando todos los valores posteriores hacia él.', example: 'Precio inicial de $10,000 en algo que vale $3,000 para que la "rebaja" a $6,000 parezca un regalo.' },
    { term: 'Rapport', category: 'PNL / Comunicación', definition: 'Estado de sincronía y confianza mutua generado por el espejeo de lenguaje, postura y ritmo. Base de toda influencia genuina.', example: 'Un buen médico que adopta sutilmente el tono calmado del paciente para bajar su ansiedad.' },
    { term: 'Anclaje Emocional', category: 'PNL', definition: 'Técnica para asociar un estímulo externo a un estado emocional intenso para activarlo a voluntad. Condicionamiento pavloviano aplicado.', example: 'Un gesto único repetido siempre en el clímax de la risa del equipo, luego usado en crisis para evocar calma.' },
    { term: 'Foot-in-the-Door', category: 'Persuasión', definition: 'Pedir un favor pequeño primero para instalar un precedente de cooperación y luego escalar gradualmente a solicitudes mucho mayores.', example: '"¿Me firmas este formulario rápido?" → eventualmente "¿Lidera este proyecto completo?"' },
    { term: 'Efecto Duchenne', category: 'No Verbal', definition: 'Sonrisa genuina que activa involuntariamente el músculo orbicular del ojo (patas de gallo). No puede fingirse de forma sostenida.', example: 'La diferencia entre la foto de pasaporte (sonrisa social) y una foto de risa espontánea.' },
    { term: 'Proyección Defensiva', category: 'Mecanismo de Defensa', definition: 'Mecanismo freudiano: incapaz de procesar la culpa, el manipulador atribuye sus propios actos a la víctima. Sus acusaciones son confesiones.', example: 'La pareja que te es infiel te acusa repentinamente de coquetear con otros.' },
    { term: 'Carga Cognitiva', category: 'Neurociencia', definition: 'Esfuerzo mental requerido para procesar información. La mentira genera alta carga cognitiva visible en pausas largas, detalles excesivos y rigidez motora.', example: 'Responder un "¿qué hiciste ayer?" con un párrafo detallísimo no solicitado.' },
    { term: 'Splitting', category: 'Psicopatología', definition: 'Pensamiento binario extremo: las personas son perfectas o terribles, sin término medio. Característico del Narcisismo y TLP.', example: '"Eres lo mejor que me pasó." → Días después: "Eres lo peor que me pasó."' },
    { term: 'Silent Treatment', category: 'Abuso Narcisista', definition: 'Silencio deliberado usado como castigo para generar ansiedad e inducir a la víctima a ceder o pedir perdón.', example: 'Dejar de responder mensajes por días sin explicación, hasta que la víctima se disculpe por algo que no hizo.' },
    { term: 'Disco Rayado', category: 'Defensa Táctica', definition: 'Repetir calmadamente la misma posición una y otra vez sin importar cuántos argumentos nuevos presente el interlocutor.', example: '"Entiendo tu punto. Mi posición sigue siendo X." (Repetido cuantas veces sea necesario.)' },
    { term: 'BIFF', category: 'Comunicación Táctica', definition: 'Breve, Informativo, Firme, Amistoso. Metodología para responder a mensajes hostiles sin dar material para escalar.', example: 'Respuesta a email agresivo: "Recibí tu mensaje. Los documentos están en la carpeta acordada. Que tengas un buen día."' },
    { term: 'Sesgo de Confirmación', category: 'Cognitivo', definition: 'Tendencia a buscar, interpretar y recordar información que confirma creencias previas, ignorando activamente la evidencia contraria.', example: 'Investigar solo fuentes que apoyan la opinión política propia.' },
    { term: 'Desensibilización Sistemática', category: 'TCC', definition: 'Técnica de exposición gradual a estímulos ansiógenos para reentrenar el sistema límbico y eliminar fobias o evitación.', example: 'Para miedo a hablar en público: grabar un video solo → amigo → 5 personas → audiencia grande.' },
    { term: 'Reestructuración Cognitiva', category: 'TCC', definition: 'Técnica para identificar pensamientos distorsionados, examinarlos con lógica y reemplazarlos con alternativas más equilibradas.', example: '"Soy un fracaso" → "Esta tarea específica falló. ¿Qué ajusto para la próxima?"' },
    { term: 'Reencuadre (Reframing)', category: 'PNL / TCC', definition: 'Cambiar el significado emocional de un evento alterando el marco contextual sin cambiar los hechos.', example: 'Objeción: "Es muy caro." Reframe: "Precisamente por eso garantiza que no lo compras dos veces."' },
    { term: 'Neuronas Espejo', category: 'Neurociencia', definition: 'Neuronas que se activan tanto al realizar una acción como al observarla en otro. Base neurológica del Rapport, la empatía y el espejeo.', example: 'Bostezar cuando alguien a tu lado bosteza. Sentir el dolor de otro al verlo caer.' },
    { term: 'Aislamiento Progresivo', category: 'Control Mental', definition: 'Táctica para separar a la víctima gradualmente de su red de apoyo (familia, amigos) para aumentar la dependencia del controlador.', example: 'Críticas constantes a tus amigos hasta que dejas de verlos para "evitar conflictos".' },
    { term: 'Validación Estratégica', category: 'Comunicación Táctica', definition: 'Reconocer el estado emocional del interlocutor sin ceder a su demanda. Separa la empatía de la concesión.', example: '"Entiendo que estás frustrado. Nuestra posición en el contrato sigue siendo X."' },
    { term: 'Info Mínima Viable', category: 'Defensa Táctica', definition: 'Estrategia de compartir solo la información estrictamente necesaria con personas de confianza cuestionable para minimizar vectores de ataque.', example: '"Todo bien. Las cosas van su curso." (Sin añadir detalles de planes, emociones o relaciones.)' },
    { term: 'Framing (Encuadre)', category: 'Persuasión', definition: 'Presentar selectivamente la información para que la conclusión lógica disponible sea la que el influenciador quiere.', example: '"¿Prefieres A o B?" cuando C es la opción más conveniente para ti pero no se menciona.' },
    { term: 'Tríada Oscura', category: 'Psicopatología', definition: 'Conjunto de tres rasgos de personalidad: Narcisismo, Maquiavelismo y Psicopatía. Predictores de comportamiento explotador y manipulador.', example: 'Líderes carismáticos que usan a las personas como escalones y las descartan sin culpa.' },
    { term: 'Rapport Kinestésico', category: 'PNL', definition: 'Sincronización de ritmo respiratorio, gestos y postura con el interlocutor, con retraso de 3-5 segundos. Activa neuronas espejo.', example: 'Cruzar las piernas exactamente 4 segundos después de que el cliente lo hace.' },
    { term: 'Catastrofización', category: 'Distorsión Cognitiva', definition: 'Distorsión que convierte un revés o problema en una catástrofe total e irreversible. Una de las 3 distorsiones de Beck.', example: '"Si no consigo este cliente, mi carrera está arruinada para siempre."' },
    { term: 'Personalización', category: 'Distorsión Cognitiva', definition: 'Asumir responsabilidad personal total por eventos externos sobre los que se tiene control parcial o nulo.', example: '"Si mi equipo falló es 100% mi culpa como líder."' },
    { term: 'Efecto Heurístico de Representatividad', category: 'Sesgo Cognitivo', definition: 'Juzgar la probabilidad de algo basándose en cuánto se parece a un estereotipo, ignorando las estadísticas reales.', example: 'Creer que un médico es más competente porque tiene un consultorio lujoso.' },
    { term: 'Hipnosis Conversacional', category: 'PNL', definition: 'Uso de lenguaje ambiguo, ritmo y presuposiciones para inducir un estado receptivo sin inducción formal. Patrones de Erickson/Milton.', example: '"No sé qué tan rápido te darás cuenta de que esta es la decisión correcta."' },
    { term: 'Condicionamiento Clásico', category: 'Psicología Conductual', definition: 'Asociación de un estímulo neutral con una respuesta involuntaria mediante repetición. Base del Anclaje Emocional en PNL.', example: 'Pavlov: campana (estímulo neutro) → comida → saliva. Aplicado: gesto → estado emocional.' },
    { term: 'Locus de Control', category: 'Psicología', definition: 'Percepción de si los eventos de la vida son controlados por uno mismo (interno) o por factores externos. El abuso destruye el locus interno.', example: 'Víctimas de abuso creen que "nada de lo que hagan cambiará el resultado" — locus externo instalado.' },
    { term: 'Sesgo de Disponibilidad', category: 'Cognitivo', definition: 'Creer que algo es más probable o verdadero simplemente porque se recuerda con facilidad, generalmente por exposición mediática.', example: 'Creer que los tiburones son la mayor amenaza mortal por las noticias, ignorando que las caídas de escalera matan más.' },
    { term: 'Canal VAK', category: 'PNL', definition: 'Sistema de representación sensorial primaria: Visual (ver, claro), Auditivo (suena, resuena), Kinestésico (siento, sólido). Clave para el Rapport lingüístico.', example: 'Cliente dice "veo el problema": canal Visual → responder con "déjame mostrarte la solución".' },
    { term: 'Prueba Social', category: 'Persuasión', definition: 'Tendencia a considerar correcto un comportamiento si muchas otras personas lo realizan. Explotada en marketing y manipulación grupal.', example: '"Miles de personas ya compraron esto" como argumento de autoridad por cantidad, no por calidad.' },
    { term: 'Presuposición Lingüística', category: 'PNL / Lingüística', definition: 'Afirmación implícita que debe aceptarse como verdadera para que la oración tenga sentido. Usada para instalar sugestiones sin debate.', example: '"¿Cuándo empezamos?" presupone que ya decidiste empezar.' },
    { term: 'Aversión a la Pérdida', category: 'Economía Conductual', definition: 'Las personas sienten el dolor de perder algo dos veces más fuerte que el placer equivalente de ganarlo. Base de tácticas de escasez y urgencia.', example: 'Un descuento de $100 motiva menos que "pierdes $100 si no actúas hoy".' },
    { term: 'Efecto de Primacía y Recencia', category: 'Memoria', definition: 'Se recuerda mejor lo primero (primacía) y lo último (recencia) de una lista o presentación. Táctica para ubicar los argumentos más fuertes.', example: 'En una presentación de ventas: el argumento más poderoso va primero o último, nunca en el medio.' },
    { term: 'Pensamiento Socrático', category: 'TCC / Filosofía', definition: 'Método de preguntas que guían al interlocutor a descubrir contradicciones en su propio razonamiento sin ataques directos.', example: '"¿Cómo se alinea esta decisión con el objetivo de ahorro que mencionaste hace 10 minutos?"' },
    { term: 'Dilatación Pupilar', category: 'No Verbal', definition: 'Respuesta involuntaria del sistema nervioso autónomo. Dilatación = interés, excitación o carga cognitiva alta. Incontrolable.', example: 'Las pupilas de alguien que observa a una persona que le atrae se dilatan involuntariamente.' },
    { term: 'Síndrome de Abstinencia (Trauma Bond)', category: 'Recuperación', definition: 'Conjunto de síntomas físicos y emocionales (ansiedad, insomnio, anhelo intenso) al cortar el contacto con el narcisista. Confirma la desintoxicación en proceso.', example: 'Ansiedad intensa el Día 30 de Contacto Cero: no significa que debes volver, significa que el proceso funciona.' }
  ]
};
