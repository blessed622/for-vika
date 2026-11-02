/**
 * app.js — Главный контроллер приложения, событий, анимаций и интерактива
 * Специально для Вики 💛
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация состояния (Имя навсегда зафиксировано: Вика)
  const state = {
    userName: 'Вика',
    minionHappiness: parseInt(localStorage.getItem('minion_happiness') || '85', 10),
    activeAccessory: 'none',
    activeCategory: 'all'
  };

  // 2. Персонализация имени (зафиксировано перманентно)
  const greetingNameSpan = document.getElementById('hero-greeting-name');
  const letterToSpan = document.getElementById('letter-recipient-name');
  if (greetingNameSpan) greetingNameSpan.innerText = 'Вика';
  if (letterToSpan) letterToSpan.innerText = 'Вика';

  // 3. Автозапуск музыки при открытии сайта
  const musicBtn = document.getElementById('music-toggle-btn');
  
  const activateMusic = () => {
    if (!window.cuteAudio.isMusicPlaying) {
      window.cuteAudio.startMusic();
      if (musicBtn) {
        musicBtn.classList.add('playing');
        const textSpan = musicBtn.querySelector('.music-btn-text');
        if (textSpan) textSpan.innerText = 'Мелодия играет';
      }
    }
  };

  // Попытка прямого запуска сразу
  try {
    activateMusic();
  } catch (e) {
    console.log('Autoplay waiting for first touch/click');
  }

  // Гарантированный запуск при первом касании / клике / скролле
  ['click', 'touchstart', 'scroll', 'keydown'].forEach((event) => {
    window.addEventListener(event, () => {
      activateMusic();
    }, { once: true, passive: true });
  });

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      window.cuteAudio.toggleMusic((isPlaying) => {
        if (isPlaying) {
          musicBtn.classList.add('playing');
          musicBtn.querySelector('.music-btn-text').innerText = 'Мелодия играет';
        } else {
          musicBtn.classList.remove('playing');
          musicBtn.querySelector('.music-btn-text').innerText = 'Музыка';
        }
      });
    });
  }

  // 4. Рендер векторного Боба в Hero и настройка слежения за курсором
  MinionRenderer.renderBob('minion-hero-stage', state.activeAccessory);
  MinionRenderer.setupEyeTracking('minion-hero-stage');

  // Переключение гардероба Боба
  const wardrobeButtons = document.querySelectorAll('.wardrobe-btn');
  wardrobeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      wardrobeButtons.forEach(b => b.classList.remove('active'));
      const acc = btn.dataset.acc;
      if (state.activeAccessory === acc) {
        state.activeAccessory = 'none';
      } else {
        state.activeAccessory = acc;
        btn.classList.add('active');
      }
      MinionRenderer.renderBob('minion-hero-stage', state.activeAccessory);
      if (window.cuteAudio) window.cuteAudio.playPop();
      spawnFloatingEmojis(btn, ['✨', '👑', '🌸', '🍌'][Math.floor(Math.random() * 4)]);
    });
  });

  // Клик по Бобу в Hero — хихиканье и сердечки
  const heroStage = document.getElementById('minion-hero-stage');
  const heroSpeech = document.getElementById('minion-speech-text');
  const heroSpeeches = [
    'Bello, Викуля! 💛',
    'Вика самая красивая! ✨',
    'Banana для Вики! 🍌',
    'Обнимашки! 🤗',
    'Poopaye! 💖',
    'Улыбнись, солнце! ☀️'
  ];

  if (heroStage) {
    heroStage.addEventListener('click', (e) => {
      if (window.cuteAudio) window.cuteAudio.playGiggle();
      spawnHeartBurst(e.clientX, e.clientY);

      const randomPhrase = heroSpeeches[Math.floor(Math.random() * heroSpeeches.length)];
      if (heroSpeech) heroSpeech.innerText = randomPhrase;

      heroStage.classList.add('bouncing');
      setTimeout(() => heroStage.classList.remove('bouncing'), 400);
    });
  }

  // 5. Генератор комплиментов
  const complimentText = document.getElementById('compliment-text');
  const complimentAuthor = document.getElementById('compliment-author');
  const btnGenerateCompliment = document.getElementById('btn-generate-compliment');
  const categoryChips = document.querySelectorAll('.category-chip');

  const showNewCompliment = () => {
    if (window.cuteAudio) window.cuteAudio.playPop();

    const data = ComplimentDB.getRandomCompliment('Вика', state.activeCategory);
    
    if (complimentText) {
      complimentText.style.opacity = '0';
      complimentText.style.transform = 'translateY(10px)';
      setTimeout(() => {
        complimentText.innerText = data.text;
        if (complimentAuthor) complimentAuthor.innerText = `— ${data.author}`;
        complimentText.style.opacity = '1';
        complimentText.style.transform = 'translateY(0)';
      }, 250);
    }
  };

  if (btnGenerateCompliment) {
    btnGenerateCompliment.addEventListener('click', () => {
      showNewCompliment();
      createConfettiAt(btnGenerateCompliment.getBoundingClientRect());
    });
  }

  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeCategory = chip.dataset.cat;
      showNewCompliment();
    });
  });

  // 6. Уход за миньоном Бобом (Care & 100% Super Love Explosion)
  const happinessFill = document.getElementById('happiness-fill');
  const happinessPercent = document.getElementById('happiness-percent');
  const careStage = document.getElementById('care-stage');
  const overflowBadge = document.getElementById('happiness-overflow-badge');

  if (careStage) {
    MinionRenderer.renderBob('care-stage', 'flower');
  }

  const updateHappiness = (amount) => {
    state.minionHappiness = Math.min(100, Math.max(0, state.minionHappiness + amount));
    localStorage.setItem('minion_happiness', state.minionHappiness);
    
    if (happinessFill) {
      happinessFill.style.width = `${state.minionHappiness}%`;
      if (state.minionHappiness >= 100) {
        happinessFill.classList.add('maxed-out');
        if (overflowBadge) overflowBadge.classList.add('visible');
      }
    }
    if (happinessPercent) {
      happinessPercent.innerText = `${state.minionHappiness}%`;
    }
  };
  updateHappiness(0);

  // Кнопки ухода за Бобом
  const petActionButtons = document.querySelectorAll('.pet-action-btn');
  petActionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.action;
      const rect = btn.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2;
      const clientY = rect.top;

      // Если счастье уже 100% или достигло 100% — взрыв супер-любви!
      if (state.minionHappiness >= 100) {
        triggerSuperLoveFountain(careStage || btn);
        if (window.cuteAudio) {
          window.cuteAudio.playSparkle();
          window.cuteAudio.playGiggle();
        }
        if (careStage) {
          careStage.classList.add('super-excited');
          setTimeout(() => careStage.classList.remove('super-excited'), 1200);
        }
      }

      if (action === 'feed') {
        if (window.cuteAudio) window.cuteAudio.playBanana();
        spawnFloatingEmojis(btn, '🍌');
        updateHappiness(8);
        MinionRenderer.renderBob('care-stage', 'banana');
      } else if (action === 'hug') {
        if (window.cuteAudio) window.cuteAudio.playGiggle();
        spawnHeartBurst(clientX, clientY);
        updateHappiness(10);
        MinionRenderer.renderBob('care-stage', 'none');
      } else if (action === 'flower') {
        if (window.cuteAudio) window.cuteAudio.playSparkle();
        spawnFloatingEmojis(btn, '🌸');
        updateHappiness(12);
        MinionRenderer.renderBob('care-stage', 'flower');
      } else if (action === 'crown') {
        if (window.cuteAudio) window.cuteAudio.playFanfare();
        spawnFloatingEmojis(btn, '👑');
        updateHappiness(15);
        MinionRenderer.renderBob('care-stage', 'crown');
      }
    });
  });

  // 7. Колесо милых нематериальных желаний
  const cuteWheel = new CuteWheel('wheel-canvas');
  const spinWheelBtn = document.getElementById('spin-wheel-btn');
  const couponModal = document.getElementById('coupon-modal');
  const couponModalClose = document.getElementById('coupon-modal-close');
  const couponResultText = document.getElementById('coupon-result-text');
  const couponIconBadge = document.getElementById('coupon-icon-badge');

  if (spinWheelBtn && cuteWheel) {
    spinWheelBtn.addEventListener('click', () => {
      spinWheelBtn.disabled = true;
      cuteWheel.spin((wonItem) => {
        spinWheelBtn.disabled = false;
        if (couponResultText) couponResultText.innerText = wonItem.text;
        if (couponIconBadge) couponIconBadge.innerText = wonItem.icon;
        if (couponModal) couponModal.classList.add('active');
        fullScreenConfetti();
      });
    });
  }

  if (couponModalClose) {
    couponModalClose.addEventListener('click', () => {
      if (couponModal) couponModal.classList.remove('active');
    });
  }

  // 8. Мини-игра "Поймай бананы"
  const game = new CuteMinionGame('game-canvas');
  const gameStartBtn = document.getElementById('game-start-btn');
  if (gameStartBtn && game) {
    gameStartBtn.addEventListener('click', () => {
      game.start();
    });
  }

  // 9. SOS-кнопка экстренного поднятия настроения
  const sosBtn = document.getElementById('sos-big-btn');
  const sosModal = document.getElementById('sos-modal');
  const sosModalClose = document.getElementById('sos-modal-close');

  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      if (window.cuteAudio) {
        window.cuteAudio.playFanfare();
      }
      fullScreenConfetti();
      if (sosModal) sosModal.classList.add('active');
    });
  }

  if (sosModalClose) {
    sosModalClose.addEventListener('click', () => {
      if (sosModal) sosModal.classList.remove('active');
    });
  }

  // 10. Письмо в конверте и редактирование
  const letterBody = document.getElementById('letter-content-text');
  const editLetterBtn = document.getElementById('edit-letter-btn');
  const defaultLetter = localStorage.getItem('minion_love_letter') || 
`Привет, моя дорогая Викуля! ✨

Я создал эту страничку специально для тебя, чтобы напомнить: ты самый очаровательный, добрый и невероятный человечек на всём белом свете!

Когда ты улыбаешься, весь мир вокруг становится чуточку светлее и теплее. Даже миньоны отложили все свои любимые бананы, чтобы спеть песню в твою честь!

Никогда не грусти, сияй своей волшебной улыбкой и знай: я всегда рядом, чтобы поддержать тебя, крепко обнять и порадовать вкусняшкой.

Люблю тебя до Луны и обратно, Викуся! 💖`;

  if (letterBody) {
    letterBody.innerText = defaultLetter;
  }

  if (editLetterBtn && letterBody) {
    editLetterBtn.addEventListener('click', () => {
      const isEditing = letterBody.getAttribute('contenteditable') === 'true';
      if (isEditing) {
        letterBody.setAttribute('contenteditable', 'false');
        editLetterBtn.innerText = '✏️ Редактировать текст';
        localStorage.setItem('minion_love_letter', letterBody.innerText);
        if (window.cuteAudio) window.cuteAudio.playSparkle();
      } else {
        letterBody.setAttribute('contenteditable', 'true');
        letterBody.focus();
        editLetterBtn.innerText = '💾 Сохранить послание';
      }
    });
  }

  // 11. Фоновый холст с летающими мыльными пузырями и сердечками
  initFloatingCanvas();
});

// ---------------------------------------------------------------------------
// Фонтан сердечек при 100% радости Боба
// ---------------------------------------------------------------------------
function triggerSuperLoveFountain(anchorElement) {
  const rect = anchorElement.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 3;

  const heartEmojis = ['💖', '💕', '💗', '💓', '💞', '🌸', '✨', '🥰', '👑', '🍌'];

  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'fountain-heart';
      heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

      const dx = (Math.random() - 0.5) * 360;
      const dy = -(120 + Math.random() * 260);
      const rot = (Math.random() - 0.5) * 180;
      const size = 20 + Math.random() * 24;

      heart.style.left = `${startX}px`;
      heart.style.top = `${startY}px`;
      heart.style.fontSize = `${size}px`;
      heart.style.setProperty('--dx', `${dx}px`);
      heart.style.setProperty('--dy', `${dy}px`);
      heart.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 2100);
    }, i * 35);
  }
}

// ---------------------------------------------------------------------------
// Фоновый холст с мыльными пузырями и сердечками
// ---------------------------------------------------------------------------
function initFloatingCanvas() {
  const canvas = document.getElementById('floating-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const bubbles = [];
  const numBubbles = 24;

  for (let i = 0; i < numBubbles; i++) {
    bubbles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 12 + Math.random() * 22,
      speedY: 0.3 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.4,
      hue: Math.random() > 0.5 ? 330 : 45,
      opacity: 0.25 + Math.random() * 0.35,
      isHeart: Math.random() > 0.6
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let b of bubbles) {
      b.y -= b.speedY;
      b.x += b.speedX;

      if (b.y < -40) {
        b.y = height + 40;
        b.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = b.opacity;

      if (b.isHeart) {
        ctx.fillStyle = `hsl(${b.hue}, 90%, 75%)`;
        ctx.font = `${b.radius * 1.2}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', b.x, b.y);
      } else {
        const grad = ctx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.5, `hsla(${b.hue}, 80%, 75%, 0.35)`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.4, b.y - b.radius * 0.4, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(loop);
  }

  loop();
}

function spawnHeartBurst(x, y) {
  const emojis = ['💖', '💕', '💗', '✨', '🥰'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.position = 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${16 + Math.random() * 16}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.transition = 'transform 1s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 1s ease';

    document.body.appendChild(el);

    const angle = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5) * 0.5;
    const distance = 40 + Math.random() * 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy - 30}px) scale(1.3)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 1000);
  }
}

function spawnFloatingEmojis(targetElem, emoji) {
  const rect = targetElem.getBoundingClientRect();
  const el = document.createElement('div');
  el.innerText = emoji;
  el.style.position = 'fixed';
  el.style.left = `${rect.left + rect.width / 2}px`;
  el.style.top = `${rect.top}px`;
  el.style.fontSize = '24px';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '9999';
  el.style.transition = 'all 0.9s cubic-bezier(0.2, 0.9, 0.3, 1)';

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = `translate(-50%, -60px) scale(1.4)`;
    el.style.opacity = '0';
  });

  setTimeout(() => el.remove(), 900);
}

function createConfettiAt(rect) {
  const x = rect.left + rect.width / 2;
  const y = rect.top;
  spawnHeartBurst(x, y);
}

function fullScreenConfetti() {
  const emojis = ['💖', '🍌', '⭐', '🌸', '✨', '🎉', '🥰'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.position = 'fixed';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = '-20px';
      el.style.fontSize = `${20 + Math.random() * 20}px`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '99999';
      el.style.transition = `transform ${2 + Math.random() * 2}s linear, opacity ${2 + Math.random() * 2}s linear`;

      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translate(${(Math.random() - 0.5) * 200}px, 105vh) rotate(${Math.random() * 720}deg)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 4000);
    }, i * 40);
  }
}
