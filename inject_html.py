import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

laboratory_html = """
  <!-- VISTA: LABORATORIO TÁCTICO (PHASE 1 & 2) -->
  <section id="view-laboratory" class="hidden space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
    
    <div class="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 to-indigo-950/20">
      <h2 class="text-2xl font-bold text-white flex items-center gap-2">
        <i class="fa-solid fa-flask text-indigo-400"></i> Laboratorio Táctico Interactivo
      </h2>
      <p class="text-sm text-slate-400 mt-2">Pon a prueba los conceptos con modelos matemáticos, simuladores ramificados y mapas de calor.</p>
    </div>

    <!-- PESTAÑAS INTERNAS DEL LABORATORIO -->
    <div class="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button onclick="Lab.switchSubTab('math')" id="lab-tab-math" class="px-4 py-2 bg-indigo-900/50 text-indigo-300 rounded-lg text-sm font-bold border border-indigo-500/30 whitespace-nowrap"><i class="fa-solid fa-chart-pie"></i> Modelos Matemáticos</button>
        <button onclick="Lab.switchSubTab('sim')" id="lab-tab-sim" class="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-lg text-sm font-bold whitespace-nowrap"><i class="fa-solid fa-code-branch"></i> Simulador Drag & Drop</button>
        <button onclick="Lab.switchSubTab('hotspot')" id="lab-tab-hotspot" class="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-lg text-sm font-bold whitespace-nowrap"><i class="fa-solid fa-fire"></i> Mapas de Calor</button>
        <button onclick="Lab.switchSubTab('media')" id="lab-tab-media" class="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-lg text-sm font-bold whitespace-nowrap"><i class="fa-solid fa-photo-film"></i> Diccionario Multimedia</button>
    </div>

    <!-- SUB-VIEW: MATH MODELS (PHASE 1) -->
    <div id="lab-math" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Reatribución de Culpa -->
            <div class="glass-card p-6 rounded-2xl border border-slate-800">
                <h3 class="text-lg font-bold text-slate-200 mb-2"><i class="fa-solid fa-chart-pie text-emerald-400"></i> Reatribución Matemática de la Culpa</h3>
                <p class="text-xs text-slate-400 mb-4">Ingresa los factores de una situación donde te sientes culpable. Ajusta los pesos para ver tu responsabilidad real (idealmente < 10%).</p>
                <div class="flex flex-col md:flex-row gap-6 items-center">
                    <div class="w-full md:w-1/2 space-y-3" id="culpa-factors-container">
                        <!-- Factors dynamically added here -->
                    </div>
                    <div class="w-full md:w-1/2 flex justify-center">
                        <div class="w-48 h-48 relative">
                            <canvas id="culpaChart"></canvas>
                            <div class="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span class="text-2xl font-bold text-emerald-400" id="culpa-tu-porcentaje">100%</span>
                                <span class="text-[10px] text-slate-400 uppercase">Tu Culpa</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button onclick="Lab.addCulpaFactor()" class="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300"><i class="fa-solid fa-plus"></i> Añadir Factor Externo</button>
            </div>

            <!-- Analizador Tríada Oscura -->
            <div class="glass-card p-6 rounded-2xl border border-slate-800">
                <h3 class="text-lg font-bold text-slate-200 mb-2"><i class="fa-solid fa-spider text-rose-400"></i> Analizador de Tríada Oscura</h3>
                <p class="text-xs text-slate-400 mb-4">Evalúa a una persona respondiendo 3 preguntas clave. El radar mostrará su peligrosidad psicológica.</p>
                <div class="flex flex-col md:flex-row gap-6 items-center">
                    <div class="w-full md:w-1/2 space-y-4">
                        <div>
                            <label class="text-xs font-bold text-slate-400 block mb-1">Narcisismo (Necesidad de admiración)</label>
                            <input type="range" id="radar-narc" min="0" max="100" value="20" class="w-full accent-rose-500" oninput="Lab.updateRadar()">
                        </div>
                        <div>
                            <label class="text-xs font-bold text-slate-400 block mb-1">Maquiavelismo (Manipulación estratégica)</label>
                            <input type="range" id="radar-maq" min="0" max="100" value="20" class="w-full accent-purple-500" oninput="Lab.updateRadar()">
                        </div>
                        <div>
                            <label class="text-xs font-bold text-slate-400 block mb-1">Psicopatía (Cero empatía/remordimiento)</label>
                            <input type="range" id="radar-psi" min="0" max="100" value="20" class="w-full accent-slate-500" oninput="Lab.updateRadar()">
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 flex justify-center">
                        <div class="w-56 h-56">
                            <canvas id="triadaChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Termómetro de Tensión -->
            <div class="glass-card p-6 rounded-2xl border border-slate-800 lg:col-span-2">
                <h3 class="text-lg font-bold text-slate-200 mb-2"><i class="fa-solid fa-temperature-half text-amber-400"></i> Termómetro de Tensión (Cortisol)</h3>
                <p class="text-xs text-slate-400 mb-4">Simula una conversación y observa cómo los "Gestos Pacificadores" o las "Tácticas Agresivas" alteran la bioquímica en tiempo real.</p>
                <div class="flex flex-col md:flex-row items-center gap-8">
                    <div class="w-full md:w-2/3">
                        <div class="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                            <button onclick="Lab.addTension(20)" class="px-3 py-1.5 bg-rose-950/40 text-rose-400 border border-rose-500/30 rounded text-xs font-bold whitespace-nowrap"><i class="fa-solid fa-bolt"></i> Ataque Pasivo-Agresivo (+20)</button>
                            <button onclick="Lab.addTension(40)" class="px-3 py-1.5 bg-rose-900/60 text-rose-300 border border-rose-500/50 rounded text-xs font-bold whitespace-nowrap"><i class="fa-solid fa-biohazard"></i> Gaslighting Directo (+40)</button>
                            <button onclick="Lab.addTension(-25)" class="px-3 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold whitespace-nowrap"><i class="fa-solid fa-hand-holding-heart"></i> Gesto Pacificador (-25)</button>
                        </div>
                        <div class="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
                            <div id="tension-bar" class="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 w-[10%] transition-all duration-500"></div>
                        </div>
                        <div class="mt-2 text-center text-xs font-mono text-slate-400" id="tension-text">Estado: Calma Límbica (10%)</div>
                    </div>
                    <div class="w-full md:w-1/3 flex justify-center">
                        <div class="w-32 h-32 relative">
                            <canvas id="tensionChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- SUB-VIEW: DRAG & DROP SIMULATOR (PHASE 2) -->
    <div id="lab-sim" class="hidden space-y-6">
        <div class="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 class="text-lg font-bold text-slate-200 mb-2"><i class="fa-solid fa-shield-halved text-emerald-400"></i> Constructor de Escudos (Drag & Drop)</h3>
            <p class="text-xs text-slate-400 mb-6">Arma tu respuesta frente a este ataque arrastrando los bloques correctos al escudo. Evita justificarte.</p>
            
            <div class="bg-slate-900 p-4 rounded-xl border-l-4 border-rose-500 mb-6">
                <div class="text-xs text-rose-400 font-bold mb-1">Mensaje Tóxico (Jefe):</div>
                <p class="text-slate-300 italic">"Espero que puedas quedarte hasta las 9pm hoy, porque si no entregas esto a tiempo, todo el equipo va a quedar mal por tu culpa frente al cliente."</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Arsenal (Source) -->
                <div>
                    <h4 class="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Arsenal (Opciones)</h4>
                    <div id="dd-arsenal" class="space-y-2 min-h-[200px] bg-slate-900/50 p-3 rounded-xl border border-dashed border-slate-700">
                        <div class="bg-slate-800 p-3 rounded shadow cursor-move border border-slate-700 text-sm" data-type="bad">"¡No es mi culpa, me diste el trabajo tarde!"</div>
                        <div class="bg-slate-800 p-3 rounded shadow cursor-move border border-slate-700 text-sm" data-type="good">"Entiendo la urgencia del cliente."</div>
                        <div class="bg-slate-800 p-3 rounded shadow cursor-move border border-slate-700 text-sm" data-type="good">"Saldré a las 5pm como establece mi contrato."</div>
                        <div class="bg-slate-800 p-3 rounded shadow cursor-move border border-slate-700 text-sm" data-type="bad">"Por favor, entiéndeme, tengo un compromiso familiar hoy."</div>
                        <div class="bg-slate-800 p-3 rounded shadow cursor-move border border-slate-700 text-sm" data-type="good">"Dejaré avanzado lo máximo posible antes de irme."</div>
                    </div>
                </div>

                <!-- Shield (Target) -->
                <div>
                    <h4 class="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Tu Escudo de Respuesta</h4>
                    <div id="dd-shield" class="space-y-2 min-h-[200px] bg-emerald-950/10 p-3 rounded-xl border-2 border-dashed border-emerald-500/30 transition-all">
                        <!-- Items dropped here -->
                    </div>
                    <button onclick="Lab.checkDragDrop()" class="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg">Verificar Defensa</button>
                </div>
            </div>
            <div id="dd-feedback" class="mt-4 hidden p-4 rounded-xl text-sm font-bold text-center"></div>
        </div>
    </div>

    <!-- SUB-VIEW: HOTSPOTS (PHASE 2) -->
    <div id="lab-hotspot" class="hidden space-y-6">
        <div class="glass-card p-6 rounded-2xl border border-slate-800 text-center">
            <h3 class="text-lg font-bold text-slate-200 mb-2"><i class="fa-solid fa-eye text-cyan-400"></i> Mapas de Calor (Análisis de Gestos)</h3>
            <p class="text-xs text-slate-400 mb-6">Haz clic en la zona del cuerpo que revela la mentira o el estrés (basado en la Línea Base).</p>
            
            <div class="relative inline-block border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                <!-- Using Unsplash Placeholder -->
                <img src="https://picsum.photos/seed/psychology1/600/400" alt="Sujeto de Análisis" class="w-full max-w-[600px] opacity-70 hover:opacity-100 transition-opacity">
                
                <!-- Hotspots -->
                <div onclick="Lab.checkHotspot('ojos')" class="absolute top-[20%] left-[40%] w-12 h-8 rounded-full border-2 border-transparent hover:border-cyan-400 cursor-pointer bg-cyan-400/0 hover:bg-cyan-400/20 transition-all"></div>
                <div onclick="Lab.checkHotspot('cuello')" class="absolute top-[40%] left-[45%] w-10 h-10 rounded-full border-2 border-transparent hover:border-rose-400 cursor-pointer bg-rose-400/0 hover:bg-rose-400/20 transition-all"></div>
                <div onclick="Lab.checkHotspot('manos')" class="absolute top-[70%] left-[30%] w-16 h-16 rounded-full border-2 border-transparent hover:border-emerald-400 cursor-pointer bg-emerald-400/0 hover:bg-emerald-400/20 transition-all"></div>
            </div>
            <div id="hotspot-feedback" class="mt-6 text-sm font-bold h-10 flex items-center justify-center">Elige un área de investigación...</div>
        </div>
    </div>

    <!-- SUB-VIEW: MULTIMEDIA DICTIONARY (PHASE 3) -->
    <div id="lab-media" class="hidden space-y-6">
        <div class="glass-card p-6 rounded-2xl border border-slate-800">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h3 class="text-lg font-bold text-slate-200"><i class="fa-solid fa-photo-film text-pink-400"></i> Diccionario Multimedia (API Placeholder)</h3>
                    <p class="text-xs text-slate-400">Conexión lista para Giphy/Pexels API. Ilustra los gestos en movimiento.</p>
                </div>
                <div class="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono border border-slate-700">API_KEY = "PEXELS_PLACEHOLDER"</div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <!-- Mock API Results -->
                <div class="relative rounded-xl overflow-hidden group aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <img src="https://picsum.photos/seed/nervous/200/200" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div class="text-xs font-bold text-white">Toque de Cuello</div>
                        <div class="text-[9px] text-rose-300">Nervio Vago</div>
                    </div>
                </div>
                <div class="relative rounded-xl overflow-hidden group aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <img src="https://picsum.photos/seed/smile/200/200" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div class="text-xs font-bold text-white">Sonrisa Asimétrica</div>
                        <div class="text-[9px] text-rose-300">Desprecio</div>
                    </div>
                </div>
                <div class="relative rounded-xl overflow-hidden group aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <img src="https://picsum.photos/seed/crossed/200/200" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div class="text-xs font-bold text-white">Pies Desviados</div>
                        <div class="text-[9px] text-cyan-300">Deseo de Huida</div>
                    </div>
                </div>
                <div class="relative rounded-xl overflow-hidden group aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <img src="https://picsum.photos/seed/mirror/200/200" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div class="text-xs font-bold text-white">Espejeo Físico</div>
                        <div class="text-[9px] text-emerald-300">Rapport Subconsciente</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

  </section>
"""

# Insert view-laboratory right before view-auditor
content = content.replace('<section id="view-auditor"', laboratory_html + '\n  <section id="view-auditor"')

# Add tab button to navbar
tab_btn = """<button onclick="App.switchTab('laboratory'); closeMobileMenu()" id="tab-btn-laboratory" class="nav-tab px-3 py-2 md:py-1.5 rounded-lg text-sm md:text-xs font-semibold flex items-center gap-2 whitespace-nowrap text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
            <i class="fa-solid fa-flask"></i> Laboratorio
          </button>"""
content = content.replace('<!-- Grupo: Entrenamiento -->', '<!-- Grupo: Entrenamiento -->\n        <div class="flex flex-col md:flex-row gap-1 border-b border-slate-800/50 md:border-none pb-3 md:pb-0">\n          ' + tab_btn)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Laboratory HTML injected")
