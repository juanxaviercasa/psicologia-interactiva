import os
import json
import re

MD_DIR = 'Psicologia_Oscura'
BOOK_JS = 'js/book_content.js'
DATA_JS = 'js/data_libros.js'
APP_JS = 'js/app.js'
HTML_FILE = 'index.html'

print("=== STEP 1: Compiling all 76 chapters into book_content.js ===")
md_files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
md_files.sort()

book_dict = {}
for f in md_files:
    path = os.path.join(MD_DIR, f)
    with open(path, 'r', encoding='utf-8') as fh:
        # Strip extension for clean key
        key = f.replace('.md', '')
        book_dict[key] = fh.read()

# Export as both var and window property for 100% universal browser accessibility
js_code = "var BOOK_CONTENT = " + json.dumps(book_dict, ensure_ascii=False) + ";\nwindow.BOOK_CONTENT = BOOK_CONTENT;\n"
with open(BOOK_JS, 'w', encoding='utf-8') as f:
    f.write(js_code)
print(f"Compiled {len(book_dict)} chapters into {BOOK_JS} successfully.")

print("\n=== STEP 2: Defining Exact Module-Pillar Chapter Mappings ===")
# Exact thematic mappings based on book chapters
mappings = {
    # Modulo 1: Fundamentos de la Mente e Historia (1-22)
    "m1_p0": ["Tema_01_P____SICOLOGIA_OSCURA", "Tema_02_Introduction", "Tema_03_El_Antiguo_Pensamiento_Psicolo", "Tema_04_El_papiro_de_Edwin_Smith"],
    "m1_p1": ["Tema_05_Describa", "Tema_06_Explique", "Tema_07_Predecir", "Tema_08_Cambier", "Tema_09_La_Perspectiva_Cognitiva", "Tema_10_La_Perspectiva_Humanista"],
    "m1_p2": ["Tema_11_Conciencia_de_si_mismo", "Tema_12_Autoregulacion", "Tema_13_Las_Emociones_Universales"],
    "m1_p3": ["Tema_14_Capitulo_5__Gestion_de_los_Pen", "Tema_15_Gestionar_los_Pensamientos_y_l", "Tema_16_Afirmaciones", "Tema_17_Regulacion_Emotional", "Tema_18_Metodo_de_puesta_a_tierra", "Tema_19_Respiracion_profunda", "Tema_20_El_Problema_de_la_Procrastinac", "Tema_21_Sobornos", "Tema_22_Conclusion"],
    
    # Modulo 2: Cómo Analizar a las Personas (23-30)
    "m2_p0": ["Tema_23_Introduction", "Tema_24_Apertura", "Tema_25_Conciencia"],
    "m2_p1": ["Tema_26_Haptica"],
    "m2_p2": ["Tema_27_Ejemplo_2__Ventas_con_Persuasi", "Tema_28_Ejempllo_3__Manipulacion_Emoti"],
    "m2_p3": ["Tema_29_Senales_de_Manipulacion", "Tema_30_Conclusion"],
    
    # Modulo 3: Manipulación y Control Mental (31-40)
    "m3_p0": ["Tema_31_Introduction", "Tema_32_El_Proceso_de_Manipulacion"],
    "m3_p1": ["Tema_33_Ethos", "Tema_34_Pathos", "Tema_35_Logos"],
    "m3_p2": ["Tema_36_Palabras_Cargadas", "Tema_37_Anclaje"],
    "m3_p3": ["Tema_38_Disociacion", "Tema_39_Reccuadre_de_Contentos", "Tema_40_Conclusion"],
    
    # Modulo 4: Secretos de la Psicología Oscura y Persuasión PNL (41-47)
    "m4_p0": ["Tema_41_Introduction", "Tema_42_Reconocer_al_Manipulador"],
    "m4_p1": ["Tema_43_Principios_de_la_Persuasion"],
    "m4_p2": ["Tema_44_Ethos", "Tema_45_Pathos"],
    "m4_p3": ["Tema_46_PNL_y_Ritmo_y_Liderazgo", "Tema_47_Conclusion"],
    
    # Modulo 5: Inteligencia Emocional y TCC (48-59)
    "m5_p0": ["Tema_48_Introduction", "Tema_49_La_Historia_de_la_Inteligencia", "Tema_50_Como_Funciona_la_TCC", "Tema_51_Por_que_se_Utiliza_la_TCC"],
    "m5_p1": ["Tema_52_Entender_la_Terapia_Conductual", "Tema_53_Cuando_la_Terapia_Cognitiva_y_"],
    "m5_p2": ["Tema_54_TCC_y_Anisiedad", "Tema_55_Exposicion_Graduada", "Tema_56_Juegos_de_Rol__Que_pasa_si"],
    "m5_p3": ["Tema_57_Aproximacion_Sucesiva", "Tema_58_Programacion_de_Actividades", "Tema_59_Conclusion"],
    
    # Modulo 6: Recuperación del Abuso Emocional y Narcisista (60-76)
    "m6_p0": ["Tema_60_Introduction", "Tema_61_Abuso_sexual", "Tema_62_Abuso_espiritual", "Tema_63_Abuso_narcisista"],
    "m6_p1": ["Tema_64_Perdonate_a_ti_Mismo", "Tema_65_Reclama_tu_Narrativa", "Tema_66_El_Narcisista", "Tema_67_DARVO_y_el_Narcisista"],
    "m6_p2": ["Tema_68_Perder_la_Confianza_en_uno_Mis", "Tema_69_Problemas_de_Salud_Mental"],
    "m6_p3": ["Tema_70_Cortar_el_Contacto_por_Complet", "Tema_71_Convirette_en_la_Roca_Gris", "Tema_72_Buscar_Apoyo", "Tema_73_Escriba_sus_Razones_para_Irse", "Tema_74_Inteligencia_Emocional", "Tema_75_Afirmaciones", "Tema_76_Conclusion"]
}

