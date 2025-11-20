export class Cat {
  private x: number;
  private y: number;
  private width: number = 32;
  private height: number = 32;
  private animationTime: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Cat body (orange tabby)
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cat head
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.arc(0, -this.height / 2 - 2, 10, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.moveTo(-6, -this.height / 2 - 8);
    ctx.lineTo(-2, -this.height / 2 - 12);
    ctx.lineTo(2, -this.height / 2 - 8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6, -this.height / 2 - 8);
    ctx.lineTo(2, -this.height / 2 - 12);
    ctx.lineTo(-2, -this.height / 2 - 8);
    ctx.closePath();
    ctx.fill();

    // Pink inner ears
    ctx.fillStyle = '#ffb3ba';
    ctx.beginPath();
    ctx.moveTo(-4, -this.height / 2 - 9);
    ctx.lineTo(-1, -this.height / 2 - 11);
    ctx.lineTo(1, -this.height / 2 - 9);
    ctx.closePath();
    ctx.fill();

    // Eyes (happy)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-3, -this.height / 2 - 2, 1.5, 0, Math.PI * 2);
    ctx.arc(3, -this.height / 2 - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#ffb3ba';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(-2, -this.height / 2 + 2);
    ctx.lineTo(2, -this.height / 2 + 2);
    ctx.closePath();
    ctx.fill();

    // Tail (wagging)
    const tailWag = Math.sin(this.animationTime * 3) * 0.3;
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.quadraticCurveTo(this.width / 2 + 10, -10, this.width / 2 + 15 + tailWag * 5, -5);
    ctx.stroke();

    // Warm scarf (matching penguin's friend)
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(-8, -this.height / 2 + 4, 16, 4);
    ctx.fillStyle = '#6eddd6';
    ctx.fillRect(-6, -this.height / 2 + 6, 12, 2);

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

