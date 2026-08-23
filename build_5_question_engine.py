import json
import re

APP_JS = 'js/app.js'
DATA_JS = 'js/data_libros.js'
INDEX_HTML = 'index.html'

print("=== CONSTRUYENDO MOTOR DE 5 PREGUNTAS TÁCTICAS, TEMPORIZADOR Y AUTOCALIFICACIÓN 80% ===")

# 1. Base exhaustiva de 5 preguntas por pilar con los 5 niveles cognitivos
# Definimos el generador maestro de 5 preguntas neurodidácticas por cada pilar
MASTER_5_TIER_QUIZZES = {
    # LIBRO 1: Fundamentos de la Psicología Oscura y Conciencia
    "La Naturaleza de la Mente Humana": [
        {
            "badge": "🏛️ NIVEL 1: BASE NEUROBIOLÓGICA",
            "question": "Un manipulador te exige firmar un acuerdo en 60 segundos afirmando que la oportunidad 'desaparecerá para siempre'. ¿Qué mecanismo cerebral intenta secuestrar?",
            "options": [
                "El Córtex Prefrontal para forzar un análisis matemático consciente.",
                "El Sistema 1 (Amígdala) para inducir miedo y bloquear el juicio crítico del Sistema 2.",
                "El hipocampo para borrar tus recuerdos recientes.",
                "El lóbulo temporal para impedir el procesamiento auditivo."
            ],
            "correctIndex": 1,
            "explanation": "La urgencia artificial estimula la respuesta de lucha o huida de la amígdala (Sistema 1), anulando el análisis reflexivo y lógico del Córtex Prefrontal (Sistema 2)."
        },
        {
            "badge": "🔍 NIVEL 2: DETECCIÓN DE FALACIA EN CASO REAL",
            "question": "En una reunión, un colega afirma: 'O apruebas este presupuesto ahora mismo o demuestras que no te importa el éxito de la empresa'. ¿Qué trampa lógica está ejecutando?",
            "options": [
                "Falso Dilema (Pensamiento Dicotómico forzado para acorralar).",
                "Silogismo deductivo formal con premisas válidas.",
                "Argumento de autoridad científica comprobada.",
                "Razonamiento bayesiano imparcial."
            ],
            "correctIndex": 0,
            "explanation": "Reduce una situación compleja a solo dos opciones extremas e irreales para forzar sumisión mediante culpa y presión."
        },
        {
            "badge": "🛡️ NIVEL 3: EJECUCIÓN DEL ESCUDO TÁCTICO",
            "question": "¿Cuál es la respuesta verbal y postural óptima ante una demanda con ultimátum de tiempo inmediato?",
            "options": [
                "Aceptar apresuradamente para evitar el conflicto y luego quejarse.",
                "Aplicar la Regla de las 24 Horas: 'Si necesitas una respuesta ahora, mi respuesta es NO; si puedo analizarlo hasta mañana, con gusto lo evalúo'.",
                "Responder con insultos y gritos para intimidar al interlocutor.",
                "Firmar pero con la intención secreta de no cumplir."
            ],
            "correctIndex": 1,
            "explanation": "La regla de las 24 horas desactiva la trampa de urgencia del Sistema 1 y traslada el control al análisis lógico del Sistema 2."
        },
        {
            "badge": "⚠️ NIVEL 4: IDENTIFICACIÓN DEL ERROR INTUITIVO",
            "question": "¿Cuál es el error fatal más común que comete una persona no entrenada al recibir un ataque verbal?",
            "options": [
                "Justificarse de manera extensa y dar explicaciones detalladas para 'convencer' al manipulador.",
                "Hacer una pausa en silencio de 3 segundos.",
                "Pedir que la petición se envíe por correo electrónico.",
                "Mantener una postura corporal neutra y relajada."
            ],
            "correctIndex": 0,
            "explanation": "Dar explicaciones excesivas valida la falsa acusación del manipulador y le proporciona más argumentos y vulnerabilidades para contraatacar."
        },
        {
            "badge": "⚡ NIVEL 5: TRANSFERENCIA EN ESCENARIO CRÍTICO",
            "question": "Estás en una negociación de alto riesgo donde el adversario combina urgencia artificial, halagos exagerados y amenazas veladas. ¿Cuál es el protocolo de contención?",
            "options": [
                "Pausar la reunión 10 minutos (tiempo fuera fisiológico), anotar las demandas en papel y evaluar solo hechos objetivos despojados de la carga emocional.",
                "Ceder en el 50% de las demandas para calmar la agresividad del adversario.",
                "Aumentar el tono de voz para ganar la discusión por volumen.",
                "Firmar el contrato de inmediato para terminar con el estrés."
            ],
            "correctIndex": 0,
            "explanation": "El tiempo fuera físico permite metabolizar el cortisol, mientras que escribir las demandas traslada el procesamiento del sistema límbico al córtex analítico."
        }
    ],

    "Sesgos Cognitivos Centrales": [
        {
            "badge": "🏛️ NIVEL 1: EFECTO HALO Y ANCLAJE",
            "question": "Un consultor viste un traje sastre impecable de $3,000, reloj de alta gama y modales carismáticos. La junta directiva aprueba su plan sin auditarlo. ¿Qué sesgo opera?",
            "options": [
                "Efecto Halo: extrapolar una cualidad estética superficial hacia cualidades éticas y de competencia profesional no verificadas.",
                "Sesgo de Disponibilidad retrospectiva.",
                "Efecto Dunning-Kruger puro.",
                "Aversión a la pérdida."
            ],
            "correctIndex": 0,
            "explanation": "El Efecto Halo nubla el juicio crítico al asumir erróneamente que una persona atractiva y bien vestida es automáticamente honesta y competente."
        },
        {
            "badge": "🔍 NIVEL 2: ANÁLISIS DE ANCLAJE EN PRECIOS",
            "question": "Un vendedor establece un precio inicial ficticio de $12,000 para luego ofrecerte un 'precio especial de cortesía' de $3,500. ¿Qué fenómeno ocurre en tu cerebro?",
            "options": [
                "Anclaje de Precio: el primer número actúa como ancla mental, haciendo que $3,500 parezca una ganancia extraordinaria aunque su valor real sea menor.",
                "Sesgo de Confirmación puro.",
                "Efecto Forer o Barnum.",
                "Pensamiento lateral."
            ],
            "correctIndex": 0,
            "explanation": "El ancla distorsiona la escala interna de valor, condicionando cualquier cifra posterior en comparación con el primer número desproporcionado."
        },
        {
            "badge": "🛡️ NIVEL 3: DESARME DEL SESGO DE CONFIRMACIÓN",
            "question": "¿Cómo se neutraliza de raíz el sesgo de confirmación cuando una propuesta te entusiasma profundamente?",
            "options": [
                "Buscar activamente evidencia desconfirmatoria: preguntarse '¿Qué datos empíricos destruirían mi hipótesis si estuviera equivocado?'.",
                "Consultar únicamente a personas que siempre están de acuerdo contigo.",
                "Tomar la decisión en menos de 3 segundos basándose en corazonadas.",
                "Ignorar los números y confiar ciegamente en la química personal."
            ],
            "correctIndex": 0,
            "explanation": "El pensamiento crítico científico exige buscar deliberadamente datos que refuten la creencia para no caer en el autoengaño selectivo."
        },
        {
            "badge": "⚠️ NIVEL 4: EL ERROR DEL COSTO HUNDIDO",
            "question": "Has invertido $10,000 y 6 meses en un proyecto tóxico que claramente va a fracasar, pero continúas invirtiendo 'para no perder lo que ya pusiste'. ¿Qué trampa psicológica es?",
            "options": [
                "Falacia del Costo Hundido (Sunk Cost Fallacy): justificar pérdidas futuras basándose en recursos pasados irrecuperables.",
                "Sesgo de Optimismo racional.",
                "Efecto Pigmalión positivo.",
                "Teoría de Juegos de suma cero."
            ],
            "correctIndex": 0,
            "explanation": "El costo hundido nos atrapa emocionalmente en situaciones destructivas por aversión a admitir la pérdida inicial."
        },
        {
            "badge": "⚡ NIVEL 5: AUDITORÍA DE DECISIÓN BAJO PRESIÓN",
            "question": "Un manipulador utiliza el Efecto Halo y la Prueba Social diciendo: 'Todos los directores exitosos ya lo aprobaron, ¿te vas a quedar fuera?'. ¿Cómo se responde?",
            "options": [
                "'La decisión de otros directores responde a sus propios contextos; mi evaluación se basará exclusivamente en nuestras métricas y retorno auditado'.",
                "Aprobar de inmediato para no quedar como el único rezagado.",
                "Ofenderse y decir que los otros directores son incompetentes.",
                "Delegar la firma a otra persona para no asumir responsabilidad."
            ],
            "correctIndex": 0,
            "explanation": "Desarma la prueba social separando la conducta del rebaño de los datos técnicos verificables y objetivos de tu propio caso."
        }
    ],

    "Inteligencia Emocional y Autorregulación": [
        {
            "badge": "🏛️ NIVEL 1: NEUROFISIOLOGÍA DEL SECUESTRO EMOCIONAL",
            "question": "¿Qué ocurre a nivel cerebral durante un ataque verbal agresivo sin entrenamiento de autorregulación?",
            "options": [
                "Aumenta la memoria de trabajo y la precisión analítica prefrontal.",
                "La amígdala dispara un secuestro emocional, inundando el sistema de cortisol y adrenalina y bloqueando el razonamiento abstracto.",
                "Se produce una sedación inmediata del sistema nervioso autónomo.",
                "El lóbulo parietal asume el control del lenguaje reflexivo."
            ],
            "correctIndex": 1,
            "explanation": "El secuestro límbico desconecta la corteza prefrontal reflexiva y activa respuestas primitivas no estratégicas de ataque o huida."
        },
        {
            "badge": "🔍 NIVEL 2: ETIQUETADO AFECTIVO (AFFECT LABELING)",
            "question": "Al ser provocado, notas que tu pulso se acelera y dices mentalmente: 'Reconozco una sensación de ira e indignación en mi pecho'. ¿Qué efecto produce esto?",
            "options": [
                "El Córtex Prefrontal Ventrolateral se activa e inhibe la reactividad de la amígdala en tiempo real.",
                "Aumenta el rencor y hace inevitable la agresión física.",
                "Borra permanentemente el recuerdo del evento.",
                "Le da el control de la conversación al interlocutor."
            ],
            "correctIndex": 0,
            "explanation": "Nombrar y etiquetar la emoción con precisión verbal reduce comprobatoriamente la hiperactivación amigdalina en resonancias magnéticas funcionales."
        },
        {
            "badge": "🛡️ NIVEL 3: SUSPIRO FISIOLÓGICO SOMÁTICO",
            "question": "¿Cuál es el protocolo respiratorio más rápido para desacelerar la taquicardia bajo ataque en menos de 40 segundos?",
            "options": [
                "El Suspiro Fisiológico: dos inhalaciones nasales cortas y consecutivas seguidas de una exhalación bucal lenta y completa.",
                "Hiperventilación rápida con la boca abierta.",
                "Aguantar la respiración durante dos minutos.",
                "Respirar exclusivamente por la boca de forma superficial."
            ],
            "correctIndex": 0,
            "explanation": "El suspiro fisiológico re-expande los alvéolos colapsados, estimula el nervio vago y libera acetilcolina, desacelerando el pulso al instante."
        },
        {
            "badge": "⚠️ NIVEL 4: EL ERROR DE LA REACTIVIDAD INSTINTIVA",
            "question": "¿Por qué gritar, contraatacar o ponerse a la defensiva durante una provocación planificada cumple exactamente el objetivo del manipulador?",
            "options": [
                "Porque traslada el foco de su mala conducta hacia tu 'reacción descontrolada', permitiéndole asumir el papel de víctima razonable.",
                "Porque demuestra fuerza y superioridad psicológica sobre el agresor.",
                "Porque obliga al manipulador a disculparse públicamente.",
                "Porque activa el Córtex Prefrontal del agresor."
            ],
            "correctIndex": 0,
            "explanation": "El manipulador provoca deliberadamente para que pierdas el control y uses argumentos emocionales, haciéndote parecer culpable ante terceros."
        },
        {
            "badge": "⚡ NIVEL 5: REENCUADRE COGNITIVO EN TIEMPO REAL",
            "question": "Durante un interrogatorio hostil, el agresor intenta hacerte perder la compostura. ¿Qué reencuadre mental mantiene tu serenidad?",
            "options": [
                "'Esta agresión no es sobre mí; es un intento predecible y desesperado de desestabilizarme para ocultar sus propias debilidades'.",
                "'Tengo que destruir a esta persona antes de que ella me destruya a mí'.",
                "'Seguro tiene razón y yo soy el culpable de todo'.",
                "'Debo aceptar todo lo que diga para que termine rápido'."
            ],
            "correctIndex": 0,
            "explanation": "Despersonalizar el ataque transforma al agresor en un objeto de estudio clínico, desactivando el dolor del ego y preservando el control estratégico."
        }
    ]
}

