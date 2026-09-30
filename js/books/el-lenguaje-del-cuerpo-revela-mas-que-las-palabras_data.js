const LIBROS_DATA = {
  "modules": [],
  "caseScenarios": [
    {
      "id": "cs1",
      "category": "Negociación Estratégica",
      "title": "La Objeción Oculta en la Sala de Juntas",
      "difficulty": "Alta",
      "badge": "Observador Experto",
      "scenarioDescription": "Estás presentando una propuesta económica relevante ante un cliente clave. Justo al mencionar el costo final, notas que el cliente echa la cabeza ligeramente hacia atrás, cruza los brazos de forma apretada y comienza a frotarse la nuca con una mano (comportamiento pacificador). Sin embargo, verbalmente te dice: 'Entiendo, continúe'. ¿Cómo procedes?",
      "options": [
        {
          "id": "opt1",
          "text": "Pausas la presentación con serenidad y dices: 'Antes de continuar, me gustaría hacer una pausa aquí. ¿Hay algún detalle sobre esta estructura de inversión que te genere dudas o que debamos revisar con más profundidad?'",
          "outcome": "Éxito",
          "wisdomScore": 100,
          "analysis": "Identificaste correctamente los pacificadores (frotar la nuca) y la postura defensiva como señales de fricción o estrés interno. Abordaste la objeción no verbal con diplomacia antes de que se convirtiera en un 'no' explícito.",
          "bookInsight": "Los comportamientos pacificadores indican incomodidad. Responder a la señal no verbal abriendo el diálogo desarticula la resistencia sin poner a la otra persona a la defensiva."
        },
        {
          "id": "opt2",
          "text": "Al ver su incomodidad, ofreces inmediatamente un descuento del 15% para evitar perder la venta.",
          "outcome": "Fallo",
          "wisdomScore": 25,
          "analysis": "Cediste valor sin confirmar la razón del estrés. Puede que el cliente no tuviera objeción con el precio en sí, sino con los plazos o el alcance.",
          "bookInsight": "Nunca intentes resolver una señal no verbal de estrés haciendo concesiones precipitadas sin indagar primero la causa real del malestar."
        }
      ]
    },
    {
      "id": "cs2",
      "category": "Liderazgo y Evaluación de Equipos",
      "title": "El Reporte de Progreso Incongruente",
      "difficulty": "Alta",
      "badge": "Maestro del Lenguaje Corporal",
      "scenarioDescription": "Le preguntas a un líder de proyecto si la entrega pactada para mañana estará lista a tiempo. Él sonríe de forma forzada, dice con firmeza: '¡Absolutamente, todo bajo control!', pero simultáneamente da un paso hacia atrás, se ajusta el cuello de la camisa y sus pies quedan orientados hacia la puerta de salida.",
      "options": [
        {
          "id": "opt1",
          "text": "Validas el esfuerzo pero atiendes el lenguaje corporal: 'Aprecio tu compromiso, pero sé que el margen era estrecho. Revisemos los posibles obstáculos actuales para asegurar que tengas todo el apoyo del equipo'.",
          "outcome": "Éxito",
          "wisdomScore": 100,
          "analysis": "Detectaste la incongruencia entre el discurso positivo y los indicadores no verbales de distancia y escape (paso atrás, pies a la salida, ajuste de cuello). Al brindar respaldo sin acusarlo de mentir, facilitas la verdad.",
          "bookInsight": "Cuando las palabras y el cuerpo entran en conflicto, el cuerpo casi siempre refleja la realidad emocional y el estado verdadero de la situación."
        },
        {
          "id": "opt2",
          "text": "Te quedas tranquilo con su confirmación explícita y das por cerrado el asunto para revisar otros temas.",
          "outcome": "Fallo",
          "wisdomScore": 10,
          "analysis": "Ignoraste señales evidentes de huida y estrés no verbal. Descubrirás el retraso del proyecto al día siguiente cuando sea demasiado tarde para intervenir.",
          "bookInsight": "Tomar el lenguaje verbal como verdad absoluta e ignorar el lenguaje corporal de escape suele llevar a sorpresas desagradables en la gestión."
        }
      ]
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "term": "Comportamientos Pacificadores",
      "definition": "Gestos inconscientes como frotarse el cuello, tocarse la cara o ajustarse la ropa que el cerebro utiliza para calmarse a sí mismo ante situaciones de estrés o ansiedad.",
      "tacticalUse": "Identificar el momento exacto en que una persona experimenta incomodidad o tensión durante una conversación o negociación.",
      "countermeasure": "Concientizar estos movimientos para evitar proyectar inseguridad o nerviosismo ante momentos de presión."
    },
    {
      "id": "fc2",
      "term": "Orientación de los Pies",
      "definition": "Indicador corporal no verbal muy preciso que muestra hacia dónde se dirige el verdadero interés o la atención de una persona.",
      "tacticalUse": "Observar si los pies del interlocutor apuntan hacia ti (interés real) o hacia la salida/otra persona (deseo de terminar la interacción).",
      "countermeasure": "Alinea conscientemente tus pies y torso hacia el interlocutor para demostrar engagement y empatía total."
    },
    {
      "id": "fc3",
      "term": "Bloqueo Ocular",
      "definition": "Acción no verbal donde la persona frota sus ojos, cubre su cara o frena el contacto visual prolongadamente como mecanismo defensivo para 'borrar' o evitar algo desagradable.",
      "tacticalUse": "Detectar el punto exacto en que una propuesta, dato u opinión genera rechazo o escepticismo en la audiencia.",
      "countermeasure": "Hacer una pausa estratégica en el discurso para preguntar si hay dudas o inquietudes antes de avanzar."
    },
    {
      "id": "fc4",
      "term": "Microexpresiones Facial",
      "definition": "Expresiones faciales involuntarias e hiperrápidas (duran fracciones de segundo) que exponen la emoción auténtica antes de que la persona pueda enmascararla.",
      "tacticalUse": "Captar contradicciones entre las palabras dichas y la emoción real reprimida (por ejemplo, una fugaz sonrisa de desprecio o un destello de ira).",
      "countermeasure": "Evitar reaccionar de inmediato a una sola microexpresión; busca un 'cúmulo de señales' para confirmar la emoción."
    },
    {
      "id": "fc5",
      "term": "Inclinación Ventral (Ventral Fronting)",
      "definition": "Exposición directa del torso y el pecho hacia otra persona, lo cual demuestra apertura, alta confianza y alineamiento positivo.",
      "tacticalUse": "Establecer un rapport acelerado mostrando tu zona ventral de forma descubierta y orientada directamente al interlocutor.",
      "countermeasure": "Si percibes hostilidad, gira levemente tu torso para reducir la exposición y proyectar una postura relajada pero protegida."
    }
  ]
};
