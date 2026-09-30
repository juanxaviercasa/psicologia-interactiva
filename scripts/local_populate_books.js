const vm = require('vm');
const fs = require('fs');
const path = require('path');

// --------------------------------------------------------------------------
// Generador local de contenido educativo sin API
// Usa los títulos reales de los módulos para crear preguntas, flashcards y
// casos contextualizados de forma determinista.
// --------------------------------------------------------------------------

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function pickFrom(arr, seed) {
    return arr[seed % arr.length];
}

// Pools de contenido psicológico de alta calidad
const QUESTION_STEMS = [
    'Según este módulo, ¿cuál es el mecanismo principal de',
    '¿Qué distingue a un experto en',
    '¿Cuál de las siguientes afirmaciones sobre',
    'Al aplicar los principios de',
    '¿Qué estrategia resulta más efectiva para',
    'Ante una situación de',
    'El concepto central de',
    '¿Cómo reconoce un observador entrenado',
];

const TACTICS = [
    'reciprocidad', 'escasez artificial', 'autoridad proyectada', 'prueba social',
    'consistencia cognitiva', 'simpatía fabricada', 'anclaje emocional',
    'disonancia cognitiva inducida', 'framing narrativo', 'gaslighting sutil',
    'love bombing', 'triangulación', 'DARVO', 'aislamiento progresivo',
    'reencuadre perceptual', 'lenguaje corporal dominante', 'microexpresiones',
    'rapport forzado', 'hipnosis ericksoniana', 'programación neurolingüística',
];

const COUNTERMEASURES = [
    'Establecer límites claros y comunicarlos asertivamente.',
    'Documentar patrones de comportamiento para identificar manipulación.',
    'Consultar perspectivas externas de confianza antes de decidir.',
    'Tomarse tiempo antes de responder a demandas urgentes fabricadas.',
    'Usar el "test de la silla vacía": ¿qué le dirías a un amigo en tu situación?',
    'Practicar la técnica del "disco rayado" ante presión persistente.',
    'Desarrollar independencia emocional mediante mindfulness diario.',
    'Reconocer los 7 signos de la Tríada Oscura en contactos cercanos.',
    'Aplicar el protocolo JADE-never: no Justifiques, Argumentes, Defiendas ni Expliques.',
    'Crear distancia física y emocional ante señales de peligro.',
];

const CASES_TEMPLATES = [
    {
        category: 'Detección en Entorno Laboral',
        difficulty: 'Alta',
        badge: 'Detective Social',
    },
    {
        category: 'Defensa Personal Psicológica',
        difficulty: 'Media',
        badge: 'Guardián Mental',
    },
    {
        category: 'Aplicación Ética de Principios',
        difficulty: 'Alta',
        badge: 'Maestro de Influencia',
    },
    {
        category: 'Relaciones Interpersonales',
        difficulty: 'Media',
        badge: 'Experto en Vínculos',
    },
];

function generateContent(bookName, modules) {
    const seed = hashCode(bookName);
    const numModules = modules.length;

    // --- FLASHCARDS (5) ---
    const flashcards = [];
    const tacticPool = [...TACTICS];
    for (let i = 0; i < 5; i++) {
        const tIdx = (seed + i * 7) % tacticPool.length;
        const tactic = tacticPool[tIdx];
        const modTitle = modules[i % numModules].title;
        flashcards.push({
            id: `fc${i + 1}`,
            term: tactic.charAt(0).toUpperCase() + tactic.slice(1),
            definition: `Técnica psicológica estudiada en "${modTitle}": patrón cognitivo-conductual que opera bajo umbrales de consciencia para alterar percepciones y decisiones ajenas.`,
            tacticalUse: `Se aplica cuando el manipulador necesita ${pickFrom(['obtener cumplimiento sin resistencia', 'erosionar la autoestima del objetivo', 'crear dependencia emocional', 'desviar la atención de sus propios errores', 'posicionarse como figura de autoridad'], (seed + i) % 5)}.`,
            countermeasure: COUNTERMEASURES[(seed + i * 3) % COUNTERMEASURES.length],
        });
    }

    // --- INTERACTIVE CHALLENGES (uno por módulo) ---
    const interactiveChallenges = modules.map((mod, idx) => {
        const stem = QUESTION_STEMS[(seed + idx) % QUESTION_STEMS.length];
        const tactic = TACTICS[(seed + idx * 5) % TACTICS.length];
        const question = `${stem} la ${tactic} en el contexto de "${mod.title}"?`;
        const correctAnswer = `Implica reconocer patrones de ${tactic} y aplicar distancia emocional estratégica para neutralizarlos.`;
        const wrongs = [
            `Ignorar completamente la situación y esperar que se resuelva sola.`,
            `Responder agresivamente para demostrar dominancia emocional.`,
            `Aceptar todas las premisas del interlocutor sin cuestionarlas.`,
        ];
        return {
            question,
            options: [
                { text: correctAnswer, isCorrect: true, feedback: `¡Correcto! La ${tactic} requiere exactamente esa respuesta calibrada y consciente.` },
                { text: wrongs[0], isCorrect: false, feedback: `Incorrecto. La ignorancia pasiva suele empeorar la dinámica de ${tactic}.` },
                { text: wrongs[1], isCorrect: false, feedback: `Incorrecto. La agresión valida el marco del manipulador y escala el conflicto.` },
                { text: wrongs[2], isCorrect: false, feedback: `Incorrecto. Aceptar premisas sin cuestionarlas es exactamente lo que la ${tactic} busca lograr.` },
            ],
        };
    });

    // --- CASE SCENARIOS (2) ---
    const caseScenarios = [0, 1].map((ci) => {
        const tmpl = CASES_TEMPLATES[(seed + ci * 3) % CASES_TEMPLATES.length];
        const modTitle = modules[(seed + ci) % numModules].title;
        return {
            id: `cs${ci + 1}`,
            category: tmpl.category,
            title: `Caso Práctico: ${modTitle}`,
            difficulty: tmpl.difficulty,
            badge: tmpl.badge,
            scenarioDescription: `Durante una situación relacionada con "${modTitle}", detectas señales sutiles de manipulación psicológica. La persona utiliza patrones estudiados en este módulo para influir en tu toma de decisiones. ¿Cómo respondes?`,
            options: [
                {
                    id: 'opt1',
                    text: 'Aplicar técnicas de desactivación emocional y nombrar el patrón observado.',
                    outcome: 'Éxito Estratégico',
                    wisdomScore: 100,
                    analysis: `Nombrar el patrón interrumpe el ciclo automático de respuesta. Es la técnica más efectiva derivada del estudio de "${modTitle}".`,
                    bookInsight: 'La consciencia del patrón es el primer escudo: lo que se nombra, pierde poder sobre nosotros.',
                },
                {
                    id: 'opt2',
                    text: 'Reaccionar emocionalmente y confrontar de forma impulsiva.',
                    outcome: 'Error Estratégico',
                    wisdomScore: 15,
                    analysis: 'La reacción impulsiva confirma las expectativas del manipulador y cede el control de la situación.',
                    bookInsight: 'El control de las propias emociones es prerequisito para influir en las de otros — o para resistir su influencia.',
                },
            ],
        };
    });

    return { interactiveChallenges, flashcards, caseScenarios };
}

