import { PhysicsBody } from '../PhysicsBody';

export class Collectible extends PhysicsBody {
  private type: 'star' | 'heart';
  private animationTime: number = 0;
  private collected: boolean = false;

  constructor(x: number, y: number, type: 'star' | 'heart') {
    super(x, y, 16, 16);
    this.type = type;
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public onCollect(): void {
    this.collected = true;
    // Update UI (this could be done through an event system)
    if (this.type === 'star') {
      const starsElement = document.getElementById('stars');
      if (starsElement) {
        const current = parseInt(starsElement.textContent || '0');
        starsElement.textContent = (current + 1).toString();
      }
    } else if (this.type === 'heart') {
      const heartsElement = document.getElementById('hearts');
      if (heartsElement) {
        const current = parseInt(heartsElement.textContent || '3');
        heartsElement.textContent = Math.min(current + 1, 5).toString();
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Floating animation
    const floatY = Math.sin(this.animationTime * 3) * 3;
    ctx.translate(0, floatY);

    // Rotation animation
    ctx.rotate(this.animationTime * 2);

    if (this.type === 'star') {
      this.drawStar(ctx);
    } else if (this.type === 'heart') {
      this.drawHeart(ctx);
    }

    ctx.restore();
  }

  private drawStar(ctx: CanvasRenderingContext2D): void {
    // Warm golden star
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#ffed4e';
    ctx.lineWidth = 1;

    const spikes = 5;
    const outerRadius = 8;
    const innerRadius = 4;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  private drawHeart(ctx: CanvasRenderingContext2D): void {
    // Warm red heart
    ctx.fillStyle = '#ff6b6b';
    ctx.strokeStyle = '#ff8787';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, 2, -4, 0, -4, -2);
    ctx.bezierCurveTo(-4, -4, -2, -4, 0, -2);
    ctx.bezierCurveTo(2, -4, 4, -4, 4, -2);
    ctx.bezierCurveTo(4, 0, 0, 2, 0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

