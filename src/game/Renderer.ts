export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public clear(): void {
    // Winter sky gradient - soft cold blues
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#2d3a5c'); // Soft slate blue
    gradient.addColorStop(0.5, '#3a4a6b'); // Muted teal-blue
    gradient.addColorStop(1, '#1a2332'); // Dark slate
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  // Helper method to draw with camera offset
  public drawWithCamera(
    drawFn: (ctx: CanvasRenderingContext2D) => void,
    cameraX: number,
    cameraY: number
  ): void {
    this.ctx.save();
    this.ctx.translate(-cameraX, -cameraY);
    drawFn(this.ctx);
    this.ctx.restore();
  }
}

