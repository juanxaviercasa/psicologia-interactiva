/**
 * Laboratorio Táctico - Psicología Oscura 6 en 1
 * Contiene modelos matemáticos, simuladores drag&drop y herramientas interactivas.
 */

const Lab = {
    charts: {},
    tensionLevel: 10,
    culpaFactors: [
        { name: 'Mi error de cálculo', weight: 5 },
        { name: 'Falta de personal en la empresa', weight: 40 },
        { name: 'Instrucciones confusas del jefe', weight: 35 },
        { name: 'Cansancio acumulado', weight: 20 }
    ],

    init() {
        console.log("Laboratorio Táctico Inicializado");
        setTimeout(() => {
            this.initCharts();
            this.renderCulpaFactors();
            this.initDragDrop();
        }, 500);
    },

    switchSubTab(tabId) {
        const tabs = ['math', 'sim', 'hotspot', 'media'];
        tabs.forEach(t => {
            document.getElementById(`lab-${t}`).classList.add('hidden');
            const btn = document.getElementById(`lab-tab-${t}`);
            btn.classList.remove('bg-indigo-900/50', 'text-indigo-300', 'border', 'border-indigo-500/30');
            btn.classList.add('text-slate-400');
        });
        
        document.getElementById(`lab-${tabId}`).classList.remove('hidden');
        const activeBtn = document.getElementById(`lab-tab-${tabId}`);
        activeBtn.classList.add('bg-indigo-900/50', 'text-indigo-300', 'border', 'border-indigo-500/30');
        activeBtn.classList.remove('text-slate-400');
    },

    // --- PHASE 1: MATH MODELS & CHARTS --- //
    initCharts() {
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

        // 1. Radar Chart (Triada Oscura)
        const ctxTriada = document.getElementById('triadaChart');
        if (ctxTriada) {
            this.charts.triada = new Chart(ctxTriada, {
                type: 'radar',
                data: {
                    labels: ['Narcisismo', 'Maquiavelismo', 'Psicopatía'],
                    datasets: [{
                        label: 'Perfil de Riesgo',
                        data: [20, 20, 20],
                        backgroundColor: 'rgba(244, 63, 94, 0.2)',
                        borderColor: 'rgba(244, 63, 94, 1)',
                        pointBackgroundColor: 'rgba(244, 63, 94, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        r: { 
                            min: 0, max: 100,
                            grid: { color: 'rgba(148, 163, 184, 0.1)' },
                            angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
                            ticks: { display: false }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // 2. Pie Chart (Culpa)
        const ctxCulpa = document.getElementById('culpaChart');
        if (ctxCulpa) {
            this.charts.culpa = new Chart(ctxCulpa, {
                type: 'doughnut',
                data: {
                    labels: this.culpaFactors.map(f => f.name),
                    datasets: [{
                        data: this.culpaFactors.map(f => f.weight),
                        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'],
                        borderWidth: 0,
                        cutout: '75%'
                    }]
                },
                options: {
                    plugins: { legend: { display: false }, tooltip: { enabled: true } }
                }
            });
        }
    },

    updateRadar() {
        if (!this.charts.triada) return;
        const n = document.getElementById('radar-narc').value;
        const m = document.getElementById('radar-maq').value;
        const p = document.getElementById('radar-psi').value;
        this.charts.triada.data.datasets[0].data = [n, m, p];
        this.charts.triada.update();
    },

    renderCulpaFactors() {
        const container = document.getElementById('culpa-factors-container');
        if (!container) return;
        
        let html = '';
        let total = this.culpaFactors.reduce((sum, f) => sum + parseInt(f.weight), 0);
        if (total === 0) total = 1;

        this.culpaFactors.forEach((f, i) => {
            const pct = Math.round((f.weight / total) * 100);
            html += `
                <div class="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                    <input type="text" value="${f.name}" onchange="Lab.updateCulpaName(${i}, this.value)" class="flex-1 bg-transparent text-xs text-slate-300 focus:outline-none focus:border-b border-indigo-500">
                    <input type="number" value="${f.weight}" onchange="Lab.updateCulpaWeight(${i}, this.value)" class="w-16 bg-slate-800 border border-slate-700 rounded text-xs text-center p-1 text-slate-200">
                    <button onclick="Lab.removeCulpaFactor(${i})" class="text-rose-500 hover:text-rose-400"><i class="fa-solid fa-trash text-xs"></i></button>
                </div>
            `;
        });
        container.innerHTML = html;

        // Update Chart
        if (this.charts.culpa) {
            this.charts.culpa.data.labels = this.culpaFactors.map(f => f.name);
            this.charts.culpa.data.datasets[0].data = this.culpaFactors.map(f => f.weight);
            this.charts.culpa.update();
        }

        // Update Big Percentage (Assuming index 0 is "Mi error")
        if (this.culpaFactors.length > 0) {
            const myPct = Math.round((this.culpaFactors[0].weight / total) * 100);
            document.getElementById('culpa-tu-porcentaje').innerText = `${myPct}%`;
        }
    },

    updateCulpaName(index, val) { this.culpaFactors[index].name = val; this.renderCulpaFactors(); },
    updateCulpaWeight(index, val) { this.culpaFactors[index].weight = parseInt(val) || 0; this.renderCulpaFactors(); },
    removeCulpaFactor(index) { this.culpaFactors.splice(index, 1); this.renderCulpaFactors(); },
    addCulpaFactor() { this.culpaFactors.push({ name: 'Nuevo factor oculto', weight: 10 }); this.renderCulpaFactors(); },

    addTension(amount) {
        this.tensionLevel += amount;
        if (this.tensionLevel > 100) this.tensionLevel = 100;
        if (this.tensionLevel < 0) this.tensionLevel = 0;
        
        const bar = document.getElementById('tension-bar');
        const txt = document.getElementById('tension-text');
        
        bar.style.width = `${this.tensionLevel}%`;
        
        if (this.tensionLevel < 30) {
            txt.innerText = `Estado: Calma Límbica (${this.tensionLevel}%)`;
            txt.className = "mt-2 text-center text-xs font-mono text-emerald-400";
        } else if (this.tensionLevel < 70) {
            txt.innerText = `Estado: Alerta Cortisol (${this.tensionLevel}%)`;
            txt.className = "mt-2 text-center text-xs font-mono text-amber-400";
        } else {
            txt.innerText = `Estado: Secuestro Amigdalar (${this.tensionLevel}%)`;
            txt.className = "mt-2 text-center text-xs font-bold font-mono text-rose-500 animate-pulse";
        }
    },

    // --- PHASE 2: DRAG & DROP AND HOTSPOTS --- //
    initDragDrop() {
        if (typeof Sortable === 'undefined') return;
        const arsenal = document.getElementById('dd-arsenal');
        const shield = document.getElementById('dd-shield');
        
        if (arsenal && shield) {
            new Sortable(arsenal, { group: 'shared', animation: 150 });
            new Sortable(shield, { group: 'shared', animation: 150 });
        }
    },

    checkDragDrop() {
        const shield = document.getElementById('dd-shield');
        const items = shield.querySelectorAll('div');
        let badCount = 0;
        items.forEach(el => {
            if (el.getAttribute('data-type') === 'bad') badCount++;
        });
        
        const feedback = document.getElementById('dd-feedback');
        feedback.classList.remove('hidden');
        
        if (items.length === 0) {
            feedback.className = "mt-4 p-4 rounded-xl text-sm font-bold text-center bg-amber-900/30 text-amber-400 border border-amber-500/50";
            feedback.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Tu escudo está vacío. El ataque entró directo.";
        } else if (badCount > 0) {
            feedback.className = "mt-4 p-4 rounded-xl text-sm font-bold text-center bg-rose-900/30 text-rose-400 border border-rose-500/50 animate-shake";
            feedback.innerHTML = "<i class='fa-solid fa-skull'></i> Escudo Penetrado: Incluiste una justificación emocional o un ataque directo. Le diste munición al agresor.";
        } else {
            feedback.className = "mt-4 p-4 rounded-xl text-sm font-bold text-center bg-emerald-900/30 text-emerald-400 border border-emerald-500/50";
            feedback.innerHTML = "<i class='fa-solid fa-shield-virus'></i> Escudo de Acero: Respuesta neutral, enfocada en soluciones y estableciendo límites inquebrantables.";
        }
    },

    checkHotspot(area) {
        const fb = document.getElementById('hotspot-feedback');
        if (area === 'cuello') {
            fb.innerHTML = "<span class='text-emerald-400'><i class='fa-solid fa-check-circle'></i> ¡Correcto! El hueco supraesternal (cuello) es un Gesto Pacificador del Nervio Vago. Denota alto estrés oculto.</span>";
        } else if (area === 'ojos') {
            fb.innerHTML = "<span class='text-amber-400'><i class='fa-solid fa-triangle-exclamation'></i> Los ojos pueden mentir fácilmente (contacto visual forzado). Busca filtraciones en otras zonas.</span>";
        } else if (area === 'manos') {
            fb.innerHTML = "<span class='text-cyan-400'><i class='fa-solid fa-info-circle'></i> Las manos entrelazadas pueden indicar tensión contenida, pero el cuello es un indicador biológico más primitivo.</span>";
        }
    }
};

// Initialize Lab when script loads
document.addEventListener('DOMContentLoaded', () => {
    Lab.init();
});
// If it loads after DOMContentLoaded
setTimeout(() => { if (!Lab.charts.culpa) Lab.init(); }, 1000);
