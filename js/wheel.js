/**
 * wheel.js — Колесо милых нематериальных желаний для Вики
 * Точный список желаний от пользователя с умным переносом строк
 */

class CuteWheel {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // 8 точных желаний, запрошенных пользователем
    this.items = [
      { text: "Массаж спинки", icon: "💆‍♀️", color: "#FF9EAA" },
      { text: "100 поцелуев", icon: "💋", color: "#FFAAC9" },
      { text: "Час обнимашек", icon: "🧸", color: "#FF85A2" },
      { text: "Вечер нежности", icon: "🌸", color: "#B388FF" },
      { text: "День королевы", icon: "👑", color: "#FFD166" },
      { text: "10 причин, почему я тебя люблю", icon: "💌", color: "#80ED99" },
      { text: "День маленькой принцессы", icon: "🥹", color: "#7AE7C7" },
      { text: "Три желания", icon: "🎀", color: "#90E0EF" }
    ];

    this.numSegments = this.items.length;
    this.anglePerSegment = (2 * Math.PI) / this.numSegments;
    this.currentRotation = 0; // в радианах
    this.isSpinning = false;

    this.resizeCanvas();
    this.draw();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const size = rect.width || 320;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.scale(dpr, dpr);
    this.size = size;
  }

  draw() {
    if (!this.ctx) return;
    const size = this.size || 320;
    const radius = size / 2;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(this.currentRotation);

    for (let i = 0; i < this.numSegments; i++) {
      const angleStart = i * this.anglePerSegment;
      const angleEnd = angleStart + this.anglePerSegment;
      const item = this.items[i];

      // Отрисовка сектора
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 8, angleStart, angleEnd);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Белая разделительная линия
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Отрисовка текста и иконки
      ctx.save();
      ctx.rotate(angleStart + this.anglePerSegment / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#333333";

      // Если текст длинный — рисуем в две аккуратные строчки
      if (item.text.length > 16) {
        ctx.font = "bold 10.5px 'Comfortaa', sans-serif";
        let line1 = "";
        let line2 = "";
        if (item.text.includes("10 причин")) {
          line1 = `${item.icon} 10 причин,`;
          line2 = "почему я люблю";
        } else if (item.text.includes("маленькой принцессы")) {
          line1 = `${item.icon} День маленькой`;
          line2 = "принцессы";
        } else {
          const parts = item.text.split(" ");
          line1 = `${item.icon} ${parts.slice(0, Math.ceil(parts.length / 2)).join(" ")}`;
          line2 = parts.slice(Math.ceil(parts.length / 2)).join(" ");
        }
        ctx.fillText(line1, radius - 16, -6);
        ctx.fillText(line2, radius - 16, 8);
      } else {
        ctx.font = "bold 12px 'Comfortaa', sans-serif";
        ctx.fillText(`${item.icon} ${item.text}`, radius - 18, 0);
      }

      ctx.restore();
    }

    // Внешнее декоративное кольцо
    ctx.beginPath();
    ctx.arc(0, 0, radius - 8, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.restore();
  }

  spin(onFinish) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    if (window.cuteAudio) window.cuteAudio.playPop();

    // Случайный сектор назначения
    const targetIndex = Math.floor(Math.random() * this.numSegments);
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 оборотов
    
    const targetSegmentAngle = targetIndex * this.anglePerSegment + this.anglePerSegment / 2;
    const targetAngle = (3 * Math.PI / 2) - targetSegmentAngle;

    const startRotation = this.currentRotation % (2 * Math.PI);
    const totalRotation = startRotation + (fullSpins * 2 * Math.PI) + targetAngle;
    
    const startTime = performance.now();
    const duration = 4000; // 4 секунды

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      this.currentRotation = startRotation + (totalRotation - startRotation) * easeOut;

      this.draw();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        const wonItem = this.items[targetIndex];
        if (window.cuteAudio) window.cuteAudio.playFanfare();
        if (onFinish) onFinish(wonItem);
      }
    };

    requestAnimationFrame(animate);
  }
}

window.CuteWheel = CuteWheel;
