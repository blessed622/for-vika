/**
 * minion-svg.js — Векторный генератор и интерактивный рендерер миньонов
 * Поддерживает слежение глазами за курсором, смену нарядов и милые эмоции!
 */

const MinionRenderer = {
  // Рендер интерактивного Боба
  renderBob(container, accessory = 'none') {
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }
    if (!container) return;

    // SVG код Боба с детализацией: очки, комбинезон, гетерохромия глаз, румяна
    const svgCode = `
      <svg viewBox="0 0 200 240" class="minion-svg-elem" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Тени и градиенты -->
          <linearGradient id="minionBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE853" />
            <stop offset="70%" stop-color="#FCD022" />
            <stop offset="100%" stop-color="#EBB608" />
          </linearGradient>

          <linearGradient id="denimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4C8AD8" />
            <stop offset="100%" stop-color="#2D5FA0" />
          </linearGradient>

          <linearGradient id="goggleMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EEEEEE" />
            <stop offset="50%" stop-color="#B0B0B0" />
            <stop offset="100%" stop-color="#7B7B7B" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Тень под ногами -->
        <ellipse cx="100" cy="232" rx="55" ry="8" fill="rgba(255, 107, 151, 0.15)" />

        <!-- Обувь -->
        <g id="minion-feet">
          <ellipse cx="78" cy="226" rx="15" ry="9" fill="#282828" />
          <ellipse cx="122" cy="226" rx="15" ry="9" fill="#282828" />
        </g>

        <!-- Тело Миньона (округлое, пухленькое) -->
        <g id="minion-body-group">
          <rect x="42" y="32" width="116" height="175" rx="58" fill="url(#minionBodyGrad)" />
          
          <!-- Ремешок очков -->
          <rect x="39" y="80" width="122" height="15" fill="#2B2B2B" rx="4" />
        </g>

        <!-- Ручки миньона (по умолчанию машут или держат аксессуар) -->
        <g id="minion-arms">
          <!-- Левая рука -->
          <path d="M 45 130 C 25 140, 20 160, 32 175" fill="none" stroke="#FCD022" stroke-width="12" stroke-linecap="round" />
          <circle cx="33" cy="177" r="9" fill="#282828" />
          
          <!-- Правая рука -->
          <path d="M 155 130 C 175 140, 180 160, 168 175" fill="none" stroke="#FCD022" stroke-width="12" stroke-linecap="round" />
          <circle cx="167" cy="177" r="9" fill="#282828" />
        </g>

        <!-- Джинсовый комбинезон -->
        <g id="minion-overalls">
          <!-- Основная часть комбинезона -->
          <path d="M 42 165 C 42 195, 60 215, 100 215 C 140 215, 158 195, 158 165 L 158 152 L 140 152 L 140 142 L 60 142 L 60 152 L 42 152 Z" fill="url(#denimGrad)" />
          
          <!-- Лямки -->
          <line x1="45" y1="120" x2="68" y2="152" stroke="#2D5FA0" stroke-width="9" stroke-linecap="round" />
          <line x1="155" y1="120" x2="132" y2="152" stroke="#2D5FA0" stroke-width="9" stroke-linecap="round" />
          
          <!-- Пуговицы на лямках -->
          <circle cx="68" cy="150" r="3.5" fill="#1C1C1C" />
          <circle cx="132" cy="150" r="3.5" fill="#1C1C1C" />

          <!-- Карман с сердечком -->
          <path d="M 82 168 L 118 168 C 118 184, 114 192, 100 192 C 86 192, 82 184, 82 168 Z" fill="#254E84" />
          <path d="M 100 174 C 98 171, 94 171, 94 175 C 94 180, 100 184, 100 185 C 100 184, 106 180, 106 175 C 106 171, 102 171, 100 174 Z" fill="#FF6B97" />
        </g>

        <!-- Очки и Глаза Боба (Гетерохромия: Зеленый и Карий) -->
        <g id="minion-eyes">
          <!-- Левый окуляр (для зрителя слева) -->
          <circle cx="77" cy="88" r="26" fill="url(#goggleMetal)" />
          <circle cx="77" cy="88" r="20" fill="#FFFFFF" />
          <!-- Левая радужка (Зелёная) -->
          <g class="bob-pupil-left">
            <circle cx="77" cy="88" r="9" fill="#71A028" />
            <circle cx="77" cy="88" r="5" fill="#1A1A1A" />
            <circle cx="74" cy="85" r="3" fill="#FFFFFF" opacity="0.9" />
          </g>

          <!-- Правый окуляр (для зрителя справа) -->
          <circle cx="123" cy="88" r="26" fill="url(#goggleMetal)" />
          <circle cx="123" cy="88" r="20" fill="#FFFFFF" />
          <!-- Правая радужка (Каряя / Тёплая ореховая) -->
          <g class="bob-pupil-right">
            <circle cx="123" cy="88" r="9" fill="#805128" />
            <circle cx="123" cy="88" r="5" fill="#1A1A1A" />
            <circle cx="120" cy="85" r="3" fill="#FFFFFF" opacity="0.9" />
          </g>
          
          <!-- Соединительный мостик очков -->
          <rect x="99" y="84" width="2" height="8" fill="#777" />
        </g>

        <!-- Нежные розовые щёчки (Блаш) -->
        <g id="minion-cheeks">
          <ellipse cx="60" cy="116" rx="9" ry="5.5" fill="#FF6B97" opacity="0.45" />
          <ellipse cx="140" cy="116" rx="9" ry="5.5" fill="#FF6B97" opacity="0.45" />
        </g>

        <!-- Ротик (Милая улыбка) -->
        <g id="minion-mouth">
          <path id="mouth-path" d="M 86 116 Q 100 128 114 116" fill="none" stroke="#7A4B1A" stroke-width="3" stroke-linecap="round" />
        </g>

        <!-- Слой аксессуаров (Динамический) -->
        <g id="accessory-layer">
          ${MinionRenderer.getAccessorySvg(accessory)}
        </g>
      </svg>
    `;

    container.innerHTML = svgCode;
  },

  // Генерация элементов гардероба
  getAccessorySvg(acc) {
    switch (acc) {
      case 'crown':
        return `
          <!-- Корона Короля Боба -->
          <g id="acc-crown" transform="translate(68, 8)">
            <polygon points="0,26 12,5 32,22 52,5 64,26" fill="#FFD700" stroke="#D4AF37" stroke-width="2" />
            <circle cx="12" cy="5" r="3.5" fill="#FF2E63" />
            <circle cx="32" cy="22" r="3" fill="#08D9D6" />
            <circle cx="52" cy="5" r="3.5" fill="#FF2E63" />
            <rect x="0" y="24" width="64" height="6" rx="2" fill="#E5B800" />
            <circle cx="16" cy="27" r="1.5" fill="#FFF" />
            <circle cx="32" cy="27" r="1.5" fill="#FFF" />
            <circle cx="48" cy="27" r="1.5" fill="#FFF" />
          </g>
        `;
      case 'flower':
        return `
          <!-- Розочка в руке -->
          <g id="acc-flower" transform="translate(148, 135)">
            <path d="M 12 30 Q 8 10 2 0" stroke="#4CAF50" stroke-width="3" fill="none" />
            <path d="M 8 18 Q 16 16 12 12" fill="#81C784" />
            <circle cx="0" cy="0" r="10" fill="#FF4D82" />
            <circle cx="-2" cy="-2" r="6" fill="#FF7597" />
            <circle cx="-4" cy="-4" r="3" fill="#FFAAC9" />
          </g>
        `;
      case 'glasses':
        return `
          <!-- Очки-сердечки -->
          <g id="acc-glasses" transform="translate(56, 73)">
            <path d="M 22 10 C 14 0, 0 4, 0 16 C 0 26, 22 36, 22 36 C 22 36, 44 26, 44 16 C 44 4, 30 0, 22 10 Z" fill="rgba(255, 107, 151, 0.7)" stroke="#FF3366" stroke-width="2.5" />
            <path d="M 66 10 C 58 0, 44 4, 44 16 C 44 26, 66 36, 66 36 C 66 36, 88 26, 88 16 C 88 4, 74 0, 66 10 Z" fill="rgba(255, 107, 151, 0.7)" stroke="#FF3366" stroke-width="2.5" />
            <line x1="38" y1="18" x2="50" y2="18" stroke="#FF3366" stroke-width="2.5" />
          </g>
        `;
      case 'catears':
        return `
          <!-- Кошачьи ушки -->
          <g id="acc-catears" transform="translate(50, 16)">
            <path d="M 6 22 L 18 2 L 32 18 Z" fill="#FFAAC9" stroke="#FF6B97" stroke-width="2.5" />
            <path d="M 12 18 L 18 8 L 26 16 Z" fill="#FFFFFF" />
            <path d="M 94 22 L 82 2 L 68 18 Z" fill="#FFAAC9" stroke="#FF6B97" stroke-width="2.5" />
            <path d="M 88 18 L 82 8 L 74 16 Z" fill="#FFFFFF" />
            <path d="M 16 22 Q 50 12 84 22" stroke="#FF6B97" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
        `;
      case 'banana':
        return `
          <!-- Бананчик -->
          <g id="acc-banana" transform="translate(125, 130)">
            <path d="M 5 25 C 25 15, 38 35, 45 55 C 38 52, 20 40, 5 25 Z" fill="#FFE135" stroke="#E5C100" stroke-width="2" />
            <rect x="3" y="24" width="4" height="4" fill="#6B4B18" rx="1" />
            <circle cx="44" cy="54" r="2" fill="#6B4B18" />
          </g>
        `;
      default:
        return '';
    }
  },

  // Слежение глаз за курсором
  setupEyeTracking(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(6, Math.hypot(dx, dy) / 40);

      const offsetX = Math.cos(angle) * dist;
      const offsetY = Math.sin(angle) * dist;

      const leftPupil = container.querySelector('.bob-pupil-left');
      const rightPupil = container.querySelector('.bob-pupil-right');

      if (leftPupil) {
        leftPupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
      if (rightPupil) {
        rightPupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    });
  },

  // Иконка миньона для карточек и комплиментов
  getMinionAvatarSvg(type = 'bob') {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FFF9DE" stroke="#FFD84D" stroke-width="3" />
        <ellipse cx="50" cy="52" rx="30" ry="34" fill="#FCD022" />
        <!-- Очки -->
        <rect x="18" y="42" width="64" height="6" fill="#333" rx="2" />
        <circle cx="40" cy="45" r="14" fill="#B0B0B0" />
        <circle cx="40" cy="45" r="10" fill="#FFF" />
        <circle cx="40" cy="45" r="4.5" fill="#71A028" />
        <circle cx="40" cy="45" r="2" fill="#111" />

        <circle cx="60" cy="45" r="14" fill="#B0B0B0" />
        <circle cx="60" cy="45" r="10" fill="#FFF" />
        <circle cx="60" cy="45" r="4.5" fill="#805128" />
        <circle cx="60" cy="45" r="2" fill="#111" />

        <!-- Румяна -->
        <circle cx="32" cy="62" r="5" fill="#FF6B97" opacity="0.5" />
        <circle cx="68" cy="62" r="5" fill="#FF6B97" opacity="0.5" />

        <!-- Улыбка -->
        <path d="M 44 65 Q 50 72 56 65" stroke="#7A4B1A" stroke-width="2" fill="none" stroke-linecap="round" />
      </svg>
    `;
  }
};

window.MinionRenderer = MinionRenderer;