function extractData(filepath, varName) {
    let content = fs.readFileSync(filepath, 'utf-8');
    let modifiedContent = content.replace(`const ${varName} =`, `${varName} =`);
    const sandbox = {};
    vm.createContext(sandbox);
    try {
        vm.runInContext(modifiedContent, sandbox);
        return sandbox[varName];
    } catch (e) {
        return null;
    }
}

// ---- MAIN ----
const baseDir = path.join(__dirname, '..', 'js', 'books');
const files = fs.readdirSync(baseDir).filter(f => f.endsWith('_data.js'));

let processedCount = 0;
let skippedCount = 0;

for (const f of files) {
    const dataFile = path.join(baseDir, f);
    const contentFile = path.join(baseDir, f.replace('_data.js', '_content.js'));
    const bookName = f.replace('_data.js', '');

    let dataObj = extractData(dataFile, 'LIBROS_DATA');
    if (!dataObj || !dataObj.modules || dataObj.modules.length === 0) {
        skippedCount++;
        continue;
    }

    // Verificar si ya tiene contenido real
    if (dataObj.flashcards && dataObj.flashcards.length > 0) {
        const firstTerm = dataObj.flashcards[0].term || '';
        const isDummy = firstTerm.includes('Análisis Contextual') ||
            firstTerm.includes('Dummy') ||
            firstTerm.includes('Concepto Clave') ||
            firstTerm.includes('Término') ||
            firstTerm.includes('Concepto Básico');
        if (!isDummy) {
            skippedCount++;
            continue;
        }
    } else if (dataObj.flashcards && dataObj.flashcards.length === 0) {
        // sin contenido
    } else {
        skippedCount++;
        continue;
    }

    // Generar contenido localmente
    const generated = generateContent(bookName, dataObj.modules);

    // Inyectar interactiveChallenges en los módulos
    dataObj.modules.forEach((mod, idx) => {
        const challenge = generated.interactiveChallenges[idx] || generated.interactiveChallenges[0];
        if (mod.keyPillars) {
            mod.keyPillars.forEach(pillar => {
                pillar.interactiveChallenge = challenge;
            });
        }
    });

    dataObj.flashcards = generated.flashcards;
    dataObj.caseScenarios = generated.caseScenarios;

    fs.writeFileSync(dataFile, `const LIBROS_DATA = ${JSON.stringify(dataObj, null, 2)};\n`, 'utf-8');

    // Actualizar _content.js también
    if (fs.existsSync(contentFile)) {
        let contentObj = extractData(contentFile, 'BOOK_CONTENT');
        if (contentObj) {
            contentObj.modules = dataObj.modules;
            fs.writeFileSync(contentFile, `const BOOK_CONTENT = ${JSON.stringify(contentObj, null, 2)};\n`, 'utf-8');
        }
    }

    processedCount++;
    process.stdout.write(`[+] ${bookName}\n`);
}

console.log(`\n✅ Completado: ${processedCount} libros generados | ${skippedCount} ya tenían contenido.`);
