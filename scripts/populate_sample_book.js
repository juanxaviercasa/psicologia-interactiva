const fs = require('fs');
const path = require('path');
const vm = require('vm');

function generate_real_questions(module_idx, title) {
    const questions = [
        {
            "question": "¿Cuál es el objetivo principal de la manipulación psicológica según este capítulo?",
            "options": [
                {"text": "Influir en la víctima sin que se dé cuenta", "isCorrect": true, "feedback": "¡Exacto! La manipulación busca el control encubierto."},
                {"text": "Establecer una relación de confianza mutua", "isCorrect": false, "feedback": "La manipulación busca control, no confianza mutua genuina."},
                {"text": "Ayudar a la víctima a mejorar su vida", "isCorrect": false, "feedback": "Eso sería influencia positiva, no manipulación oscura."},
                {"text": "Mostrar dominancia física", "isCorrect": false, "feedback": "La manipulación psicológica es mental, no física."}
            ]
        },
        {
            "question": "En el contexto de la Psicología Oscura, ¿qué táctica es más probable que use un manipulador inicialmente?",
            "options": [
                {"text": "Aislamiento", "isCorrect": false, "feedback": "El aislamiento suele venir después de ganar confianza."},
                {"text": "Love Bombing (Bombardeo de Amor)", "isCorrect": true, "feedback": "¡Correcto! Primero ganan la confianza con afecto abrumador."},
                {"text": "Agresión física", "isCorrect": false, "feedback": "Rara vez usan violencia física; prefieren el control mental."},
                {"text": "Crítica constante", "isCorrect": false, "feedback": "La crítica constante viene en la fase de devaluación."}
            ]
        },
        {
            "question": "¿Cómo se defiende uno de la lectura mental o 'cold reading' de un manipulador?",
            "options": [
                {"text": "Dando la menor información emocional posible (Piedra Gris)", "isCorrect": true, "feedback": "¡Excelente! El método de la piedra gris te hace poco interesante y difícil de leer."},
                {"text": "Discutiendo lógicamente con ellos", "isCorrect": false, "feedback": "Los manipuladores usan la lógica en tu contra."},
                {"text": "Llorando y mostrando vulnerabilidad", "isCorrect": false, "feedback": "Esto les da más poder y munición."},
                {"text": "Tratando de manipularlos de vuelta", "isCorrect": false, "feedback": "Suelen ser expertos y podrías caer más profundo en su trampa."}
            ]
        }
    ];
    return questions[module_idx % questions.length];
}

