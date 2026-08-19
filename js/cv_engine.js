/**
 * CV ENGINE - NEURO-TACTICAL OS
 * Maneja la cámara web y tracking facial (si hay conexión a CDN).
 */

const CVEngine = {
  videoEl: null,
  canvasEl: null,
  stream: null,
  isTracking: false,
  modelsLoaded: false,

  async init(videoId, canvasId) {
    this.videoEl = document.getElementById(videoId);
    this.canvasEl = document.getElementById(canvasId);

    if (!this.videoEl || !this.canvasEl) return;

    try {
      // Cargar modelos de face-api.js (requiere internet/CDN)
      // Si falla, caemos en un modo grácil sin romper la app.
      if (typeof faceapi !== 'undefined' && !this.modelsLoaded) {
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        this.modelsLoaded = true;
      }
    } catch (e) {
      console.warn("CV Engine: No se pudieron cargar los modelos de FaceAPI (¿Sin internet?). Tracker en modo simulado.");
    }
  },

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      this.videoEl.srcObject = this.stream;
      this.isTracking = true;
      
      this.videoEl.addEventListener('play', () => {
        if (this.modelsLoaded) {
          this.trackExpressions();
        } else {
          this.simulateTracking();
        }
      });
      return true;
    } catch (err) {
      console.error("Error accediendo a la cámara: ", err);
      return false;
    }
  },

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isTracking = false;
  },

  trackExpressions() {
    if (!this.isTracking || !this.videoEl || !this.modelsLoaded) return;
    
    const displaySize = { width: this.videoEl.width, height: this.videoEl.height };
    faceapi.matchDimensions(this.canvasEl, displaySize);

    setInterval(async () => {
      if (!this.isTracking) return;
      const detections = await faceapi.detectAllFaces(this.videoEl, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        this.canvasEl.getContext('2d').clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        faceapi.draw.drawDetections(this.canvasEl, resizedDetections);
        
        // Detección de estrés: si detecta miedo, tristeza o enojo elevado, puede penalizar el simulador.
        const expressions = detections[0].expressions;
        if (expressions.fear > 0.5 || expressions.angry > 0.5) {
          document.dispatchEvent(new CustomEvent('neuro_stress_detected', { detail: expressions }));
        }
      }
    }, 500);
  },

  simulateTracking() {
    // Si no hay modelos, pintamos una retícula verde HUD en el canvas simulando rastreo
    setInterval(() => {
      if (!this.isTracking) return;
      const ctx = this.canvasEl.getContext('2d');
      ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 2;
      
      const cx = this.canvasEl.width / 2;
      const cy = this.canvasEl.height / 2;
      const r = 80 + Math.sin(Date.now() / 300) * 5; // Respiro
      
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#06B6D4';
      ctx.font = '10px monospace';
      ctx.fillText('BIOMETRÍA OFFLINE', cx - 40, cy + r + 20);
    }, 100);
  }
};
