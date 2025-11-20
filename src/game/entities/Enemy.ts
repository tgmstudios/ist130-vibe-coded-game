import { PhysicsBody } from '../PhysicsBody';

export class Enemy extends PhysicsBody {
  private startX: number;
  private endX: number;
  private direction: number = 1;
  private speed: number = 50;
  private animationTime: number = 0;

  constructor(x: number, y: number, patrolDistance: number = 100) {
    super(x, y, 24, 24);
    this.startX = x;
    this.endX = x + patrolDistance;
  }

  public update(deltaTime: number): void {
    // Patrol back and forth
    if (this.x <= this.startX) {
      this.direction = 1;
    } else if (this.x >= this.endX) {
      this.direction = -1;
    }

    this.velocityX = this.direction * this.speed;
    this.animationTime += deltaTime;

    // Apply physics (but enemies don't fall)
    this.x += this.velocityX * deltaTime;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Simple snowball enemy
    const gradient = ctx.createRadialGradient(0, -4, 0, 0, 0, this.width / 2);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#d0d0d0');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000000';
    const eyeOffset = Math.sin(this.animationTime * 5) * 2;
    ctx.beginPath();
    ctx.arc(-4, -2 + eyeOffset, 2, 0, Math.PI * 2);
    ctx.arc(4, -2 + eyeOffset, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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