function populate_book(filepath, var_name) {
    console.log(`Procesando ${filepath}...`);
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Replace const declaration with global assignment
    content = content.replace(`const ${var_name} =`, `${var_name} =`);
    
    // Evaluate the JS content safely
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);
    
    let data = sandbox[var_name];
    if (!data) {
        console.log(`No se pudo extraer ${var_name} de ${filepath}`);
        return;
    }

    // 1. Insert placeholders in the FIRST module's first pillar
    if (data.modules && data.modules.length > 0) {
        const first_mod = data.modules[0];
        if (first_mod.keyPillars && first_mod.keyPillars.length > 0) {
            const pillar = first_mod.keyPillars[0];
            const placeholder_html = `<br/><br/>
<div class="my-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
    <h4 class="text-indigo-400 font-bold mb-4 flex items-center gap-2">
        <i class="fa-solid fa-layer-group"></i> Colección: 4 Libros en 1
    </h4>
    <p class="text-slate-300 text-sm mb-4">Esta edición especial contiene las 4 obras completas. A continuación puedes ver los títulos incluidos:</p>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Placeholder Libro 1 -->
        <div class="flex flex-col items-center group">
            <div class="w-full aspect-[2/3] bg-slate-800 rounded-lg shadow-lg border border-slate-700 flex flex-col justify-center items-center text-center p-3 relative overflow-hidden group-hover:border-indigo-500 transition-colors">
                <i class="fa-solid fa-book-skull text-3xl text-slate-600 mb-2 group-hover:text-indigo-400 transition-colors"></i>
                <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider group-hover:text-indigo-300 transition-colors">Libro 1</span>
                <span class="text-[10px] text-slate-400 mt-1 leading-tight">Secretos de la Psicología Oscura</span>
            </div>
        </div>
        <!-- Placeholder Libro 2 -->
        <div class="flex flex-col items-center group">
            <div class="w-full aspect-[2/3] bg-slate-800 rounded-lg shadow-lg border border-slate-700 flex flex-col justify-center items-center text-center p-3 relative overflow-hidden group-hover:border-emerald-500 transition-colors">
                <i class="fa-solid fa-eye text-3xl text-slate-600 mb-2 group-hover:text-emerald-400 transition-colors"></i>
                <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider group-hover:text-emerald-300 transition-colors">Libro 2</span>
                <span class="text-[10px] text-slate-400 mt-1 leading-tight">Lectura Rápida de Personas</span>
            </div>
        </div>
        <!-- Placeholder Libro 3 -->
        <div class="flex flex-col items-center group">
            <div class="w-full aspect-[2/3] bg-slate-800 rounded-lg shadow-lg border border-slate-700 flex flex-col justify-center items-center text-center p-3 relative overflow-hidden group-hover:border-amber-500 transition-colors">
                <i class="fa-solid fa-brain text-3xl text-slate-600 mb-2 group-hover:text-amber-400 transition-colors"></i>
                <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider group-hover:text-amber-300 transition-colors">Libro 3</span>
                <span class="text-[10px] text-slate-400 mt-1 leading-tight">Reescriba su Mente</span>
            </div>
        </div>
        <!-- Placeholder Libro 4 -->
        <div class="flex flex-col items-center group">
            <div class="w-full aspect-[2/3] bg-slate-800 rounded-lg shadow-lg border border-slate-700 flex flex-col justify-center items-center text-center p-3 relative overflow-hidden group-hover:border-rose-500 transition-colors">
                <i class="fa-solid fa-network-wired text-3xl text-slate-600 mb-2 group-hover:text-rose-400 transition-colors"></i>
                <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider group-hover:text-rose-300 transition-colors">Libro 4</span>
                <span class="text-[10px] text-slate-400 mt-1 leading-tight">Recablee su Mente</span>
            </div>
        </div>
    </div>
</div><br/>`;
            if (!pillar.realExample.includes("Colección: 4 Libros en 1")) {
                pillar.realExample = placeholder_html + pillar.realExample;
            }
        }
    }

    // 2. Modify interactive challenges
    data.modules.forEach((module, m_idx) => {
        module.keyPillars.forEach((pillar, p_idx) => {
            if (pillar.interactiveChallenge) {
                pillar.interactiveChallenge = generate_real_questions(m_idx + p_idx, module.title);
            }
        });
    });

    // 3. Add REAL flashcards if this is _data.js
    if (var_name === "LIBROS_DATA") {
        data.flashcards = [
            {
                "id": "fc1",
                "term": "La Tríada Oscura",
                "definition": "Concepto psicológico que agrupa tres rasgos de personalidad malévolos: Narcisismo, Maquiavelismo y Psicopatía.",
                "tacticalUse": "Los manipuladores la usan para racionalizar su abuso y falta de empatía al buscar sus objetivos.",
                "countermeasure": "Establecer límites estrictos; reconocer la falta de remordimiento y alejarse en lugar de intentar 'cambiarlos'."
            },
            {
                "id": "fc2",
                "term": "Gaslighting (Luz de Gas)",
                "definition": "Táctica de manipulación donde el abusador hace que la víctima dude de su propia memoria, percepción o cordura.",
                "tacticalUse": "Negar eventos que ocurrieron ('Eso nunca pasó') o cambiar la narrativa para invalidar los sentimientos de la víctima.",
                "countermeasure": "Llevar un registro escrito de los hechos, confiar en la propia intuición y no discutir la realidad con el abusador."
            },
            {
                "id": "fc3",
                "term": "Bombardeo de Amor (Love Bombing)",
                "definition": "Demostraciones excesivas y prematuras de atención, afecto y regalos al inicio de una relación para crear dependencia.",
                "tacticalUse": "Se usa para bajar las defensas de la víctima y aislarla de su círculo de apoyo al hacerla sentir 'única' y 'especial'.",
                "countermeasure": "Ralentizar la relación. Exigir espacio y evaluar si el afecto es proporcional al tiempo de conocerse."
            },
            {
                "id": "fc4",
                "term": "Técnica del Espejo (Mirroring)",
                "definition": "Imitar sutilmente el lenguaje corporal, tono de voz o palabras de otra persona para generar simpatía inconsciente.",
                "tacticalUse": "Crear un falso sentido de familiaridad y confianza rápida (Rapport) para que la persona baje sus defensas.",
                "countermeasure": "Hacer un movimiento inusual de forma deliberada y observar si el interlocutor lo copia instintivamente."
            },
            {
                "id": "fc5",
                "term": "Neuro-Linguistic Programming (PNL)",
                "definition": "Enfoque que afirma la conexión entre procesos neurológicos, lenguaje y patrones de comportamiento para influir en la mente.",
                "tacticalUse": "Uso de 'anclajes' emocionales o lenguaje sugestivo (órdenes incrustadas) para guiar decisiones sin que la persona lo note.",
                "countermeasure": "Prestar atención a los cambios bruscos de estado emocional y cuestionar las sugerencias lógicas detrás de los mensajes."
            }
        ];

        data.caseScenarios = [
            {
                "id": "cs1",
                "category": "Manipulación en el Trabajo",
                "title": "El Jefe Maquiavélico",
                "difficulty": "Alta",
                "badge": "Psicología Oscura",
                "scenarioDescription": "Tu jefe te asigna constantemente el trabajo de otros, pero en las reuniones de equipo afirma que 'todos debemos colaborar'. Cuando te quejas en privado, él niega haberte sobrecargado y te acusa de no tener 'espíritu de equipo'. ¿Qué técnica está usando y cómo respondes?",
                "options": [
                    {
                        "id": "opt1",
                        "text": "Es Gaslighting. Documento todas las asignaciones por correo y respondo asertivamente con pruebas en público.",
                        "outcome": "Éxito",
                        "wisdomScore": 100,
                        "analysis": "Identificaste correctamente el gaslighting (negar la realidad) y la manipulación de la culpa. Documentar es tu mejor defensa objetiva.",
                        "bookInsight": "El maquiavelismo prospera en la ambigüedad. La documentación destruye su coartada."
                    },
                    {
                        "id": "opt2",
                        "text": "Es Bombardeo de Amor. Le agradezco la oportunidad de demostrar mi valor trabajando más duro.",
                        "outcome": "Fallo",
                        "wisdomScore": 10,
                        "analysis": "No es bombardeo de amor, es explotación. Estás validando su abuso y fomentando más sobrecarga laboral.",
                        "bookInsight": "Ceder ante la manipulación de la culpa solo refuerza el condicionamiento del manipulador."
                    }
                ]
            }
        ];
    }

    const new_content = `const ${var_name} = ${JSON.stringify(data, null, 2)};\n`;
    fs.writeFileSync(filepath, new_content, 'utf-8');
    console.log(`Éxito actualizando ${filepath}`);
}

const base_dir = path.join(__dirname, '..', 'js', 'books');
const prefix = 'psicologia-oscura-4-en-1-este-libro-incluye-secretos-de-la-psicologia-oscura-lectura-rapida-de-perso';

const data_file = path.join(base_dir, `${prefix}_data.js`);
const content_file = path.join(base_dir, `${prefix}_content.js`);

if (fs.existsSync(data_file)) {
    populate_book(data_file, "LIBROS_DATA");
} else {
    console.log(`Data file not found: ${data_file}`);
}

if (fs.existsSync(content_file)) {
    populate_book(content_file, "BOOK_CONTENT");
} else {
    console.log(`Content file not found: ${content_file}`);
}
