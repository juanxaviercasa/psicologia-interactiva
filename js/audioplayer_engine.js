/**
 * AUDIOPLAYER_ENGINE - NEURO-TACTICAL AUDIOBOOKS SUITE
 * Controlador integral de streaming, reproducción de audiolibros (.m4a),
 * mini-reproductor persistente, drawer expandido, velocidad, temporizador y MediaSession.
 */

const AudioPlayerEngine = {
  audio: null,
  playlist: [],
  currentIndex: -1,
  currentTrack: null,
  isPlaying: false,
  playbackRate: 1.0,
  volume: 0.85,
  isMuted: false,
  sleepTimerTimeout: null,
  sleepTimerSeconds: 0,
  sleepTimerInterval: null,
  activeCategory: 'all',
  searchQuery: '',
  storageKey: 'psicologia_audioplayer_state',

  init() {
    if (typeof COLECCION_DATA === 'undefined') return;
    this.playlist = COLECCION_DATA.audiobooks || [];

    // Crear elemento de audio nativo
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.volume = this.volume;

    this.bindAudioEvents();
    this.bindKeyboardShortcuts();
    this.loadSavedState();
    this.renderAudioCatalog();
    this.setupMediaSession();
  },

  bindAudioEvents() {
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayStateUI();
      this.showStickyBar();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayStateUI();
      this.saveCurrentProgress();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgressUI();
      // Guardar progreso cada 5 segundos
      if (Math.floor(this.audio.currentTime) % 5 === 0) {
        this.saveCurrentProgress();
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.updateDurationUI();
      // Restaurar progreso guardado de esta pista si existe
      if (this.currentTrack) {
        const savedTime = this.getTrackProgress(this.currentTrack.id);
        if (savedTime && savedTime > 5 && savedTime < this.audio.duration - 10) {
          this.audio.currentTime = savedTime;
        }
      }
    });

    this.audio.addEventListener('ended', () => {
      this.saveTrackCompleted(this.currentTrack?.id);
      this.next();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn("Audio playback error:", e);
      // Alert removed: 403/CORS errors trigger this unnecessarily.
    });
  },

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignorar si el foco está en un input o textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        if (this.currentTrack) {
          e.preventDefault();
          this.togglePlay();
        }
      } else if (e.code === 'ArrowRight' && e.altKey) {
        e.preventDefault();
        this.skip(30);
      } else if (e.code === 'ArrowLeft' && e.altKey) {
        e.preventDefault();
        this.skip(-15);
      } else if (e.key === 'm' || e.key === 'M') {
        this.toggleMute();
      }
    });
  },

  setupMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('seekbackward', () => this.skip(-15));
      navigator.mediaSession.setActionHandler('seekforward', () => this.skip(30));
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prev());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
    }
  },

  updateMediaSessionMetadata() {
    if (!('mediaSession' in navigator) || !this.currentTrack) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: this.currentTrack.title,
      artist: this.currentTrack.author || 'Psicología Estratégica',
      album: 'Colección Psicología Oscura & Audiolibros',
      artwork: [
        { src: 'assets/img/hero_banner_brain.jpg', sizes: '512x512', type: 'image/jpeg' }
      ]
    });
  },

  loadSavedState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const state = jsonSafeParse(raw, {});
        if (state.lastTrackId) {
          const track = this.playlist.find(t => t.id === state.lastTrackId);
          if (track) {
            this.currentIndex = this.playlist.indexOf(track);
            this.currentTrack = track;
            this.audio.src = track.encodedPath;
            this.updateCurrentTrackUI();
            this.showStickyBar();
          }
        }
        if (state.playbackRate) {
          this.setSpeed(state.playbackRate, false);
        }
        if (state.volume !== undefined) {
          this.setVolume(state.volume);
        }
      }
    } catch (err) {
      console.warn("Could not restore audio state:", err);
    }
  },

  saveCurrentProgress() {
    if (!this.currentTrack || !this.audio) return;
    try {
      const raw = localStorage.getItem(this.storageKey);
      const state = jsonSafeParse(raw, {});
      if (!state.progress) state.progress = {};
      state.progress[this.currentTrack.id] = this.audio.currentTime;
      state.lastTrackId = this.currentTrack.id;
      state.playbackRate = this.playbackRate;
      state.volume = this.volume;
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      // Ignorar quota errors
    }
  },

  getTrackProgress(trackId) {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const state = jsonSafeParse(raw, {});
      return state.progress ? state.progress[trackId] || 0 : 0;
    } catch (e) {
      return 0;
    }
  },

  saveTrackCompleted(trackId) {
    if (!trackId) return;
    try {
      const raw = localStorage.getItem(this.storageKey);
      const state = jsonSafeParse(raw, {});
      if (!state.completed) state.completed = [];
      if (!state.completed.includes(trackId)) {
        state.completed.push(trackId);
        localStorage.setItem(this.storageKey, JSON.stringify(state));
        this.renderAudioCatalog(); // Actualizar badges
      }
    } catch (e) {}
  },

  isTrackCompleted(trackId) {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const state = jsonSafeParse(raw, {});
      return state.completed ? state.completed.includes(trackId) : false;
    } catch (e) {
      return false;
    }
  },

  // =============================================
  // CONTROLES DE REPRODUCCIÓN
  // =============================================
  playTrack(trackId) {
    const idx = this.playlist.findIndex(t => t.id === trackId);
    if (idx === -1) return;

    this.currentIndex = idx;
    this.currentTrack = this.playlist[idx];
    this.audio.src = this.currentTrack.encodedPath;
    this.audio.playbackRate = this.playbackRate;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.updatePlayStateUI();
          this.updateCurrentTrackUI();
          this.updateMediaSessionMetadata();
          this.showStickyBar();
          this.saveCurrentProgress();
        })
        .catch(err => {
          console.warn("Auto-play blocked or audio load error:", err);
          this.updateCurrentTrackUI();
          this.showStickyBar();
        });
    }
  },

  togglePlay() {
    if (!this.currentTrack) {
      if (this.playlist.length > 0) {
        this.playTrack(this.playlist[0].id);
      }
      return;
    }

    if (this.audio.paused) {
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updatePlayStateUI();
      }).catch(err => console.warn(err));
    } else {
      this.audio.pause();
      this.isPlaying = false;
      this.updatePlayStateUI();
    }
  },

  skip(seconds) {
    if (!this.audio) return;
    this.audio.currentTime = Math.max(0, Math.min(this.audio.duration || 0, this.audio.currentTime + seconds));
    this.updateProgressUI();
  },

  seek(percent) {
    if (!this.audio || isNaN(this.audio.duration)) return;
    this.audio.currentTime = (percent / 100) * this.audio.duration;
    this.updateProgressUI();
  },

  next() {
    if (this.playlist.length === 0) return;
    let nextIdx = this.currentIndex + 1;
    if (nextIdx >= this.playlist.length) nextIdx = 0;
    this.playTrack(this.playlist[nextIdx].id);
  },

  prev() {
    if (this.playlist.length === 0) return;
    // Si ya pasaron más de 5 segundos, reiniciar la pista actual
    if (this.audio.currentTime > 5) {
      this.audio.currentTime = 0;
      return;
    }
    let prevIdx = this.currentIndex - 1;
    if (prevIdx < 0) prevIdx = this.playlist.length - 1;
    this.playTrack(this.playlist[prevIdx].id);
  },

  setSpeed(rate, notify = true) {
    this.playbackRate = parseFloat(rate);
    if (this.audio) this.audio.playbackRate = this.playbackRate;
    
    // Actualizar botones de velocidad
    document.querySelectorAll('.speed-pill').forEach(btn => {
      const speed = parseFloat(btn.dataset.speed);
      if (speed === this.playbackRate) {
        btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('bg-slate-800', 'text-slate-300');
      } else {
        btn.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.add('bg-slate-800', 'text-slate-300');
      }
    });

    const speedLabel = document.getElementById('currentSpeedLabel');
    if (speedLabel) speedLabel.textContent = `${this.playbackRate}x`;

    this.saveCurrentProgress();
  },

  setVolume(val) {
    this.volume = parseFloat(val);
    if (this.audio) {
      this.audio.volume = this.volume;
      this.audio.muted = (this.volume === 0);
    }
    this.isMuted = (this.volume === 0);
    this.updateVolumeUI();
  },

  toggleMute() {
    if (!this.audio) return;
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.updateVolumeUI();
  },

  // =============================================
  // TEMPORIZADOR DE APAGADO (SLEEP TIMER)
  // =============================================
  setSleepTimer(minutes) {
    this.clearSleepTimer();
    if (minutes <= 0) return;

    this.sleepTimerSeconds = minutes * 60;
    this.updateSleepTimerUI();

    this.sleepTimerInterval = setInterval(() => {
      this.sleepTimerSeconds--;
      this.updateSleepTimerUI();
      if (this.sleepTimerSeconds <= 0) {
        this.clearSleepTimer();
        if (this.isPlaying) {
          this.audio.pause();
          this.isPlaying = false;
          this.updatePlayStateUI();
        }
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            title: 'Temporizador Finalizado',
            text: 'La reproducción de audiolibro se ha pausado automáticamente.',
            icon: 'info',
            timer: 3000,
            showConfirmButton: false,
            background: '#0F172A',
            color: '#F8FAFC'
          });
        }
      }
    }, 1000);

    const timerBadge = document.getElementById('sleepTimerBadge');
    if (timerBadge) timerBadge.classList.remove('hidden');
  },

  clearSleepTimer() {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }
    this.sleepTimerSeconds = 0;
    const timerBadge = document.getElementById('sleepTimerBadge');
    if (timerBadge) timerBadge.classList.add('hidden');
    const timerDisplay = document.getElementById('sleepTimerDisplay');
    if (timerDisplay) timerDisplay.textContent = 'Apagado';
  },

  updateSleepTimerUI() {
    const timerDisplay = document.getElementById('sleepTimerDisplay');
    if (timerDisplay && this.sleepTimerSeconds > 0) {
      const m = Math.floor(this.sleepTimerSeconds / 60);
      const s = this.sleepTimerSeconds % 60;
      timerDisplay.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }
  },

  // =============================================
  // ACTUALIZACIONES DE UI
  // =============================================
  showStickyBar() {
    const bar = document.getElementById('sticky-audio-player');
    if (bar) bar.classList.remove('translate-y-full');
  },

  hideStickyBar() {
    const bar = document.getElementById('sticky-audio-player');
    if (bar) bar.classList.add('translate-y-full');
  },

  updatePlayStateUI() {
    const playIcons = document.querySelectorAll('.player-play-icon');
    playIcons.forEach(icon => {
      if (this.isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
      } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
      }
    });

    // En tarjetas de catálogo
    document.querySelectorAll('.catalog-play-btn').forEach(btn => {
      const id = btn.dataset.trackId;
      const icon = btn.querySelector('i');
      if (this.currentTrack && id === this.currentTrack.id && this.isPlaying) {
        icon?.classList.remove('fa-play');
        icon?.classList.add('fa-pause');
        btn.classList.add('bg-cyan-500', 'text-slate-950');
        btn.classList.remove('bg-slate-800', 'text-cyan-400');
      } else {
        icon?.classList.remove('fa-pause');
        icon?.classList.add('fa-play');
        btn.classList.remove('bg-cyan-500', 'text-slate-950');
        btn.classList.add('bg-slate-800', 'text-cyan-400');
      }
    });
  },

  updateCurrentTrackUI() {
    if (!this.currentTrack) return;

    // Mini-player sticky
    const titleEl = document.getElementById('stickyPlayerTitle');
    const authorEl = document.getElementById('stickyPlayerAuthor');
    const catEl = document.getElementById('stickyPlayerCategory');
    const coverEl = document.getElementById('stickyPlayerCover');

    if (titleEl) titleEl.textContent = this.currentTrack.title;
    if (authorEl) authorEl.textContent = this.currentTrack.author;
    if (catEl) {
      catEl.textContent = this.currentTrack.categoryName;
      catEl.className = `px-2 py-0.5 text-[10px] font-mono font-bold rounded ${this.currentTrack.badgeBg}`;
    }

    // Modal expandido
    const modalTitle = document.getElementById('modalPlayerTitle');
    const modalAuthor = document.getElementById('modalPlayerAuthor');
    const modalCat = document.getElementById('modalPlayerCategory');
    const modalCoverIcon = document.getElementById('modalPlayerCoverIcon');

    if (modalTitle) modalTitle.textContent = this.currentTrack.title;
    if (modalAuthor) modalAuthor.textContent = this.currentTrack.author;
    if (modalCat) {
      modalCat.textContent = this.currentTrack.categoryName;
      modalCat.className = `inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded-full ${this.currentTrack.badgeBg}`;
    }
    if (modalCoverIcon) {
      modalCoverIcon.className = `fa-solid ${this.currentTrack.categoryIcon} text-5xl text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]`;
    }

    this.updatePlayStateUI();
  },

  updateProgressUI() {
    if (!this.audio) return;
    const cur = this.audio.currentTime || 0;
    const dur = this.audio.duration || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;

    // Sticky bar
    const progressFill = document.getElementById('stickyProgressFill');
    const timeCurrent = document.getElementById('stickyTimeCurrent');
    const timeTotal = document.getElementById('stickyTimeTotal');

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (timeCurrent) timeCurrent.textContent = this.formatTime(cur);
    if (timeTotal && dur > 0) timeTotal.textContent = this.formatTime(dur);

    // Modal
    const modalScrubber = document.getElementById('modalPlayerScrubber');
    const modalFill = document.getElementById('modalProgressFill');
    const modalCur = document.getElementById('modalTimeCurrent');
    const modalDur = document.getElementById('modalTimeDuration');

    if (modalScrubber && !modalScrubber.matches(':active')) {
      modalScrubber.value = pct;
    }
    if (modalFill) modalFill.style.width = `${pct}%`;
    if (modalCur) modalCur.textContent = this.formatTime(cur);
    if (modalDur && dur > 0) modalDur.textContent = this.formatTime(dur);
  },

  updateDurationUI() {
    if (!this.audio || isNaN(this.audio.duration)) return;
    const formatted = this.formatTime(this.audio.duration);
    const timeTotal = document.getElementById('stickyTimeTotal');
    const modalDur = document.getElementById('modalTimeDuration');
    if (timeTotal) timeTotal.textContent = formatted;
    if (modalDur) modalDur.textContent = formatted;
  },

  updateVolumeUI() {
    const volSlider = document.getElementById('stickyVolumeSlider');
    const volIcon = document.getElementById('stickyVolumeIcon');

    if (volSlider) volSlider.value = this.isMuted ? 0 : this.volume * 100;
    if (volIcon) {
      if (this.isMuted || this.volume === 0) {
        volIcon.className = 'fa-solid fa-volume-xmark text-slate-500';
      } else if (this.volume < 0.5) {
        volIcon.className = 'fa-solid fa-volume-low text-slate-300';
      } else {
        volIcon.className = 'fa-solid fa-volume-high text-cyan-400';
      }
    }
  },

  formatTime(sec) {
    if (isNaN(sec) || sec < 0) return '00:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  },

  // =============================================
  // CATÁLOGO DE AUDIOLIBROS
  // =============================================
  renderAudioCatalog() {
    const container = document.getElementById('audiolibros-grid');
    if (!container || typeof COLECCION_DATA === 'undefined') return;

    let filtered = this.playlist;

    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(item => item.categoryKey === this.activeCategory);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q)
      );
    }

    const countBadge = document.getElementById('audioCountBadge');
    if (countBadge) countBadge.textContent = `${filtered.length} Audiolibros`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <i class="fa-solid fa-headphones-simple text-4xl mb-3 text-slate-600"></i>
          <p class="text-base font-semibold">No se encontraron audiolibros con ese criterio.</p>
          <p class="text-xs text-slate-500 mt-1">Intenta con otra palabra clave o selecciona 'Todos'.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((item, idx) => {
      const isCurrent = this.currentTrack && this.currentTrack.id === item.id;
      const isCompleted = this.isTrackCompleted(item.id);
      const savedTime = this.getTrackProgress(item.id);

      return `
        <div class="group relative rounded-2xl bg-gradient-to-b ${item.gradient} border ${isCurrent ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-slate-800/80 hover:border-slate-700'} p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
          <div>
            <!-- Header de Tarjeta -->
            <div class="flex items-start justify-between gap-3 mb-3">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg ${item.badgeBg}">
                <i class="fa-solid ${item.categoryIcon}"></i> ${item.categoryName}
              </span>
              <div class="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <i class="fa-regular fa-clock"></i> ${item.timeEstimate}
              </div>
            </div>

            <!-- Portada Táctica de Audiolibro -->
            <div class="my-3 h-28 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500/40 transition-all">
              ${item.coverImage ? `
                <img src="${item.coverImage}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0" onerror="this.remove()">
              ` : ''}
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none"></div>
              <i class="fa-solid ${item.categoryIcon} text-4xl text-slate-700 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500 z-0"></i>
              <span class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900/90 text-slate-300 border border-slate-700 shadow z-20">
                ${item.extension}
              </span>
            </div>

            <!-- Título y Autor -->
            <h3 class="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug min-h-[3rem]" title="${item.fullTitle || item.title}">
              ${item.title}
            </h3>
            <p class="text-xs text-slate-300 mt-1.5 flex items-center gap-1.5 truncate">
              <i class="fa-solid fa-pen-nib text-slate-400 text-[10px]"></i> ${item.author}
            </p>

            <!-- Metadatos (Peso y Formato) -->
            <div class="mt-4 flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/60 text-[10px] font-mono text-slate-300">
                ${item.extension} • ${item.sizeFormatted}
              </span>
              ${isCompleted ? `
                <span class="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                  <i class="fa-solid fa-check"></i> Escuchado
                </span>
              ` : savedTime > 0 ? `
                <span class="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-[10px] font-mono text-indigo-300 flex items-center gap-1">
                  <i class="fa-solid fa-bookmark"></i> ${this.formatTime(savedTime)}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Acciones -->
          <div class="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <button onclick="AudioPlayerEngine.playTrack('${item.id}')" data-track-id="${item.id}" class="catalog-play-btn flex-1 py-2.5 px-4 rounded-xl ${isCurrent && this.isPlaying ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-semibold'} text-xs flex items-center justify-center gap-2 transition-all shadow-md">
              <i class="fa-solid ${isCurrent && this.isPlaying ? 'fa-pause' : 'fa-play'} text-xs"></i>
              <span>${isCurrent && this.isPlaying ? 'Pausar' : 'Reproducir'}</span>
            </button>

            <a href="${item.encodedPath}" download="${item.filename}" class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 hover:border-cyan-500 hover:bg-slate-700 flex items-center justify-center text-slate-200 hover:text-cyan-300 transition-all shadow-sm" title="Descargar audiolibro (${item.sizeFormatted})">
              <i class="fa-solid fa-download text-sm"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');
  },

  filterCategory(catKey) {
    this.activeCategory = catKey;
    document.querySelectorAll('.audio-cat-pill').forEach(pill => {
      if (pill.dataset.category === catKey) {
        pill.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
        pill.classList.remove('bg-slate-900', 'text-slate-300');
      } else {
        pill.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
        pill.classList.add('bg-slate-900', 'text-slate-300');
      }
    });
    this.renderAudioCatalog();
  },

  searchAudiobooks(query) {
    this.searchQuery = query;
    this.renderAudioCatalog();
  },

  // Modal Expandido
  openExpandedModal() {
    if (!this.currentTrack) return;
    this.updateCurrentTrackUI();
    this.updateDurationUI();
    this.updateProgressUI();
    const modal = document.getElementById('audioplayer-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  },

  closeExpandedModal() {
    const modal = document.getElementById('audioplayer-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }
};

function jsonSafeParse(str, fallback) {
  try {
    return JSON.parse(str) || fallback;
  } catch (e) {
    return fallback;
  }
}

if (typeof window !== 'undefined') {
  window.AudioPlayerEngine = AudioPlayerEngine;
}
if (typeof module !== 'undefined') {
  module.exports = AudioPlayerEngine;
}
