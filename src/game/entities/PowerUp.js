import { Entity } from './Entity.js';

const CONFIGS = {
  shushWave: {
    glowRGB: '80, 160, 255',
    innerFill: 'rgba(20, 50, 120, 0.9)',
    strokeRGB: '136, 204, 255',
    icon: '🤫',
    label: 'ШШШШ',
    labelColor: '#88ccff'
  },
  coffee: {
    glowRGB: '200, 120, 20',
    innerFill: 'rgba(80, 35, 5, 0.9)',
    strokeRGB: '255, 180, 60',
    icon: '☕',
    label: 'КОФЕ',
    labelColor: '#ffb040'
  },
  magnet: {
    glowRGB: '200, 60, 220',
    innerFill: 'rgba(70, 10, 80, 0.9)',
    strokeRGB: '240, 100, 255',
    icon: '🧲',
    label: 'МАГНИТ',
    labelColor: '#ee66ff'
  },
  freeze: {
    glowRGB: '60, 200, 255',
    innerFill: 'rgba(5, 60, 90, 0.9)',
    strokeRGB: '120, 240, 255',
    icon: '❄️',
    label: 'ЗАМОРОЗКА',
    labelColor: '#80eeff'
  },
  chaosVacuum: {
    glowRGB: '60, 220, 100',
    innerFill: 'rgba(5, 75, 20, 0.9)',
    strokeRGB: '80, 255, 130',
    icon: '🌀',
    label: 'ХАОС -25',
    labelColor: '#60ff90'
  }
};

export class PowerUp extends Entity {
  constructor(game, x, y, type = 'shushWave') {
    super(x, y, 36, 36);
    this.game = game;
    this.type = type;
    this.solid = false;
    this.pulseTimer = 0;
    this.floatTimer = Math.random() * Math.PI * 2;
  }

  update(deltaTime) {
    this.pulseTimer += deltaTime;
    this.floatTimer += deltaTime * 2;
  }

  render(ctx) {
    const cfg = CONFIGS[this.type] || CONFIGS.shushWave;
    const cx = this.getCenterX();
    const pulse = 1 + Math.sin(this.pulseTimer * 3) * 0.12;
    const floatY = Math.sin(this.floatTimer) * 5;
    const cy = this.getCenterY() + floatY;
    const r = 20 * pulse;

    ctx.save();

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2);
    glow.addColorStop(0, `rgba(${cfg.glowRGB}, 0.35)`);
    glow.addColorStop(1, `rgba(${cfg.glowRGB}, 0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = cfg.innerFill;
    ctx.fill();
    ctx.strokeStyle = `rgba(${cfg.strokeRGB}, ${0.7 + Math.sin(this.pulseTimer * 4) * 0.3})`;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Icon
    ctx.font = `${Math.round(20 * pulse)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cfg.icon, cx, cy);

    // Label below
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = cfg.labelColor;
    ctx.textAlign = 'center';
    ctx.fillText(cfg.label, cx, cy + r + 10);

    ctx.restore();
  }
}
