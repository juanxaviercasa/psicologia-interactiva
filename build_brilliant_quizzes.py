import json
import re

DATA_FILE = 'js/data_libros.js'

print("=== ACTUALIZANDO DATA_LIBROS.JS CON QUIZZES MULTI-PREGUNTA ESTILO BRILLIANT.ORG ===")

# Leemos data_libros.js
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Quiz database for each of the 24 pillars
QUIZZES = {
    # MODULO 1
    "La Naturaleza de la Mente Humana": [
        {
            "type": "concept",
            "badge": "🏛️ SISTEMA 1 VS SISTEMA 2",
            "question": "Un manipulador en una reunión te exige: 'Tienes exactamente 60 segundos para decidir si aceptas este trato o se cancela'. ¿Qué mecanismo cerebral intenta secuestrar?",
            "options": [
                "El Córtex Prefrontal para forzar un análisis matemático rápido.",
                "El Sistema 1 (Amígdala) para inducir miedo y bloquear el juicio crítico del Sistema 2.",
                "El hipocampo para borrar tus recuerdos recientes.",
                "El lóbulo temporal para impedir el procesamiento auditivo."
            ],
            "correctIndex": 1,
            "explanation": "La urgencia artificial estimula la respuesta de lucha o huida de la amígdala (Sistema 1), anulando el análisis reflexivo y lógico del Córtex Prefrontal (Sistema 2)."
        },
        {
            "type": "scenario",
            "badge": "🔍 DETECCIÓN DE AMENAZA",
            "question": "Durante una discusión familiar, alguien te dice: 'Si realmente me amaras, no me harías esperar'. ¿Qué distorsión primaria se está utilizando?",
            "options": [
                "Falso dilema emocional combinado con chantaje afectivo.",
                "Argumento deductivo formal.",
                "Razonamiento inductivo bayesiano.",
                "Persuasión basada en evidencia empírica."
            ],
            "correctIndex": 0,
            "explanation": "Reduce una situación compleja a solo dos opciones extremas ('me amas' vs 'me haces esperar') para inducir culpa y forzar sumisión."
        },
        {
            "type": "defense",
            "badge": "🛡️ RESPUESTA TÁCTICA",
            "question": "¿Cuál es la respuesta defensiva más eficaz ante una demanda con ultimátum de tiempo inmediato?",
            "options": [
                "Aceptar de inmediato para evitar el conflicto y luego quejarse.",
                "Aplicar la 'Regla de las 24 Horas': 'Si necesito responder ahora, mi respuesta es no; si puedo analizarlo hasta mañana, lo evaluaré'.",
                "Gritar para demostrar superioridad jerárquica.",
                "Hacer una contraoferta el doble de arriesgada sin pensar."
            ],
            "correctIndex": 1,
            "explanation": "La regla de las 24 horas desactiva la trampa de urgencia del Sistema 1 y traslada el control al análisis lógico del Sistema 2."
        }
    ],

    "Sesgos Cognitivos Centrales": [
        {
            "type": "concept",
            "badge": "🏛️ EFECTO HALO Y ANCLAJE",
            "question": "Un estafador viste un traje sastre de $3,000, reloj de lujo y modales impecables antes de pedirte una inversión sin garantías. ¿De qué sesgo se está aprovechando?",
            "options": [
                "Efecto Halo: atribuir honestidad y competencia global basada en un único rasgo superficial positivo.",
                "Sesgo de Disponibilidad retrospectiva.",
                "Efecto Dunning-Kruger.",
                "Aversión a la pérdida pura."
            ],
            "correctIndex": 0,
            "explanation": "El Efecto Halo hace que nuestro cerebro asuma erróneamente que una persona bien vestida y atractiva es también ética, solvente y confiable."
        },
        {
            "type": "scenario",
            "badge": "🔍 CASO PRÁCTICO: ANCLAJE",
            "question": "En una negociación, un vendedor te dice primero: 'Este servicio cuesta $10,000, pero hoy solo para ti te lo dejo en $2,500'. ¿Qué trampa psicológica ejecutó?",
            "options": [
                "Sesgo de Confirmación.",
                "Anclaje de Precio: fijar una cifra inicial desproporcionada para que la segunda parezca una ganga irresistible.",
                "Efecto Forer o Barnum.",
                "Pensamiento dicotómico."
            ],
            "correctIndex": 1,
            "explanation": "El primer número escuchado ($10,000) actúa como un ancla mental involuntaria, distorsionando tu percepción del valor real del producto."
        },
        {
            "type": "defense",
            "badge": "🛡️ DESARME COGNITIVO",
            "question": "¿Cómo se neutraliza de raíz el sesgo de confirmación cuando alguien intenta manipularte con 'pruebas' seleccionadas?",
            "options": [
                "Creerle inmediatamente para no desgastar la relación.",
                "Buscar activamente evidencia desconfirmatoria: preguntarse '¿Qué datos contradicen esta hipótesis?'.",
                "Ignorar los datos y guiarse únicamente por corazonadas.",
                "Repetir la premisa del manipulador en voz alta tres veces."
            ],
            "correctIndex": 1,
            "explanation": "El pensamiento crítico científico exige buscar intencionalmente datos que refuten la afirmación para no caer en la ilusión de validez."
        }
    ],

    "Inteligencia Emocional y Autorregulación": [
        {
            "type": "concept",
            "badge": "🏛️ VENTANA DE TOLERANCIA",
            "question": "¿Qué ocurre a nivel neurofisiológico durante un 'secuestro amigdalar' inducido por un ataque verbal?",
            "options": [
                "El córtex prefrontal aumenta su capacidad de memoria operativa.",
                "La amígdala dispara cortisol y adrenalina, bloqueando el pensamiento abstracto y activando hiperactivación o congelamiento.",
                "El ritmo cardíaco disminuye drásticamente a menos de 40 lpm.",
                "Se produce una relajación espontánea del sistema nervioso simpático."
            ],
            "correctIndex": 1,
            "explanation": "El secuestro amigdalar apaga la corteza prefrontal lógica y sumerge al individuo en un estado defensivo instintivo."
        },
        {
            "type": "scenario",
            "badge": "🔍 ETIQUETADO EMOCIONAL",
            "question": "Sientes una ola de ira intensa cuando un colega desacredita tu trabajo en público. En lugar de reaccionar impulsivamente, dices internamente: 'Estoy experimentando una sensación de indignación y amenaza en mi pecho'. ¿Por qué funciona esta técnica?",
            "options": [
                "Porque al verbalizar y nombrar la emoción, el Córtex Prefrontal Ventrolateral inhibe la reactividad de la amígdala.",
                "Porque elimina físicamente las toxinas del hígado.",
                "Porque convence al colega de pedir perdón automáticamente.",
                "Porque borra la memoria del evento."
            ],
            "correctIndex": 0,
            "explanation": "El etiquetado afectivo ('Affect Labeling') activa la corteza prefrontal izquierda y reduce comprobatoriamente la actividad amigdalina en resonancias cerebrales."
        },
        {
            "type": "defense",
            "badge": "🛡️ RESPIRACIÓN SOMÁTICA",
            "question": "¿Qué protocolo fisiológico activa el Sistema Nervioso Parasimpático en menos de 60 segundos bajo ataque psicológico?",
            "options": [
                "Hiperventilar rápidamente por la boca.",
                "Suspiro Fisiológico (dos inhalaciones nasales seguidas de una exhalación bucal prolongada) o respiración cuadrada 4x4.",
                "Contener la respiración hasta marearse.",
                "Beber 3 tazas de café expreso."
            ],
            "correctIndex": 1,
            "explanation": "La exhalación prolongada estimula el nervio vago y libera acetilcolina, desacelerando inmediatamente la frecuencia cardíaca."
        }
    ],

    "Gestión de Pensamientos y Productividad": [
        {
            "type": "concept",
            "badge": "🏛️ TRIADA DE BECK Y PANS",
            "question": "¿Qué es un Pensamiento Automático Negativo (PAN) según el modelo cognitivo de Aaron Beck?",
            "options": [
                "Una decisión estratégica planificada con meses de anticipación.",
                "Un juicio automático, involuntario y distorsionado que surge como reflejo ante un disparador ambiental.",
                "Un recuerdo infantil reprimido de la etapa oral.",
                "Una alucinación auditiva patológica."
            ],
            "correctIndex": 1,
            "explanation": "Los PANs son cogniciones telegráficas e involuntarias que condicionan emociones dolorosas sin haber sido sometidas a filtro lógico."
        },
        {
            "type": "scenario",
            "badge": "🔍 DISTORSIÓN DE CATASTROFIZACIÓN",
            "question": "Cometes un error menor en un reporte y tu mente concluye: 'Me van a despedir, perderé mi casa y arruinaré mi vida'. ¿Qué distorsión cognitiva estás sufriendo?",
            "options": [
                "Catastrofización y salto a conclusiones extremas.",
                "Pensamiento científico probabilístico.",
                "Reencuadre contextual positivo.",
                "Efecto Pigmalión inverso."
            ],
            "correctIndex": 0,
            "explanation": "La catastrofización asume el peor escenario posible como inevitable sin considerar la probabilidad real de los hechos."
        },
        {
            "type": "defense",
            "badge": "🛡️ REESTRUCTURACIÓN COGNITIVA",
            "question": "¿Cuál es la pregunta más poderosa para desmontar un pensamiento catastrófico?",
            "options": [
                "'¿Cómo puedo sufrir más rápido?'.",
                "'¿Cuál es la evidencia objetiva a favor y en contra, y qué es lo peor que realmente podría pasar y cómo lo resolvería?'.",
                "'¿A quién puedo culpar por este pensamiento?'.",
                "'¿Por qué siempre me pasa todo lo malo a mí?'."
            ],
            "correctIndex": 1,
            "explanation": "El examen socrático de evidencia objetiva neutraliza la trampa de la distorsión y devuelve el control a la corteza analítica."
        }
    ]
}

