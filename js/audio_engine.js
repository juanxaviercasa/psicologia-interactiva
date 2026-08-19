/**
 * AUDIO ENGINE - NEURO-TACTICAL OS
 * Genera frecuencias binaurales, latidos cardíacos (estrés) y efectos sonoros.
 */

const AudioEngine = {
  ctx: null,
  binauralOscL: null,
  binauralOscR: null,
  binauralGain: null,
  heartbeatInterval: null,
  isPlayingBinaural: false,

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  },

  resumeCtx() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  // Funcionalidad 6: Frecuencias de Inserción Neuronal (Binaural Beats)
  // Genera una frecuencia base (ej. 200Hz) en el oído izquierdo y 210Hz en el derecho.
  // El cerebro percibe la diferencia (10Hz = Ondas Alfa para aprendizaje relajado).
  toggleBinauralBeats(baseFreq = 200, beatFreq = 10) {
    if (!this.ctx) this.init();
    this.resumeCtx();

    if (this.isPlayingBinaural) {
      this.stopBinauralBeats();
      return false; // Retorna estado false (apagado)
    }

    this.binauralGain = this.ctx.createGain();
    this.binauralGain.gain.value = 0.1; // Volumen muy sutil, de fondo
    this.binauralGain.connect(this.ctx.destination);

    // Canal Izquierdo
    const panL = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : this.ctx.createPanner();
    if (panL.pan) panL.pan.value = -1;
    this.binauralOscL = this.ctx.createOscillator();
    this.binauralOscL.type = 'sine';
    this.binauralOscL.frequency.value = baseFreq;
    this.binauralOscL.connect(panL);
    panL.connect(this.binauralGain);

    // Canal Derecho
    const panR = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : this.ctx.createPanner();
    if (panR.pan) panR.pan.value = 1;
    this.binauralOscR = this.ctx.createOscillator();
    this.binauralOscR.type = 'sine';
    this.binauralOscR.frequency.value = baseFreq + beatFreq;
    this.binauralOscR.connect(panR);
    panR.connect(this.binauralGain);

    this.binauralOscL.start();
    this.binauralOscR.start();
    this.isPlayingBinaural = true;
    return true; // Retorna estado true (encendido)
  },

  stopBinauralBeats() {
    if (this.binauralOscL) this.binauralOscL.stop();
    if (this.binauralOscR) this.binauralOscR.stop();
    this.isPlayingBinaural = false;
  },

  // Funcionalidad 4 (Apoyo): Latidos de Estrés para Secuestro Amigdalar
  startStressHeartbeat(speedMs = 800) {
    if (!this.ctx) this.init();
    this.resumeCtx();
    this.stopStressHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      this.playHeartbeatBump();
      setTimeout(() => this.playHeartbeatBump(), 150); // El doble latido típico (lub-dub)
    }, speedMs);
  },

  stopStressHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  },

  playHeartbeatBump() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    // Frecuencia muy baja simulando un latido profundo (bass drum)
    osc.frequency.setValueAtTime(50, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
};
