/**
 * game.js — Мини-игра "Поймай бананы и поцелуи для миньона"
 * Рекорд обнулен для Вики!
 */

class CuteMinionGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.isPlaying = false;
    this.score = 0;
    this.lives = 3;

    // Сброс рекорда (обнулен по просьбе пользователя)
    localStorage.removeItem('minion_game_highscore');
    this.highScore = 0;

    // Персонаж (Миньон Боб с корзинкой)
    this.player = {
      x: 200,
      y: 0,
      width: 70,
      height: 70,
      targetX: 200,
      speed: 0.18
    };

    this.items = [];
    this.particles = [];
    this.spawnTimer = 0;
    this.lastTime = 0;

    this.itemTypes = [
      { type: 'banana', emoji: '🍌', score: 10, prob: 0.4 },
      { type: 'heart',  emoji: '💖', score: 15, prob: 0.35 },
      { type: 'star',   emoji: '⭐', score: 25, prob: 0.15 },
      { type: 'cloud',  emoji: '🌧️', score: -1, isDanger: true, prob: 0.1 }
    ];

    this.setupListeners();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.player.y = this.height - 75;
    this.drawStartScreen();
  }

  setupListeners() {
    const handleMove = (clientX) => {
      if (!this.isPlaying) return;
      const rect = this.canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      this.player.targetX = Math.max(35, Math.min(this.width - 35, relativeX));
    };

    this.canvas.addEventListener('mousemove', (e) => handleMove(e.clientX));
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;
      if (e.key === 'ArrowLeft') {
        this.player.targetX = Math.max(35, this.player.targetX - 35);
      } else if (e.key === 'ArrowRight') {
        this.player.targetX = Math.min(this.width - 35, this.player.targetX + 35);
      }
    });
  }

  start() {
    this.isPlaying = true;
    this.score = 0;
    this.lives = 3;
    this.items = [];
    this.particles = [];
    this.updateHUD();

    const overlay = document.getElementById('game-overlay');
    if (overlay) overlay.classList.add('hidden');

    if (window.cuteAudio) window.cuteAudio.playPop();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  spawnItem() {
    const rand = Math.random();
    let accumulated = 0;
    let chosen = this.itemTypes[0];

    for (let t of this.itemTypes) {
      accumulated += t.prob;
      if (rand <= accumulated) {
        chosen = t;
        break;
      }
    }

    this.items.push({
      x: Math.random() * (this.width - 60) + 30,
      y: -30,
      speed: 2 + Math.random() * 2 + (this.score / 150),
      type: chosen.type,
      emoji: chosen.emoji,
      score: chosen.score,
      isDanger: chosen.isDanger || false,
      size: 28,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.05
    });
  }

  createBurst(x, y, color = '#FF6B97') {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: 3 + Math.random() * 4
      });
    }
  }

  loop(currentTime) {
    if (!this.isPlaying) return;

    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Плавное следование за курсором
    this.player.x += (this.player.targetX - this.player.x) * 0.25;

    // Спавн предметов
    this.spawnTimer += delta;
    if (this.spawnTimer > Math.max(0.45, 1.0 - (this.score / 400))) {
      this.spawnTimer = 0;
      this.spawnItem();
    }

    // Обновление предметов
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += item.speed;
      item.rotation += item.rotSpeed;

      // Коллизия с корзинкой/миньоном
      const dist = Math.hypot(item.x - this.player.x, item.y - (this.player.y + 15));
      if (dist < 42) {
        if (item.isDanger) {
          // Попадание тучки
          this.lives--;
          this.createBurst(item.x, item.y, '#9E9E9E');
          if (window.cuteAudio) window.cuteAudio.playPop();
          this.updateHUD();
          if (this.lives <= 0) {
            this.gameOver();
            return;
          }
        } else {
          // Успешный сбор вкусняшки или сердечка
          this.score += item.score;
          if (item.type === 'banana' && window.cuteAudio) {
            window.cuteAudio.playBanana();
          } else if (window.cuteAudio) {
            window.cuteAudio.playSparkle();
          }
          this.createBurst(item.x, item.y, item.type === 'banana' ? '#FCD022' : '#FF6B97');
          this.updateHUD();
        }
        this.items.splice(i, 1);
        continue;
      }

      // Пропуск сердечка
      if (item.y > this.height + 40) {
        if (!item.isDanger && item.type === 'heart') {
          this.lives--;
          this.updateHUD();
          if (this.lives <= 0) {
            this.gameOver();
            return;
          }
        }
        this.items.splice(i, 1);
      }
    }

    // Обновление частиц
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Частицы
    for (let p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Падающие предметы
    for (let item of this.items) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      ctx.font = `${item.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.emoji, 0, 0);
      ctx.restore();
    }

    // Игрок (Миньон Боб)
    this.drawPlayer(this.player.x, this.player.y);
  }

  drawPlayer(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Корзинка
    ctx.fillStyle = '#FFE0EB';
    ctx.beginPath();
    ctx.roundRect(-36, 12, 72, 14, 6);
    ctx.fill();
    ctx.strokeStyle = '#FF6B97';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Голова и очки Миньона
    ctx.fillStyle = '#FCD022';
    ctx.beginPath();
    ctx.arc(0, 0, 24, Math.PI, 0, false);
    ctx.fill();

    // Очки
    ctx.fillStyle = '#444';
    ctx.fillRect(-24, -12, 48, 4);
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(-8, -10, 8, 0, Math.PI * 2);
    ctx.arc(8, -10, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#71A028';
    ctx.beginPath();
    ctx.arc(-8, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#805128';
    ctx.beginPath();
    ctx.arc(8, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Розовые щёчки
    ctx.fillStyle = 'rgba(255, 107, 151, 0.6)';
    ctx.beginPath();
    ctx.arc(-14, 4, 4, 0, Math.PI * 2);
    ctx.arc(14, 4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawStartScreen() {
    this.drawPlayer(this.width / 2, this.height - 75);
  }

  updateHUD() {
    const scoreElem = document.getElementById('game-score');
    if (scoreElem) scoreElem.innerText = this.score;

    const livesElem = document.getElementById('game-lives');
    if (livesElem) {
      livesElem.innerHTML = '💖'.repeat(Math.max(0, this.lives)) + '🖤'.repeat(Math.max(0, 3 - this.lives));
    }
  }

  gameOver() {
    this.isPlaying = false;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('minion_game_highscore', this.highScore);
    }

    if (window.cuteAudio) window.cuteAudio.playFanfare();

    const overlay = document.getElementById('game-overlay');
    const title = document.getElementById('game-overlay-title');
    const desc = document.getElementById('game-overlay-desc');
    const btn = document.getElementById('game-start-btn');

    if (overlay && title && desc && btn) {
      title.innerText = 'Викуля, ты супер-молодец! 💖';
      desc.innerHTML = `Твой счёт: <b>${this.score}</b> очков!<br>Рекорд: <b>${this.highScore}</b>.<br>Миньоны отправляют тебе миллион тёплых обнимашек! 🥰`;
      btn.innerText = 'Сыграть ещё раз 🍌';
      overlay.classList.remove('hidden');
    }
  }
}

window.CuteMinionGame = CuteMinionGame;
