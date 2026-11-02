/**
 * audio.js — Процедурный генератор звуков и музыки на Web Audio API
 * Не требует внешних mp3 файлов, мгновенно работает во всех браузерах!
 */

class CuteSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isMusicPlaying = false;
    this.musicInterval = null;
    this.noteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Милый хлопок/клик (Pop) ---
  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    
    // Быстрый свип частоты вверх для эффекта пузырька
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // --- Игривое хихиканье миньона (Giggle) ---
  playGiggle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [587.33, 739.99, 880, 1046.5, 880, 1174.66];
    let time = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 20 - 10), time + i * 0.07);

      gain.gain.setValueAtTime(0.18, time + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, time + i * 0.07 + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time + i * 0.07);
      osc.stop(time + i * 0.07 + 0.07);
    });
  }

  // --- Бананка / Вкусняшка (Chomp / Banana) ---
  playBanana() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Тройной забавный звук хрум-хрум
    [0, 0.12, 0.24].forEach((delay, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const f = idx === 2 ? 659.25 : 523.25;
      osc.frequency.setValueAtTime(f, now + delay);
      osc.frequency.exponentialRampToValueAtTime(f * 1.5, now + delay + 0.08);

      gain.gain.setValueAtTime(0.15, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.1);
    });
  }

  // --- Волшебные искры / Блестки (Sparkle) ---
  playSparkle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    const now = this.ctx.currentTime;

    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.26);
    });
  }

  // --- Победная фанфара / Праздник (Fanfare) ---
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.35 }  // C6
    ];

    let t = this.ctx.currentTime;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d);
      t += note.d + 0.02;
    });
  }

  // --- Нежная музыкальная шкатулка (Music Box Lullaby) ---
  toggleMusic(onToggleCallback) {
    this.init();
    if (this.isMusicPlaying) {
      this.stopMusic();
      if (onToggleCallback) onToggleCallback(false);
    } else {
      this.startMusic();
      if (onToggleCallback) onToggleCallback(true);
    }
  }

  startMusic() {
    if (!this.ctx) this.init();
    this.isMusicPlaying = true;

    // Тёплая, романтичная колыбельная / мелодия музыкальной шкатулки (C - Am - F - G)
    const notesSeq = [
      // Куплет 1
      523.25, 659.25, 783.99, 659.25,  // C, E, G, E
      440.00, 523.25, 659.25, 523.25,  // A, C, E, C
      349.23, 440.00, 523.25, 440.00,  // F, A, C, A
      392.00, 493.88, 587.33, 783.99,  // G, B, D, G
      // Куплет 2 с колокольчиками
      523.25, 783.99, 1046.50, 783.99, // C, G, C, G
      440.00, 659.25, 880.00, 659.25,  // A, E, A, E
      349.23, 523.25, 698.46, 523.25,  // F, C, F, C
      392.00, 587.33, 783.99, 1046.50  // G, D, G, C
    ];

    let index = 0;
    const tempoMs = 380; // Медленный, убаюкивающий темп

    this.musicInterval = setInterval(() => {
      if (!this.isMusicPlaying || this.isMuted || !this.ctx) return;

      const freq = notesSeq[index % notesSeq.length];
      index++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Звук кристаллического колокольчика / шкатулки
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Вторая гармоника для волшебного блеска
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      gain2.gain.setValueAtTime(0.02, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
      osc2.start(now);
      osc2.stop(now + 0.9);

    }, tempoMs);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

// Экспортируем глобальный экземпляр
window.cuteAudio = new CuteSoundEngine();
