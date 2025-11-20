export class Camera {
  private x: number = 0;
  private y: number = 0;
  private targetX: number = 0;
  private targetY: number = 0;
  private smoothness: number = 0.1;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  }

  public follow(targetX: number, targetY: number, viewWidth: number, viewHeight: number): void {
    // Center camera on target
    this.targetX = targetX - viewWidth / 2;
    this.targetY = targetY - viewHeight / 2;

    // Smooth camera movement
    this.x += (this.targetX - this.x) * this.smoothness;
    this.y += (this.targetY - this.y) * this.smoothness;

    // Keep camera within level bounds (if needed)
    // This can be extended when level bounds are defined
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  }
}

