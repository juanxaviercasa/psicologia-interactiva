with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Let's find where stopAudioNarration is defined
stop_narration_idx = app_js.find('stopAudioNarration() {')
if stop_narration_idx == -1:
    print("Error: stopAudioNarration not found!")
    exit(1)

# Find the end of stopAudioNarration method
end_brace = app_js.find('},', stop_narration_idx) + 2

voice_methods = '''
  // ==========================================
  // VOICE CONFIGURATOR METHODS
  // ==========================================
  populateVoiceSelect() {
    const select = document.getElementById('ttsVoiceSelect');
    if (!select || !('speechSynthesis' in window)) return;
    
    let voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      setTimeout(() => this.populateVoiceSelect(), 150);
      return;
    }
    
    // Sort: Spanish voices first, neural/natural first
    const esVoices = voices.filter(v => v.lang.startsWith('es') || v.lang.includes('ES') || v.lang.includes('MX') || v.lang.includes('US') || v.lang.includes('419'));
    const otherVoices = voices.filter(v => !esVoices.includes(v));
    const voiceList = esVoices.length > 0 ? [...esVoices, ...otherVoices] : voices;

    select.innerHTML = voiceList.map(v => {
      const isEs = v.lang.startsWith('es');
      const isNeural = v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online') || v.name.includes('Google');
      const isFemale = v.name.toLowerCase().includes('dalia') || v.name.toLowerCase().includes('elena') || v.name.toLowerCase().includes('laura') || v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('paulina') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer');
      const isMale = v.name.toLowerCase().includes('jorge') || v.name.toLowerCase().includes('alvaro') || v.name.toLowerCase().includes('raul') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hombre');
      
      let tag = isNeural ? '⭐ Neural' : 'Estándar';
      let genderTag = isFemale ? ' [Femenina]' : (isMale ? ' [Masculina]' : '');
      let langTag = isEs ? '🇪🇸 Español' : `🌐 ${v.lang}`;
      
      return `<option value="${v.name}">${langTag} - ${v.name} (${tag}${genderTag})</option>`;
    }).join('');

    const savedVoice = localStorage.getItem('userTTSVoice');
    if (savedVoice) {
      select.value = savedVoice;
    } else if (this.ttsState.selectedVoice) {
      select.value = this.ttsState.selectedVoice.name;
    }
  },

  openVoiceSettingsModal() {
    const modal = document.getElementById('voiceSettingsModal');
    if (!modal) return;
    
    this.populateVoiceSelect();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => this.populateVoiceSelect();
    }
    
    const range = document.getElementById('ttsSpeedRange');
    const speedLabel = document.getElementById('ttsSpeedLabel');
    const savedRate = localStorage.getItem('userTTSRate') || '0.92';
    if (range) {
      range.value = savedRate;
      if (speedLabel) speedLabel.innerText = savedRate + 'x';
    }
    
    modal.classList.remove('hidden');
  },

  closeVoiceSettingsModal() {
    const modal = document.getElementById('voiceSettingsModal');
    if (modal) modal.classList.add('hidden');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  saveVoiceSettings() {
    const select = document.getElementById('ttsVoiceSelect');
    const range = document.getElementById('ttsSpeedRange');
    
    if (select && select.value) {
      localStorage.setItem('userTTSVoice', select.value);
      const voices = window.speechSynthesis.getVoices();
      const chosen = voices.find(v => v.name === select.value);
      if (chosen) this.ttsState.selectedVoice = chosen;
    }
    
    if (range) {
      localStorage.setItem('userTTSRate', range.value);
    }
    
    this.closeVoiceSettingsModal();
    this.showToast('Preferencias de voz guardadas con éxito.', 'success');
  },

  testVoice() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const select = document.getElementById('ttsVoiceSelect');
    const range = document.getElementById('ttsSpeedRange');
    
    const sampleText = "Esta es una demostración de mi voz para la lectura de Psicología Oscura. La autorregulación emocional y el pensamiento crítico son tus mejores defensas.";
    const u = new SpeechSynthesisUtterance(sampleText);
    u.lang = 'es-ES';
    u.rate = range ? parseFloat(range.value) : 0.92;
    
    if (select && select.value) {
      const voices = window.speechSynthesis.getVoices();
      const chosen = voices.find(v => v.name === select.value);
      if (chosen) u.voice = chosen;
    }
    
    window.speechSynthesis.speak(u);
  },
'''

app_js = app_js[:end_brace] + '\n' + voice_methods + app_js[end_brace:]

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Voice methods injected directly into App object successfully!")
