const fs = require('fs');
const path = require('path');
const vm = require('vm');

function getBookCountFromFilename(filename) {
    const match = filename.match(/(\d+)-en-1/);
    if (match) {
        return parseInt(match[1]);
    }
    return 1;
}

function getPlaceholdersHTML(bookCount) {
    if (bookCount === 1) {
        return `<br/><br/>
<div class="my-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex flex-col items-center">
    <h4 class="text-indigo-400 font-bold mb-4 flex items-center gap-2">
        <i class="fa-solid fa-book"></i> Portada del Libro
    </h4>
    <div class="w-48 aspect-[2/3] bg-slate-800 rounded-lg shadow-lg border border-slate-700 flex flex-col justify-center items-center text-center p-3 relative overflow-hidden">
        <i class="fa-solid fa-image text-4xl text-slate-600 mb-2"></i>
        <span class="text-sm text-slate-500 font-semibold uppercase tracking-wider">Portada</span>
    </div>
</div><br/>`;
    }

    // Grid for multiple books
    let html = `<br/><br/>
<div class="my-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
    <h4 class="text-indigo-400 font-bold mb-4 flex items-center gap-2">
        <i class="fa-solid fa-layer-group"></i> Colección: ${bookCount} Libros en 1
    </h4>
    <p class="text-slate-300 text-sm mb-4">Esta edición especial contiene ${bookCount} obras completas. A continuación puedes ver los títulos incluidos:</p>
    <div class="grid grid-cols-2 md:grid-cols-${Math.min(bookCount, 4)} gap-4">`;

    const colors = ['indigo', 'emerald', 'amber', 'rose', 'cyan', 'fuchsia'];
    const icons = ['fa-book-skull', 'fa-eye', 'fa-brain', 'fa-network-wired', 'fa-bolt', 'fa-compass'];

    for (let i = 0; i < bookCount; i++) {
        const color = colors[i % colors.length];
        const icon = icons[i % icons.length];
        
        html += `
        <div class="flex flex-col items-center group">
            <div class="w-full aspect-[2/3] bg-slate-800 rounded-lg shadow-lg border border-slate-700 flex flex-col justify-center items-center text-center p-3 relative overflow-hidden group-hover:border-${color}-500 transition-colors">
                <i class="fa-solid ${icon} text-3xl text-slate-600 mb-2 group-hover:text-${color}-400 transition-colors"></i>
                <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider group-hover:text-${color}-300 transition-colors">Libro ${i+1}</span>
            </div>
        </div>`;
    }

    html += `
    </div>
</div><br/>`;
    return html;
}

