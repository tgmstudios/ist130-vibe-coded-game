export class Platform {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Ice platform with soft edges
    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x, this.y + this.height
    );
    gradient.addColorStop(0, '#e8f4f8'); // Ice white
    gradient.addColorStop(0.5, '#c8d8e8'); // Pale lavender-blue
    gradient.addColorStop(1, '#a8b8c8'); // Muted teal

    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Subtle border
    ctx.strokeStyle = 'rgba(200, 220, 240, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Snow texture overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < this.width; i += 8) {
      for (let j = 0; j < this.height; j += 8) {
        if (Math.random() > 0.7) {
          ctx.fillRect(this.x + i, this.y + j, 2, 2);
        }
      }
    }
  }
}

