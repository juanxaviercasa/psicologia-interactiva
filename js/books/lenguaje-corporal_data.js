const LIBROS_DATA = {
  "modules": [],
  "caseScenarios": [
    {
      "id": "cs1",
      "category": "Negociación Estratégica",
      "title": "La Objeción Oculta en el Cierre de la Venta",
      "difficulty": "Alta",
      "badge": "Observador Perceptivo",
      "scenarioDescription": "Estás presentando una propuesta económica a un cliente clave. Al decir el precio final, el cliente responde verbalmente: 'Me parece un costo razonable y dentro del presupuesto'. Sin embargo, inmediatamente se lleva la mano a la fosa yugular (muesca del cuello), cruza los tobillos debajo de la silla y comprime sus labios en una línea delgada.",
      "options": [
        {
          "id": "opt1",
          "text": "Ignorar los gestos y presionar para firmar el acuerdo de inmediato, confiando en su declaración verbal positiva.",
          "outcome": "Fallo",
          "wisdomScore": 20,
          "analysis": "Aceptar las palabras del cliente ignorando la clara incongruencia no verbal (pacificadores y bloqueo) suele llevar a que el trato se caiga más tarde o que surjan objeciones inesperadas en el seguimiento.",
          "bookInsight": "Cuando las palabras y el cuerpo entran en conflicto, el cuerpo casi siempre dice la verdad. Los pacificadores en el cuello indican un alto nivel de estrés o duda retenida."
        },
        {
          "id": "opt2",
          "text": "Hacer una pausa estratégica y decir: 'Quiero asegurarme de que cubramos todos los detalles. ¿Hay algún aspecto del alcance o los plazos que debamos ajustar?'",
          "outcome": "Éxito",
          "wisdomScore": 100,
          "analysis": "Al abordar la incomodidad de forma no confrontativa, permites que el cliente exprese sus reservas reales sin sentirse acorralado, salvando la negociación.",
          "bookInsight": "Detectar pacificación te da la oportunidad de sondear suavemente las objeciones no verbalizadas antes de que se conviertan en un 'no' definitivo."
        }
      ]
    },
    {
      "id": "cs2",
      "category": "Entrevista de Selección",
      "title": "Evaluación de Integridad y Estrés",
      "difficulty": "Alta",
      "badge": "Detector de Incongruencias",
      "scenarioDescription": "Entrevistas a un candidato para un puesto de alta responsabilidad. Al preguntarle sobre las razones por las que dejó su empleo anterior, el candidato mantiene un contacto visual rígido e ininterrumpido sin parpadear, inclina el torso ligeramente hacia atrás y tamborilea de forma rítmica con los dedos sobre el reposabrazos.",
      "options": [
        {
          "id": "opt1",
          "text": "Concluir que el contacto visual directo y continuo es prueba irrefutable de total honestidad y confianza absoluta.",
          "outcome": "Fallo",
          "wisdomScore": 15,
          "analysis": "El contacto visual excesivo y rígido suele ser un comportamiento compensatorio estudiado para parecer honesto, mientras que el distanciamiento del torso y el tamborileo revelan tensión e impaciencia.",
          "bookInsight": "Las personas que intentan engañar a menudo exageran el contacto visual porque creen erróneamente que los mentirosos siempre evitan la mirada."
        },
        {
          "id": "opt2",
          "text": "Profundizar en la respuesta solicitando datos cuantitativos y referencias específicas sobre su salida del trabajo anterior.",
          "outcome": "Éxito",
          "wisdomScore": 95,
          "analysis": "Identificar el patrón de sobrecompensación visual junto a señales de pacificación/distancia te indica la necesidad de verificar la información con preguntas objetivas de seguimiento.",
          "bookInsight": "El análisis corporal debe buscar 'grupos de señales' (clusters). El contacto visual forzado combinado con distanciamiento corporal requiere una verificación rigurosa de los hechos."
        }
      ]
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "term": "Comportamientos Pacificadores",
      "definition": "Respuestas no verbales involuntarias (como tocarse el cuello, frotarse las manos o ajustarse la ropa) que el cerebro utiliza para calmar el estrés o la ansiedad.",
      "tacticalUse": "Observa cuándo ocurren estos gestos para identificar exactamente qué tema o pregunta causó incomodidad en tu interlocutor.",
      "countermeasure": "Si notas que los estás realizando, coloca tus manos firmemente sobre la mesa o entrelaza los dedos en tu regazo para proyectar compostura."
    },
    {
      "id": "fc2",
      "term": "Línea Base (Baseline)",
      "definition": "El repertorio de comportamientos no verbales normales de una persona cuando está relajada y no sometida a presión.",
      "tacticalUse": "Establece la línea base observando a la persona en una conversación casual antes de abordar temas críticos o conflictivos.",
      "countermeasure": "Evita juzgar un gesto de forma aislada; evalúa siempre si se aleja del comportamiento habitual del individuo."
    },
    {
      "id": "fc3",
      "term": "Microexpresiones",
      "definition": "Movimientos faciales involuntarios y ultrarrápidos (duran una fracción de segundo) que exponen la emoción real antes de poder enmascararla.",
      "tacticalUse": "Permite detectar discrepancias entre lo que la persona afirma sentir verbalmente y su estado emocional genuino.",
      "countermeasure": "Entrena la observación concentrándote en los ojos y la boca sin perder la visión periférica durante la interacción."
    },
    {
      "id": "fc4",
      "term": "Bloqueo Ocular",
      "definition": "Gesto no consciente de frotarse los ojos, parpadear prolongadamente o cubrirse la cara para excluir visualmente algo desagradable o amenazante.",
      "tacticalUse": "Indica desacuerdo profundo, incredulidad o rechazo interno hacia la propuesta o afirmación recién expresada.",
      "countermeasure": "Haz una pausa en tu discurso y formula una pregunta abierta para explorar la objeción no verbalizada."
    },
    {
      "id": "fc5",
      "term": "Mimetismo Postural (Mirroring)",
      "definition": "La adopción inconsciente de la postura, gestos o ritmo vocal del interlocutor para construir afinidad y sintonía.",
      "tacticalUse": "Refleja de forma sutil la postura de la otra persona para acelerar la creación de confianza y empatía mutua.",
      "countermeasure": "Si alguien te imita de manera forzada o mecánica, cambia bruscamente de postura para verificar si es un intento de manipulación consciente."
    }
  ]
};
