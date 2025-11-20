import { InputManager } from '../InputManager';
import { PhysicsBody } from '../PhysicsBody';

export class Penguin extends PhysicsBody {
  private inputManager: InputManager;
  private width: number = 32;
  private height: number = 32;
  private speed: number = 150;
  private jumpPower: number = 400;
  private facingRight: boolean = true;
  private animationTime: number = 0;

  constructor(x: number, y: number, inputManager: InputManager) {
    super(x, y, 32, 32);
    this.inputManager = inputManager;
  }

  public update(deltaTime: number): void {
    // Handle horizontal movement
    const horizontalAxis = this.inputManager.getHorizontalAxis();
    this.velocityX = horizontalAxis * this.speed;
    
    if (horizontalAxis !== 0) {
      this.facingRight = horizontalAxis > 0;
    }

    // Handle jumping (Mario-style: press to jump, variable height)
    // Check jump with buffer system for reliability
    if (this.isOnGround && this.inputManager.isJumpPressed()) {
      this.velocityY = -this.jumpPower;
      this.isOnGround = false;
      // Consume the jump input so it doesn't trigger multiple times
      this.inputManager.consumeJump();
    }

    // Apply physics
    super.update(deltaTime);

    // Update animation time
    this.animationTime += deltaTime;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    
    if (!this.facingRight) {
      ctx.scale(-1, 1);
    }

    // Draw penguin body (simple placeholder - can be replaced with sprite)
    const frame = Math.floor(this.animationTime * 8) % 2;
    
    // Body (white belly)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Black back
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(0, -2, this.width / 2 - 2, this.height / 2 - 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(0, -this.height / 2 - 4, 10, 0, Math.PI * 2);
    ctx.fill();

    // White face
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -this.height / 2 - 2, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2 + 2);
    ctx.lineTo(-3, -this.height / 2 + 6);
    ctx.lineTo(3, -this.height / 2 + 6);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-3, -this.height / 2 - 2, 2, 0, Math.PI * 2);
    ctx.arc(3, -this.height / 2 - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Feet (animate when walking)
    if (Math.abs(this.velocityX) > 10) {
      const footOffset = Math.sin(this.animationTime * 10) * 3;
      ctx.fillStyle = '#ffa500';
      ctx.fillRect(-6, this.height / 2 - 4 + footOffset, 4, 3);
      ctx.fillRect(2, this.height / 2 - 4 - footOffset, 4, 3);
    } else {
      ctx.fillStyle = '#ffa500';
      ctx.fillRect(-6, this.height / 2 - 4, 4, 3);
      ctx.fillRect(2, this.height / 2 - 4, 4, 3);
    }

    // Scarf (warm accent)
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(-8, -this.height / 2 + 4, 16, 4);
    ctx.fillStyle = '#ff8787';
    ctx.fillRect(-6, -this.height / 2 + 6, 12, 2);

    ctx.restore();
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }
}

