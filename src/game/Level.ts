import { PhysicsBody } from './PhysicsBody';
import { Platform } from './entities/Platform';
import { Collectible } from './entities/Collectible';
import { Enemy } from './entities/Enemy';
import { Cat } from './entities/Cat';

export interface LevelData {
  width: number;
  height: number;
  startPosition: { x: number; y: number };
  platforms: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  collectibles: Array<{
    x: number;
    y: number;
    type: 'star' | 'heart';
  }>;
  enemies: Array<{
    x: number;
    y: number;
    patrolDistance?: number;
  }>;
  catPosition?: { x: number; y: number };
}

export class Level {
  private data: LevelData;
  private platforms: Platform[] = [];
  private collectibles: Collectible[] = [];
  private enemies: Enemy[] = [];
  private cat: Cat | null = null;

  constructor(data: LevelData) {
    this.data = data;
    
    // Create platforms
    this.platforms = data.platforms.map(p => 
      new Platform(p.x, p.y, p.width, p.height)
    );

    // Create collectibles
    this.collectibles = data.collectibles.map(c =>
      new Collectible(c.x, c.y, c.type)
    );

    // Create enemies
    this.enemies = (data.enemies || []).map(e =>
      new Enemy(e.x, e.y, e.patrolDistance || 100)
    );

    // Create cat friend at the end
    if (data.catPosition) {
      this.cat = new Cat(data.catPosition.x, data.catPosition.y);
    }
  }

  public update(deltaTime: number): void {
    // Update collectibles (animations, etc.)
    this.collectibles.forEach(c => c.update(deltaTime));
    
    // Update enemies
    this.enemies.forEach(e => e.update(deltaTime));
    
    // Update cat
    if (this.cat) {
      this.cat.update(deltaTime);
    }
  }

  public checkCollisions(entity: PhysicsBody): void {
    const bounds = entity.getBounds();

    // Check platform collisions
    for (const platform of this.platforms) {
      const platformBounds = platform.getBounds();
      
      if (this.isColliding(bounds, platformBounds)) {
        // Determine collision side
        const overlapX = Math.min(
          bounds.x + bounds.width - platformBounds.x,
          platformBounds.x + platformBounds.width - bounds.x
        );
        const overlapY = Math.min(
          bounds.y + bounds.height - platformBounds.y,
          platformBounds.y + platformBounds.height - bounds.y
        );

        if (overlapY < overlapX) {
          // Vertical collision
          if (bounds.y < platformBounds.y) {
            // Top collision (landing on platform)
            entity.setPosition(bounds.x, platformBounds.y - bounds.height);
            entity.setVelocity(entity.getVelocityX(), 0);
            entity.setOnGround(true);
            onGround = true;
          } else {
            // Bottom collision (hitting ceiling)
            entity.setPosition(bounds.x, platformBounds.y + platformBounds.height);
            entity.setVelocity(entity.getVelocityX(), 0);
          }
        } else {
          // Horizontal collision
          if (bounds.x < platformBounds.x) {
            entity.setPosition(platformBounds.x - bounds.width, bounds.y);
            entity.setVelocity(0, entity.getVelocityY());
          } else {
            entity.setPosition(platformBounds.x + platformBounds.width, bounds.y);
            entity.setVelocity(0, entity.getVelocityY());
          }
        }
      }
    }

    // Check collectible collisions
    this.collectibles = this.collectibles.filter(collectible => {
      const collectibleBounds = collectible.getBounds();
      if (this.isColliding(bounds, collectibleBounds)) {
        collectible.onCollect();
        return false; // Remove collected item
      }
      return true;
    });

    // Check enemy collisions (damage player)
    for (const enemy of this.enemies) {
      const enemyBounds = enemy.getBounds();
      if (this.isColliding(bounds, enemyBounds)) {
        // Check if player is above enemy (stomp)
        if (bounds.y + bounds.height < enemyBounds.y + enemyBounds.height / 2) {
          // Player stomped enemy - remove enemy
          const index = this.enemies.indexOf(enemy);
          if (index > -1) {
            this.enemies.splice(index, 1);
            // Give player a small bounce
            entity.setVelocity(entity.getVelocityX(), -200);
          }
        } else {
          // Player hit enemy - take damage
          const heartsElement = document.getElementById('hearts');
          if (heartsElement) {
            const current = parseInt(heartsElement.textContent || '3');
            const newHearts = Math.max(0, current - 1);
            heartsElement.textContent = newHearts.toString();
            
            // Push player back
            const pushDirection = bounds.x < enemyBounds.x ? -1 : 1;
            entity.setVelocity(pushDirection * 200, -150);
            
            // Reset player position slightly
            if (newHearts > 0) {
              entity.setPosition(bounds.x - pushDirection * 20, bounds.y);
            }
          }
        }
      }
    }

    // Check cat collision (win condition)
    if (this.cat) {
      const catBounds = this.cat.getBounds();
      if (this.isColliding(bounds, catBounds)) {
        // Show win message
        this.showWinMessage();
      }
    }
  }

  private showWinMessage(): void {
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
      <h2 style="margin-bottom: 20px; color: #ffd700;">🎉 You Found Your Friend! 🎉</h2>
      <p style="margin-bottom: 20px;">The penguin and cat are reunited!</p>
      <p style="font-size: 16px; color: #a8b8c8;">Refresh to play again</p>
    `;
    document.body.appendChild(message);
  }

  private isColliding(
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Draw platforms
    this.platforms.forEach(platform => platform.draw(ctx));

    // Draw enemies
    this.enemies.forEach(enemy => enemy.draw(ctx));

    // Draw collectibles
    this.collectibles.forEach(collectible => collectible.draw(ctx));

    // Draw cat friend
    if (this.cat) {
      this.cat.draw(ctx);
    }
  }

  public getStartPosition(): { x: number; y: number } {
    return this.data.startPosition;
  }

  public getLevelHeight(): number {
    return this.data.height;
  }
}