function generate_generic_question(moduleTitle, index) {
    // Escapar comillas dobles en el título para no romper JSON ni renderizado
    const safeTitle = (moduleTitle || 'este tema').replace(/"/g, "'");
    
    const questions = [
        {
            "question": `¿Cuál es el concepto central que se discute en "${safeTitle}"?`,
            "options": [
                {"text": "Reflexionar sobre las estrategias mencionadas", "isCorrect": true, "feedback": "¡Correcto! Es fundamental asimilar las estrategias de esta sección."},
                {"text": "Memorizar fechas históricas", "isCorrect": false, "feedback": "Este libro se enfoca más en conceptos prácticos que en historia."},
                {"text": "Ignorar los factores externos", "isCorrect": false, "feedback": "Los factores externos siempre deben tenerse en cuenta."},
                {"text": "Actuar sin pensar", "isCorrect": false, "feedback": "Siempre se recomienda planificación y análisis previo."}
            ]
        },
        {
            "question": `De acuerdo a lo presentado en "${safeTitle}", ¿qué acción inicial se recomienda?`,
            "options": [
                {"text": "Analizar la situación con detenimiento", "isCorrect": true, "feedback": "¡Excelente! El análisis es el primer paso vital."},
                {"text": "Tomar decisiones impulsivas", "isCorrect": false, "feedback": "La impulsividad rara vez es la respuesta correcta en este contexto."},
                {"text": "Delegar la responsabilidad inmediatamente", "isCorrect": false, "feedback": "Debes asumir el control antes de delegar."},
                {"text": "Esperar a que el problema se resuelva solo", "isCorrect": false, "feedback": "La proactividad es clave aquí."}
            ]
        }
    ];
    return questions[index % questions.length];
}

function populate_file(filepath) {
    const filename = path.basename(filepath);
    
    // Skip the one we already perfectly did
    if (filename.includes('psicologia-oscura-4-en-1-este-libro-incluye-secretos-de-la-psicologia-oscura-lectura-rapida-de-perso')) {
        return;
    }

    const var_name = filename.endsWith('_data.js') ? 'LIBROS_DATA' : 'BOOK_CONTENT';
    
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Convert const to global for eval
    let modifiedContent = content.replace(`const ${var_name} =`, `${var_name} =`);
    
    const sandbox = {};
    vm.createContext(sandbox);
    try {
        vm.runInContext(modifiedContent, sandbox);
    } catch (e) {
        console.log(`[!] SyntaxError eval JSON en ${filename}: ${e.message}`);
        return;
    }
    
    let data = sandbox[var_name];
    if (!data) return;

    let modified = false;

    // 1. Placeholders
    const bookCount = getBookCountFromFilename(filename);
    if (data.modules && data.modules.length > 0) {
        const first_mod = data.modules[0];
        if (first_mod.keyPillars && first_mod.keyPillars.length > 0) {
            const pillar = first_mod.keyPillars[0];
            if (!pillar.realExample.includes("Portada del Libro") && !pillar.realExample.includes("Colección:")) {
                const placeholder_html = getPlaceholdersHTML(bookCount);
                pillar.realExample = placeholder_html + pillar.realExample;
                modified = true;
            }
        }
    }

    // 2. Interactive Challenges
    if (data.modules) {
        data.modules.forEach((module, m_idx) => {
            if (module.keyPillars) {
                module.keyPillars.forEach((pillar, p_idx) => {
                    if (pillar.interactiveChallenge) {
                        // Check if it's the old dummy question
                        if (pillar.interactiveChallenge.question && pillar.interactiveChallenge.question.includes("lección principal de esta lectura")) {
                            pillar.interactiveChallenge = generate_generic_question(module.title, m_idx + p_idx);
                            modified = true;
                        }
                    }
                });
            }
        });
    }

    // 3. Flashcards and Scenarios (Only for _data.js)
    if (var_name === "LIBROS_DATA") {
        if (!data.flashcards || data.flashcards.length === 0 || data.flashcards[0].term.includes("Dummy")) {
            data.flashcards = [
                {
                    "id": "fc1",
                    "term": "Análisis Contextual",
                    "definition": "La habilidad de observar el entorno y las variables antes de tomar una decisión importante basada en este libro.",
                    "tacticalUse": "Permite reducir el margen de error y anticipar problemas.",
                    "countermeasure": "Evitar la 'parálisis por análisis', estableciendo tiempos límite para la toma de decisiones."
                },
                {
                    "id": "fc2",
                    "term": "Implementación Práctica",
                    "definition": "Llevar la teoría leída a acciones concretas en la rutina diaria.",
                    "tacticalUse": "Fija el conocimiento a largo plazo mediante repetición y experiencia.",
                    "countermeasure": "No desanimarse por los fracasos iniciales, que son parte del proceso de aprendizaje."
                }
            ];
            modified = true;
        }

        if (!data.caseScenarios || data.caseScenarios.length === 0 || data.caseScenarios[0].title.includes("Dummy")) {
            data.caseScenarios = [
                {
                    "id": "cs1",
                    "category": "Aplicación Práctica",
                    "title": "El Desafío de Implementación",
                    "difficulty": "Media",
                    "badge": "Lector Estratégico",
                    "scenarioDescription": "Después de finalizar el libro, te encuentras con resistencia en tu entorno para aplicar lo aprendido. Algunas personas cuestionan tus nuevos métodos. ¿Cómo respondes?",
                    "options": [
                        {
                            "id": "opt1",
                            "text": "Aplico los cambios de forma gradual, demostrando resultados con el tiempo en lugar de discutir la teoría.",
                            "outcome": "Éxito",
                            "wisdomScore": 100,
                            "analysis": "¡Correcto! Demostrar el valor a través de la acción es mucho más efectivo que tratar de convencer con palabras.",
                            "bookInsight": "Los resultados hablan más fuerte que las intenciones. Lidera con el ejemplo."
                        },
                        {
                            "id": "opt2",
                            "text": "Trato de convencer a todos de que mis nuevos métodos son la única forma correcta de hacer las cosas.",
                            "outcome": "Fallo",
                            "wisdomScore": 20,
                            "analysis": "Esto genera fricción y defensividad en los demás. Imponer ideas rara vez funciona.",
                            "bookInsight": "La persuasión efectiva requiere paciencia y tacto, no fuerza bruta."
                        }
                    ]
                }
            ];
            modified = true;
        }
    }

    if (modified) {
        const new_content = `const ${var_name} = ${JSON.stringify(data, null, 2)};\n`;
        fs.writeFileSync(filepath, new_content, 'utf-8');
        console.log(`[+] Actualizado: ${filename}`);
    }
}

const base_dir = path.join(__dirname, '..', 'js', 'books');

const files = fs.readdirSync(base_dir);
let processed = 0;

for (const file of files) {
    if (file.endsWith('_data.js') || file.endsWith('_content.js')) {
        populate_file(path.join(base_dir, file));
        processed++;
    }
}

console.log(`\nProceso por lotes completado. Archivos revisados: ${processed}`);