# Generic fallback template for any pillar not explicitly listed in detailed dict
def generate_pillar_quiz(pillar_title, p_concept, p_shield):
    return [
        {
            "type": "concept",
            "badge": "🏛️ PRINCIPIO FUNDAMENTAL",
            "question": f"En el contexto de '{pillar_title}', ¿cuál es el mecanismo central que describe la psicología estratégica?",
            "options": [
                f"{p_concept[:120]}...",
                "La persuasión pasiva que depende únicamente de la suerte del interlocutor.",
                "Un fenómeno aleatorio sin base biológica ni conductual comprobada.",
                "Una técnica esotérica sin respaldo en la literatura científica."
            ],
            "correctIndex": 0,
            "explanation": f"El pilar se fundamenta en: {p_concept}"
        },
        {
            "type": "scenario",
            "badge": "🔍 ANÁLISIS DE CASO REAL",
            "question": f"Si un interlocutor intenta vulnerar tus límites utilizando dinámicas relacionadas con '{pillar_title}', ¿qué señal clave revela la manipulación?",
            "options": [
                "Búsqueda de consenso transparente y respeto mutuo de tiempos.",
                "Incongruencia entre el discurso verbal y el lenguaje corporal, acompañada de presión encubierta.",
                "Apertura a escuchar críticas y modificar su postura.",
                "Presentación clara de datos y fuentes verificables."
            ],
            "correctIndex": 1,
            "explanation": "La manipulación encubierta se delata por la asimetría informativa y la presión para obtener ventajas sin consentimiento genuino."
        },
        {
            "type": "defense",
            "badge": "🛡️ REGLA TÁCTICA DEFENSIVA",
            "question": f"¿Cuál es el escudo defensivo óptimo para neutralizar esta dinámica?",
            "options": [
                f"{p_shield}",
                "Reaccionar con agresión inmediata para intimidar al adversario.",
                "Ceder incondicionalmente esperando que el manipulador cambie por gratitud.",
                "Ignorar la situación y no establecer ningún límite formal."
            ],
            "correctIndex": 0,
            "explanation": f"Regla táctica aplicable: {p_shield}"
        }
    ]

# Modificamos data_libros.js con el parser
# Reemplazamos 'interactiveChallenge: { ... }' por 'quiz: [ ... ]' y mantenemos compatibilidad
import esprima_like = False

# Cargamos el archivo y reemplazamos dinámicamente
print("Analizando y actualizando todos los 24 pilares...")

# Guardamos un script para actualizar data_libros.js