# Verify total coverage
all_mapped = []
for k, v in mappings.items():
    all_mapped.extend(v)
print(f"Total mapped chapters: {len(all_mapped)} out of {len(md_files)}")
assert len(all_mapped) == len(md_files), "Some chapters were missed in mapping!"

print("\n=== STEP 3: Updating data_libros.js with precise mappings ===")
with open(DATA_JS, 'r', encoding='utf-8') as f:
    data_content = f.read()

# First, remove existing chapters: [...] properties to avoid duplication
clean_data = re.sub(r'chapters:\s*\[[^\]]*\],\s*', '', data_content)

# Now inject new chapters before deepDive: for each of the 24 pillars
matches = list(re.finditer(r"(deepDive:)", clean_data))
if len(matches) == 24:
    ordered_keys = [
        "m1_p0", "m1_p1", "m1_p2", "m1_p3",
        "m2_p0", "m2_p1", "m2_p2", "m2_p3",
        "m3_p0", "m3_p1", "m3_p2", "m3_p3",
        "m4_p0", "m4_p1", "m4_p2", "m4_p3",
        "m5_p0", "m5_p1", "m5_p2", "m5_p3",
        "m6_p0", "m6_p1", "m6_p2", "m6_p3"
    ]
    
    new_data_content = ""
    last_end = 0
    for i, match in enumerate(matches):
        key = ordered_keys[i]
        ch_list = mappings[key]
        injection = f"chapters: {json.dumps(ch_list)},\n          "
        new_data_content += clean_data[last_end:match.start()] + injection
        last_end = match.start()
    new_data_content += clean_data[last_end:]
    
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(new_data_content)
    print("data_libros.js updated successfully with 24 precise chapter groups!")
else:
    print(f"Error: Found {len(matches)} deepDives in data_libros.js")

