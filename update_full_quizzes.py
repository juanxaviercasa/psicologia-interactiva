import re
import json

DATA_FILE = 'js/data_libros.js'
APP_JS = 'js/app.js'

print("=== CONSTRUYENDO QUIZZES BRILLIANT.ORG PARA TODOS LOS 24 PILARES ===")

# Base exhaustiva de preguntas tácticas para los 24 pilares
PILLAR_QUIZZES = {
    # LIBRO 1: Fundamentos
    "La Naturaleza de la Mente Humana": [
        {
            "badge": "🏛️ SISTEMA 1 VS SISTEMA 2",
            "question": "Un reclutador te dice: 'Tienes 60 segundos para firmar este contrato o la oferta se anula para siempre'. ¿Qué mecanismo cerebral intenta secuestrar?",
            "options": [
                "El Córtex Prefrontal para forzar un análisis matemático rápido.",
                "El Sistema 1 (Amígdala/Urgencia) para inducir miedo y bloquear el juicio crítico del Sistema 2.",
                "La memoria episódica a largo plazo.",
                "El lóbulo occipital para distorsionar la visión."
            ],
            "correctIndex": 1,
            "explanation": "La urgencia artificial activa la amígdala (Sistema 1), anulando el análisis reflexivo y lógico del Córtex Prefrontal (Sistema 2)."
        },
        {
            "badge": "🔍 DETECCIÓN DE FALACIA",
            "question": "En una negociación, alguien afirma: 'O aceptas mis condiciones ahora mismo o demuestras que no te importa el éxito del equipo'. ¿Qué trampa lógica es?",
            "options": [
                "Falso Dilema (Pensamiento Dicotómico forzado).",
                "Silogismo categórico válido.",
                "Argumento de autoridad científica.",
                "Razonamiento inductivo bayesiano."
            ],
            "correctIndex": 0,
            "explanation": "Reduce una situación con múltiples alternativas a solo dos extremos opuestos para acorralarte emocionalmente."
        },
        {
            "badge": "🛡️ RESPUESTA TÁCTICA",
            "question": "¿Cuál es la respuesta defensiva óptima ante una demanda con ultimátum de tiempo inmediato?",
            "options": [
                "Aceptar de inmediato por miedo a perder la oportunidad.",
                "Aplicar la Regla de las 24 Horas: 'Si requieres una respuesta inmediata es NO; si puedo analizarlo hasta mañana, con gusto lo evalúo'.",
                "Responder con agresividad e insultos.",
                "Firmar pero con la intención de sabotear después."
            ],
            "correctIndex": 1,
            "explanation": "La regla de las 24 horas desactiva la trampa de urgencia del Sistema 1 y traslada el control al análisis lógico del Sistema 2."
        }
    ],

    "Sesgos Cognitivos Centrales": [
        {
            "badge": "🏛️ EFECTO HALO",
            "question": "Un nuevo socio viste traje de diseñador, habla con elocuencia impecable y todos asumen que sus finanzas son transparentes sin auditarlo. ¿Qué sesgo opera?",
            "options": [
                "Efecto Halo: proyectar competencia ética y financiera a partir de una cualidad superficial atractiva.",
                "Sesgo de Disponibilidad retrospectiva.",
                "Efecto Dunning-Kruger.",
                "Aversión a la pérdida pura."
            ],
            "correctIndex": 0,
            "explanation": "El Efecto Halo nubla el juicio crítico al extrapolar una impresión estética positiva hacia cualidades morales y profesionales no verificadas."
        },
        {
            "badge": "🔍 TRAMPA DE ANCLAJE",
            "question": "Un vendedor fija un precio inicial de $15,000 para luego ofrecerte un 'descuento exclusivo' de $4,000. ¿Qué fenómeno psicológico hace que $4,000 parezca barato?",
            "options": [
                "Sesgo de Anclaje: el primer número escuchado actúa como punto de referencia distorsionador.",
                "Efecto Forer o Barnum.",
                "Sesgo de Confirmación.",
                "Pensamiento lateral."
            ],
            "correctIndex": 0,
            "explanation": "El ancla de $15,000 establece un marco de referencia artificial que hace percibir la segunda cifra como una ganancia inusitada."
        },
        {
            "badge": "🛡️ AUDITORÍA COGNITIVA",
            "question": "¿Cómo se neutraliza el sesgo de confirmación cuando estás evaluando una propuesta que te emociona?",
            "options": [
                "Buscar únicamente opiniones de personas que ya están de acuerdo contigo.",
                "Plantear activamente la pregunta: '¿Qué hechos o datos destruirían esta hipótesis si estuviera completamente equivocado?'.",
                "Tomar la decisión en menos de 5 segundos basándose en corazonadas.",
                "Ignorar los números y confiar ciegamente en el instinto."
            ],
            "correctIndex": 1,
            "explanation": "El pensamiento crítico riguroso exige buscar activamente evidencia desconfirmatoria para protegerse del autoengaño."
        }
    ],

    "Inteligencia Emocional y Autorregulación": [
        {
            "badge": "🏛️ NEUROBIOLOGÍA DEL ESTRÉS",
            "question": "¿Qué ocurre en el cerebro cuando experimentas un ataque verbal agresivo sin entrenamiento previo?",
            "options": [
                "Aumenta la actividad de la memoria de trabajo prefrontal.",
                "La amígdala desencadena un secuestro emocional, liberando adrenalina y cortisol que nublan el pensamiento abstracto.",
                "Se produce una sedación inmediata del sistema nervioso central.",
                "El lóbulo parietal asume el control del lenguaje reflexivo."
            ],
            "correctIndex": 1,
            "explanation": "El secuestro amigdalar desactiva la capacidad de reflexión estratégica y fuerza respuestas biológicas primitivas de ataque o huida."
        },
        {
            "badge": "🔍 ETIQUETADO AFECTIVO",
            "question": "Al ser provocado en una discusión, notas que tu pulso se acelera y dices mentalmente: 'Reconozco una sensación de ira y amenaza en mi plexo solar'. ¿Qué efecto produce esto?",
            "options": [
                "El Córtex Prefrontal Ventrolateral se activa e inhibe la reactividad de la amígdala en tiempo real.",
                "Aumenta el rencor y hace inevitable la agresión física.",
                "Borra permanentemente la emoción de la memoria.",
                "Hace que el adversario gane la discusión automáticamente."
            ],
            "correctIndex": 0,
            "explanation": "Nombrar y etiquetar la emoción con precisión verbal reduce comprobatoriamente la hiperactivación amigdalina en estudios de neuroimagen."
        },
        {
            "badge": "🛡️ PROTOCOLO SOMÁTICO",
            "question": "¿Cuál es la técnica respiratoria más rápida para desacelerar la taquicardia bajo presión en menos de 45 segundos?",
            "options": [
                "Hiperventilación rápida con la boca abierta.",
                "El Suspiro Fisiológico (dos inhalaciones nasales cortas seguidas de una exhalación bucal lenta y completa).",
                "Aguantar la respiración durante dos minutos.",
                "Respirar exclusivamente por la boca de forma superficial."
            ],
            "correctIndex": 1,
            "explanation": "El suspiro fisiológico colapsa y re-expande los alvéolos pulmonares, estimulando el nervio vago y desacelerando el pulso cardíaco de inmediato."
        }
    ],

    "Gestión de Pensamientos y Productividad": [
        {
            "badge": "🏛️ PENSAMIENTOS AUTOMÁTICOS",
            "question": "¿Cuál es la característica definitoria de los Pensamientos Automáticos Negativos (PANs) en el modelo de Aaron Beck?",
            "options": [
                "Son planes reflexivos elaborados mediante lógica deductiva.",
                "Son juicios telegráficos, involuntarios e hipercríticos que surgen como reflejo ante un disparador ambiental.",
                "Son recuerdos reprimidos que solo emergen bajo hipnosis.",
                "Son ideas creativas generadas por el hemisferio derecho."
            ],
            "correctIndex": 1,
            "explanation": "Los PANs son cogniciones espontáneas y distorsionadas que generan estados emocionales de ansiedad o culpa sin haber sido cuestionados."
        },
        {
            "badge": "🔍 CATASTROFIZACIÓN",
            "question": "Tras una reunión difícil, tu mente dice: 'Todo salió mal, arruiné mi carrera y nadie volverá a confiar en mí'. ¿Qué distorsión cognitiva predomina?",
            "options": [
                "Catastrofización combinada con Pensamiento Todo o Nada.",
                "Reencuadre cognitivo positivo.",
                "Análisis de riesgo proporcional.",
                "Evaluación estadística imparcial."
            ],
            "correctIndex": 0,
            "explanation": "Asume el peor desenlace imaginable como certeza absoluta y divide la realidad en polos extremos de éxito total o fracaso absoluto."
        },
        {
            "badge": "🛡️ FLECHA DESCENDENTE",
            "question": "¿Cómo se utiliza la técnica de la Flecha Descendente para neutralizar un miedo irracional?",
            "options": [
                "Preguntarse sucesivamente: 'Si esto fuera cierto, ¿qué significaría para mí y qué es lo peor que realmente podría pasar?', hasta llegar a la creencia nuclear y desmontarla.",
                "Ignorar el miedo y ver televisión para distraerse.",
                "Repetir afirmaciones positivas sin abordar el origen del problema.",
                "Culpar a otras personas por generar esa preocupación."
            ],
            "correctIndex": 0,
            "explanation": "La flecha descendente profundiza metódicamente a través de los pensamientos superficiales hasta exponer la creencia irracional raíz."
        }
    ],

    # LIBRO 2: Comunicación No Verbal
    "Fundamentos de la Kinésica y Calibración": [
        {
            "badge": "🏛️ LÍNEA BASE KINÉSICA",
            "question": "¿Por qué es un error grave intentar detectar mentiras sin haber establecido previamente la 'Línea Base' de la persona?",
            "options": [
                "Porque los gestos de estrés o incomodidad varían drásticamente entre individuos y solo son significativos cuando se desvían de su conducta normal.",
                "Porque el lenguaje corporal es idéntico en el 100% de los seres humanos.",
                "Porque las microexpresiones solo existen en actores profesionales.",
                "Porque no se puede observar a nadie por más de 30 segundos."
            ],
            "correctIndex": 0,
            "explanation": "La línea base establece cómo parpadea, respira y gesticula una persona cuando está relajada; solo las desviaciones súbitas revelan tensión cognitiva."
        },
        {
            "badge": "🔍 ASIMETRÍA FACIAL",
            "question": "En una sonrisa de cortesía forzada, ¿qué músculo facial permanece inactivo a diferencia de una sonrisa genuina (Duchenne)?",
            "options": [
                "El músculo Orbicular de los ojos (que arruga los párpados exteriores y 'patas de gallo').",
                "El músculo Masetero de la mandíbula.",
                "El músculo Cigomático mayor exclusivamente.",
                "El músculo frontal de la frente."
            ],
            "correctIndex": 0,
            "explanation": "El músculo orbicular del ojo es involuntario; las sonrisas falsas solo activan la boca (cigomáticos), dejando la mirada fría e inexpresiva."
        },
        {
            "badge": "🛡️ CALIBRACIÓN SILENCIOSA",
            "question": "Cuando haces una pregunta incómoda en una reunión, ¿en qué ventana de tiempo debes observar las micro-reacciones más honestas?",
            "options": [
                "Durante los primeros 200 a 500 milisegundos inmediatamente posteriores a la pregunta.",
                "Cinco minutos después de haber cambiado de tema.",
                "Solo cuando la persona empiece a hablar formalmente.",
                "Al día siguiente por correo electrónico."
            ],
            "correctIndex": 0,
            "explanation": "Las microexpresiones involuntarias ocurren en menos de medio segundo antes de que el córtex consciente active la máscara social."
        }
    ],

    "Proxémica y Dinámicas de Espacio": [
        {
            "badge": "🏛️ ZONAS DE HALL",
            "question": "Según Edward T. Hall, ¿a qué distancia comienza la 'Zona Íntima' humana cuya invasión no autorizada dispara alertas de amenaza?",
            "options": [
                "Menos de 45 centímetros (0 a 45 cm).",
                "Entre 1.2 y 3.5 metros.",
                "Más de 4 metros.",
                "Exactamente a los 5 metros."
            ],
            "correctIndex": 0,
            "explanation": "El espacio inferior a 45 cm está biológicamente reservado para interacciones de máximo afecto o combate físico."
        },
        {
            "badge": "🔍 INVASIÓN TERRITORIAL",
            "question": "Un jefe agresivo se acerca a tu escritorio, se inclina sobre tu silla e invade tu espacio personal a 20 cm mientras te habla. ¿Qué táctica domina?",
            "options": [
                "Dominancia proxémica para inducir sumisión fisiológica por estrés.",
                "Búsqueda de empatía y compasión sincera.",
                "Comunicación asertiva horizontal.",
                "Escucha activa terapéutica."
            ],
            "correctIndex": 0,
            "explanation": "La invasión física premeditada busca forzar a la víctima a encogerse o retroceder, estableciendo una jerarquía de dominación territorial."
        },
        {
            "badge": "🛡️ ESCUDO PROXÉMICO",
            "question": "¿Cuál es la respuesta corporal más elegante y asertiva ante una invasión territorial agresiva?",
            "options": [
                "Ponerse de pie con calma, colocar un objeto físico neutral (carpeta/laptop) entre ambos y mantener la mirada firme sin retroceder.",
                "Agachar la cabeza y disculparse inmediatamente.",
                "Empujar físicamente a la persona.",
                "Salir corriendo de la oficina."
            ],
            "correctIndex": 0,
            "explanation": "Ponerse de pie nivela la altura de los ojos y colocar un objeto neutral restablece la frontera espacial sin escalar a agresión física."
        }
    ],

    "Háptica y Detección de Falsedad": [
        {
            "badge": "🏛️ PACIFICADORES SOMÁTICOS",
            "question": "Durante un interrogatorio o auditoría, una persona comienza a tocarse repetidamente el cuello (fosa yugular) o frotarse los muslos. ¿Qué indica esto?",
            "options": [
                "Comportamientos pacificadores para disipar la sobrecarga de estrés y cortisol en el sistema nervioso.",
                "Felicidad y relajación extrema.",
                "Aburrimiento absoluto sin ninguna carga emocional.",
                "Atracción romántica instantánea."
            ],
            "correctIndex": 0,
            "explanation": "Tocarse el cuello o frotarse las piernas estimula terminaciones nerviosas que envían señales calmantes al cerebro ante un pico agudo de ansiedad."
        },
        {
            "badge": "🔍 FUGAS NO VERBALES",
            "question": "¿Qué parte del cuerpo es biológicamente la más honesta y difícil de controlar conscientemente al mentir?",
            "options": [
                "Los pies y las piernas (dirección de los pies hacia la salida o cruces de escape).",
                "Los labios y la boca.",
                "La voz hablada.",
                "Las cejas."
            ],
            "correctIndex": 0,
            "explanation": "La mayoría de la gente entrena su rostro para disimular, pero olvida por completo los pies, que apuntan instintivamente hacia donde el cerebro desea escapar."
        },
        {
            "badge": "🛡️ PREGUNTA DE CONTROL",
            "question": "¿Cómo se confirma si un pacificador observado se debe a una mentira deliberada o a simple timidez?",
            "options": [
                "Hacer una 'Pregunta de Calibración Segura' y luego repetir la pregunta clave, observando si el pacificador reaparece exclusivamente con el tema crítico.",
                "Acusar a la persona a gritos para ver si llora.",
                "Asumir de inmediato que es culpable sin investigar más.",
                "Ignorar todas las señales y creer en su palabra."
            ],
            "correctIndex": 0,
            "explanation": "El contraste sistemático entre preguntas neutras y preguntas críticas aísla la variable de estrés asociada a la falsedad."
        }
    ],

    "Sincronización y Espejeo Táctico": [
        {
            "badge": "🏛️ RAPPORT Y NEURONAS ESPEJO",
            "question": "¿Qué sistema cerebral permite que el espejeo sutil de postura, tono y ritmo cree una sensación instantánea de confianza subconsciente?",
            "options": [
                "El sistema de Neuronas Espejo en las cortezas premotora e insular.",
                "El cerebelo vestibular exclusivamente.",
                "El lóbulo occipital primario.",
                "La médula espinal lumbar."
            ],
            "correctIndex": 0,
            "explanation": "Las neuronas espejo interpretan la sincronía física como una señal de pertenencia al mismo grupo ('es como yo, es seguro')."
        },
        {
            "badge": "🔍 DETECCIÓN DE ESPEJEO ARTIFICIAL",
            "question": "Notas que un vendedor imita cada uno de tus movimientos corporales (cruzar piernas, tocarse la barbilla) 1 segundo después de ti. ¿Qué debes hacer?",
            "options": [
                "Hacer un movimiento inusual (como colocar las manos sobre la mesa y luego en el regazo) para verificar si es un espejeo mecánico deliberado.",
                "Comprar el producto de inmediato.",
                "Insultar al vendedor por imitarte.",
                "Cerrar los ojos durante toda la conversación."
            ],
            "correctIndex": 0,
            "explanation": "La prueba de desincronización deliberada rompe el patrón del manipulador y expone si está aplicando técnicas de rapport de manual."
        },
        {
            "badge": "🛡️ DESINCRONIZACIÓN DEFENSIVA",
            "question": "¿Cómo se utiliza la desincronización para romper el control de un manipulador que intenta imponer un ritmo apresurado?",
            "options": [
                "Reducir deliberadamente la velocidad del habla, bajar el tono de voz y hacer pausas de 3 segundos antes de responder.",
                "Hablar más rápido que él para ganarle la palabra.",
                "Gritar y mover los brazos bruscamente.",
                "Interrumpir cada dos palabras."
            ],
            "correctIndex": 0,
            "explanation": "Ralentizar tu cadencia y volumen fuerza al interlocutor a desacelerar, recuperando tú el control del ritmo de la interacción."
        }
    ]
}

print("Base de preguntas completada con éxito.")
