import { InputManager } from './InputManager';
import { Renderer } from './Renderer';
import { Penguin } from './entities/Penguin';
import { Camera } from './Camera';
import { Level } from './Level';
import { level1Data } from '../data/levels/level1';

export class Scene {
  private inputManager: InputManager;
  private penguin: Penguin;
  private camera: Camera;
  private level: Level;
  private startPosition: { x: number; y: number };
  private levelHeight: number;

  constructor(inputManager: InputManager) {
    this.inputManager = inputManager;
    
    // Initialize level
    this.level = new Level(level1Data);
    
    // Store start position and level height
    this.startPosition = this.level.getStartPosition();
    this.levelHeight = this.level.getLevelHeight();
    
    // Initialize penguin at starting position
    this.penguin = new Penguin(this.startPosition.x, this.startPosition.y, this.inputManager);
    
    // Initialize camera following penguin
    this.camera = new Camera(0, 0);
  }

  public update(deltaTime: number, viewWidth: number, viewHeight: number): void {
    // Update penguin
    this.penguin.update(deltaTime);
    
    // Check if penguin fell off the level (death condition)
    if (this.penguin.getY() > this.levelHeight + 100) {
      this.handleDeath();
    }
    
    // Check collisions with level
    this.level.checkCollisions(this.penguin);
    
    // Update camera to follow penguin (use actual viewport dimensions)
    this.camera.follow(this.penguin.getX(), this.penguin.getY(), viewWidth, viewHeight);
    
    // Update level (for animated elements, collectibles, etc.)
    this.level.update(deltaTime);
  }

  private handleDeath(): void {
    // Respawn penguin at start position
    this.penguin.setPosition(this.startPosition.x, this.startPosition.y);
    this.penguin.setVelocity(0, 0);
    
    // Lose a heart
    const heartsElement = document.getElementById('hearts');
    if (heartsElement) {
      const current = parseInt(heartsElement.textContent || '3');
      const newHearts = Math.max(0, current - 1);
      heartsElement.textContent = newHearts.toString();
      
      // Game over if no hearts left
      if (newHearts === 0) {
        this.showGameOver();
      }
    }
  }

  private showGameOver(): void {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: #e8f4f8;
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      font-size: 24px;
      z-index: 1000;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    `;
    message.innerHTML = `
      <h2 style="margin-bottom: 20px; color: #ff6b6b;">Game Over</h2>
      <p style="margin-bottom: 20px;">The storm was too harsh...</p>
      <p style="font-size: 16px; color: #a8b8c8;">Refresh to try again</p>
    `;
    document.body.appendChild(message);
  }

  public draw(renderer: Renderer): void {
    const ctx = renderer.getContext();
    const cameraX = this.camera.getX();
    const cameraY = this.camera.getY();

    // Draw parallax background layers
    this.drawParallaxBackground(renderer, cameraX, cameraY);

    // Draw level with camera offset
    renderer.drawWithCamera((ctx) => {
      this.level.draw(ctx);
    }, cameraX, cameraY);

    // Draw penguin with camera offset
    renderer.drawWithCamera((ctx) => {
      this.penguin.draw(ctx);
    }, cameraX, cameraY);

    // Draw storm overlay effect
    this.drawStormOverlay(renderer);
  }

  private drawParallaxBackground(renderer: Renderer, cameraX: number, cameraY: number): void {
    const ctx = renderer.getContext();
    const width = renderer.getWidth();
    const height = renderer.getHeight();

    // Far background layer (very slow parallax)
    ctx.fillStyle = 'rgba(100, 120, 150, 0.3)';
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 - (cameraX * 0.1) % 200) % width;
      ctx.beginPath();
      ctx.arc(x, height * 0.3, 40, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mid background layer (medium parallax) - tree silhouettes
    ctx.fillStyle = 'rgba(50, 60, 80, 0.4)';
    for (let i = 0; i < 8; i++) {
      const x = (i * 150 - (cameraX * 0.3) % 150) % width;
      const treeHeight = 80 + Math.sin(i) * 20;
      ctx.fillRect(x, height - treeHeight, 30, treeHeight);
    }

    // Snow particles (fast parallax)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 30; i++) {
      const x = (i * 50 - (cameraX * 0.5) % 50) % width;
      const y = (i * 30 + Date.now() * 0.1) % height;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawStormOverlay(renderer: Renderer): void {
    const ctx = renderer.getContext();
    const width = renderer.getWidth();
    const height = renderer.getHeight();

    // Subtle storm overlay - hazy effect
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height)
    );
    gradient.addColorStop(0, 'rgba(100, 120, 150, 0.1)');
    gradient.addColorStop(1, 'rgba(50, 70, 100, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

