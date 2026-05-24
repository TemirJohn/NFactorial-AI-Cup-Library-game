import { Entity } from './Entity.js';

export class PowerUp extends Entity {
  constructor(game, x, y) {
    super(x, y, 36, 36);
    this.game = game;
    this.type = 'shushWave';
    this.solid = false;
    this.pulseTimer = 0;
    this.floatTimer = Math.random() * Math.PI * 2; // random phase
  }

  update(deltaTime) {
    this.pulseTimer += deltaTime;
    this.floatTimer += deltaTime * 2;
  }

  render(ctx) {
    const cx = this.getCenterX();
    const pulse = 1 + Math.sin(this.pulseTimer * 3) * 0.12;
    const floatY = Math.sin(this.floatTimer) * 5;
    const cy = this.getCenterY() + floatY;
    const r = 20 * pulse;

    ctx.save();

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2);
    glow.addColorStop(0, 'rgba(80, 160, 255, 0.35)');
    glow.addColorStop(1, 'rgba(80, 160, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 50, 120, 0.9)';
    ctx.fill();
    ctx.strokeStyle = `rgba(136, 204, 255, ${0.7 + Math.sin(this.pulseTimer * 4) * 0.3})`;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Icon
    ctx.font = `${Math.round(20 * pulse)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤫', cx, cy);

    // Label below
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#88ccff';
    ctx.textAlign = 'center';
    ctx.fillText('SHUSH', cx, cy + r + 10);

    ctx.restore();
  }
}
