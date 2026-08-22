with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

old_speak_text = '''  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  },'''

new_speak_text = '''  speakText(text) {
    if ('speechSynthesis' in window) {
      this.stopAudioNarration();
      if (!this.ttsState.selectedVoice) this.initTTSVoices();
      
      const clean = this.stripMarkdownForTTS(text);
      const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
      this.ttsState.utterances = sentences.map(s => s.trim()).filter(s => s.length > 0);
      this.ttsState.currentIndex = 0;
      this.ttsState.activeChapter = 'generic_text';
      this.ttsState.isPaused = false;

      this.showToast('Reproduciendo audio con voz neural...', 'info');
      this.playNextTTSChunk();
    } else {
      this.showToast('Tu navegador no soporta síntesis de voz.', 'error');
    }
  },'''

if old_speak_text in app_js:
    app_js = app_js.replace(old_speak_text, new_speak_text)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(app_js)
    print("Enhanced speakText with Neural TTS chunking.")
else:
    print("Old speakText pattern not matched exactly, checking alternative...")