print("\n=== STEP 4: Updating index.html (Typography + Header Buttons + Scripts) ===")
with open(HTML_FILE, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Ensure Tailwind has typography plugin
if 'cdn.tailwindcss.com' in html and 'plugins=typography' not in html:
    html = html.replace('https://cdn.tailwindcss.com', 'https://cdn.tailwindcss.com?plugins=typography')
    print("Added Tailwind Typography plugin")

# 2. Add Bases Científicas and Modo Dios prominently in header
# Target: right after theme toggle button
theme_btn_target = '<button onclick="App.toggleTheme()"'
if theme_btn_target in html and 'id="headerGodModeBtn"' not in html:
    # Find the end of themeToggleBtn </button>
    idx = html.find(theme_btn_target)
    btn_end = html.find('</button>', idx) + len('</button>')
    
    header_buttons = '''
          <!-- BOTÓN BASES CIENTÍFICAS (AYUDA) -->
          <button onclick="document.getElementById('methodologyModal').classList.remove('hidden')" id="headerMethodologyBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/90 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900/60 hover:border-cyan-400 shadow-sm transition-all cursor-pointer font-bold text-xs" title="¿Por qué está bloqueado el contenido?">
            <i class="fa-solid fa-microscope text-cyan-400"></i>
            <span class="hidden md:inline">Bases Científicas</span>
          </button>

          <!-- BOTÓN MODO DIOS -->
          <button onclick="App.unlockAll()" id="headerGodModeBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/90 text-amber-400 border border-amber-500/50 hover:bg-amber-900/60 hover:border-amber-400 shadow-sm transition-all cursor-pointer font-bold text-xs" title="Desbloquear todo el contenido">
            <i class="fa-solid fa-unlock-keyhole text-amber-400"></i>
            <span class="hidden md:inline">Modo Dios</span>
          </button>'''
    
    html = html[:btn_end] + header_buttons + html[btn_end:]
    print("Injected Bases Científicas and Modo Dios buttons into top header")

# 3. Ensure methodology modal is present
if 'id="methodologyModal"' not in html:
    modal_code = '''
  <!-- METHODOLOGY / HELP MODAL -->
  <div id="methodologyModal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md">
    <div class="bg-slate-900 border-2 border-cyan-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.25)] relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <!-- Header -->
      <div class="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 sticky top-0 z-10">
        <h2 class="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 flex items-center gap-3">
          <i class="fa-solid fa-microscope text-cyan-400"></i> ¿Por qué el contenido está bloqueado?
        </h2>
        <button onclick="document.getElementById('methodologyModal').classList.add('hidden')" class="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-500 transition-colors flex items-center justify-center">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6 overflow-y-auto custom-scrollbar text-slate-300 space-y-6">
        <p class="text-base text-slate-200">
          La restricción de acceso secuencial (<em>Sequential Gating</em>) en esta plataforma no es un error, sino una <strong>decisión pedagógica deliberada basada en tres principios neurocientíficos</strong> para garantizar la máxima retención y aplicación del material.
        </p>

        <div class="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 border-l-4 border-l-cyan-500">
          <h3 class="text-cyan-400 font-bold mb-2 flex items-center gap-2"><i class="fa-solid fa-brain"></i> 1. Teoría de la Carga Cognitiva (John Sweller, 1988)</h3>
          <p class="text-sm leading-relaxed">
            El cerebro humano tiene una memoria de trabajo limitada. Presentar los 6 libros y los 76 capítulos al mismo tiempo genera <strong>sobrecarga cognitiva</strong> y "parálisis por análisis". El bloqueo fuerza el procesamiento por bloques (<em>chunking</em>), reduciendo la ansiedad y permitiendo interiorizar cada técnica antes de avanzar a la siguiente.
          </p>
        </div>

        <div class="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 border-l-4 border-l-rose-500">
          <h3 class="text-rose-400 font-bold mb-2 flex items-center gap-2"><i class="fa-solid fa-lock"></i> 2. Efecto Zeigarnik y Recompensa Dopaminérgica</h3>
          <p class="text-sm leading-relaxed">
            La psiquiatra Bluma Zeigarnik demostró que <strong>el cerebro recuerda con más fuerza las tareas incompletas</strong>. Ver el siguiente módulo bloqueado genera una tensión psicológica y curiosidad naturales. Al completar la fase actual y "desbloquear" la siguiente, el sistema de recompensa cerebral libera <strong>dopamina</strong>, fijando el hábito de estudio.
          </p>
        </div>

        <div class="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 border-l-4 border-l-emerald-500">
          <h3 class="text-emerald-400 font-bold mb-2 flex items-center gap-2"><i class="fa-solid fa-layer-group"></i> 3. Andamiaje Estructural (Lev Vygotsky)</h3>
          <p class="text-sm leading-relaxed">
            El aprendizaje de la psicología estratégica es estrictamente acumulativo. Es imposible aplicar con éxito las defensas contra el <em>Control Coercitivo</em> (Fase 6) si primero no se comprenden los sesgos del Sistema 1 y la amígdala (Fase 1).
          </p>
        </div>

        <div class="p-5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-center">
          <h4 class="text-amber-400 font-bold text-sm mb-2 flex items-center justify-center gap-2"><i class="fa-solid fa-unlock-keyhole"></i> ¿Prefieres exploración libre?</h4>
          <p class="text-xs text-amber-200/80 mb-3">
            Si eres un auditor, revisor o prefieres estudiar en formato "mundo abierto", puedes romper todos los candados con un solo clic.
          </p>
          <button onclick="document.getElementById('methodologyModal').classList.add('hidden'); App.unlockAll();" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
            <i class="fa-solid fa-bolt mr-1"></i> Activar Modo Dios (Desbloquear Todo)
          </button>
        </div>
      </div>
    </div>
  </div>'''
  
    scripts_target = '<!-- Scripts Neural OS -->'
    if scripts_target in html:
        html = html.replace(scripts_target, modal_code + '\n  ' + scripts_target)
        print("Injected methodologyModal before scripts")

with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html updated successfully!")

print("\n=== STEP 5: Updating app.js (Universal Markdown Lookup & Clean Rendering) ===")
with open(APP_JS, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Replace the Extended Reading Chapters injection with a completely bulletproof renderer
old_ch_pattern = re.search(r'// Append Extended Reading Chapters[\s\S]*?contentHtml \+= chaptersHtml;\s*\}', app_js)

new_ch_code = '''// Append Extended Reading Chapters
    if (pillar.chapters && pillar.chapters.length > 0) {
      const bookStore = (typeof BOOK_CONTENT !== 'undefined' ? BOOK_CONTENT : null) || (typeof window !== 'undefined' ? window.BOOK_CONTENT : null) || {};
      
      let chaptersHtml = `
        <div class="lg:col-span-2 mt-8">
          <div class="text-[12px] text-cyan-400 font-bold font-mono tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (TEXTO COMPLETO ORIGINAL)
          </div>
          <div class="space-y-4">
      `;
      
      pillar.chapters.forEach((chapterName, idx) => {
         const rawMd = bookStore[chapterName] || 'Contenido del capítulo no disponible.';
         
         // Parse markdown safely
         let parsedHtml = '';
         if (typeof marked !== 'undefined') {
            parsedHtml = typeof marked.parse === 'function' ? marked.parse(rawMd) : marked(rawMd);
         } else {
            parsedHtml = '<div class="whitespace-pre-wrap text-slate-300 font-sans leading-relaxed text-sm">' + rawMd + '</div>';
         }
         
         const cleanTitle = chapterName.replace(/_/g, ' ').replace(/^Tema\s*\d+\s*/i, '').trim();
         
         chaptersHtml += `
           <div class="bg-slate-900/90 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
             <div class="bg-slate-800/90 hover:bg-slate-700/80 px-6 py-4 border-b border-slate-700/60 flex justify-between items-center cursor-pointer transition-colors" onclick="const p = this.nextElementSibling; p.classList.toggle('hidden'); this.querySelector('.fa-chevron-down').classList.toggle('rotate-180');">
               <div class="flex items-center gap-3">
                 <span class="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">${idx + 1}</span>
                 <span class="font-bold text-slate-100 font-serif text-base">${cleanTitle || chapterName}</span>
               </div>
               <i class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300"></i>
             </div>
             <div class="hidden p-6 sm:p-8 prose prose-invert prose-cyan max-w-none prose-headings:font-serif prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-cyan-300 bg-[#090e17]/80">
               ${parsedHtml}
             </div>
           </div>
         `;
      });
      chaptersHtml += `</div></div>`;
      contentHtml += chaptersHtml;
    }'''

if old_ch_pattern:
    app_js = app_js[:old_ch_pattern.start()] + new_ch_code + app_js[old_ch_pattern.end():]
    print("Replaced chapter renderer with bulletproof version in app.js")

# Ensure unlockAll is properly defined and functional
if 'unlockAll()' in app_js:
    print("unlockAll function already present in app.js")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(app_js)
print("app.js updated successfully!")