def generate_5_tier_quiz(pillar_title, p_concept, p_shield):
    return [
        {
            "badge": "🏛️ NIVEL 1: PRINCIPIO Y BASE BIOLÓGICA",
            "question": f"En el pilar de '{pillar_title}', ¿cuál es el mecanismo central que describe la psicología estratégica?",
            "options": [
                f"{p_concept[:130]}...",
                "Un fenómeno casual que no tiene base biológica ni conductual.",
                "Una técnica esotérica sin respaldo empírico en la literatura científica.",
                "Una reacción involuntaria que no se puede entrenar ni prevenir."
            ],
            "correctIndex": 0,
            "explanation": f"Mecanismo fundamental: {p_concept}"
        },
        {
            "badge": "🔍 NIVEL 2: ANÁLISIS DE CASO REAL",
            "question": f"Si una persona en tu entorno intenta aplicar tácticas relacionadas con '{pillar_title}', ¿qué señal clave delata la manipulación?",
            "options": [
                "Asimetría de información y presión encubierta para forzar una decisión sin consentimiento informado.",
                "Transparencia total en los datos y respeto mutuo de tiempos.",
                "Apertura a recibir críticas y modificar su postura.",
                "Fijación de límites claros y respetuosos."
            ],
            "correctIndex": 0,
            "explanation": "La manipulación táctica se reconoce por la prisa forzada y la búsqueda de beneficios unilaterales a costa de tus límites."
        },
        {
            "badge": "🛡️ NIVEL 3: EJECUCIÓN DEL ESCUDO TÁCTICO",
            "question": f"¿Cuál es el escudo de respuesta inmediata para neutralizar esta dinámica?",
            "options": [
                f"{p_shield}",
                "Reaccionar con violencia verbal para intimidar al adversario.",
                "Ceder incondicionalmente esperando que el manipulador cambie por gratitud.",
                "Ignorar la situación y no fijar ningún límite formal."
            ],
            "correctIndex": 0,
            "explanation": f"Escudo táctico aplicable: {p_shield}"
        },
        {
            "badge": "⚠️ NIVEL 4: EL ERROR COMÚN DE LA VÍCTIMA",
            "question": "¿Cuál es la respuesta intuitiva pero errónea que suele darle más poder al manipulador?",
            "options": [
                "Justificarse excesivamente, pedir disculpas por defender sus derechos y buscar la aprobación del agresor.",
                "Mantenerse en silencio durante 5 segundos y respirar con calma.",
                "Solicitar que la propuesta se ponga por escrito.",
                "Fijar una fecha posterior para evaluar la situación."
            ],
            "correctIndex": 0,
            "explanation": "Buscar la aprobación del agresor valida su falso juicio y le otorga autoridad moral sobre tus decisiones."
        },
        {
            "badge": "⚡ NIVEL 5: TRANSFERENCIA EN ESCENARIO CRÍTICO",
            "question": "Frente a un intento de manipulación recurrente y sistemática de este tipo, ¿cuál es la estrategia de largo plazo más sólida?",
            "options": [
                "Registrar por escrito hechos e interacciones (cadena de custodia), establecer consecuencias no negociables y reducir la exposición al agresor.",
                "Intentar convencer al manipulador de que vaya a terapia contigo.",
                "Contarle tus secretos más íntimos para demostrar confianza.",
                "Aceptar el rol de víctima como algo inevitable."
            ],
            "correctIndex": 0,
            "explanation": "La documentación de hechos y el establecimiento de límites innegociables desmantelan la impunidad de la manipulación sistemática."
        }
    ]

print("=== ACTUALIZANDO DATA_LIBROS.JS CON QUIZZES DE 5 PREGUNTAS ===")
# Cargamos y aseguramos que cada pilar tenga sus 5 preguntas
