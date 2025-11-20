export class PhysicsBody {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected velocityX: number = 0;
  protected velocityY: number = 0;
  protected isOnGround: boolean = false;
  protected gravity: number = 800;
  protected friction: number = 0.85;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public update(deltaTime: number): void {
    // Apply gravity
    if (!this.isOnGround) {
      this.velocityY += this.gravity * deltaTime;
    }

    // Apply friction to horizontal velocity when on ground
    if (this.isOnGround) {
      this.velocityX *= this.friction;
    }

    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;

    // Reset ground flag (will be set by collision detection)
    this.isOnGround = false;
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public setVelocity(x: number, y: number): void {
    this.velocityX = x;
    this.velocityY = y;
  }

  public getVelocityX(): number {
    return this.velocityX;
  }

  public getVelocityY(): number {
    return this.velocityY;
  }

  public setOnGround(value: boolean): void {
    this.isOnGround = value;
  }
}

