import Phaser from 'phaser';
import { LevelConfig, GAME_WIDTH, GAME_HEIGHT } from '../types';

export class LevelManager {
  private scene: Phaser.Scene;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  getLevelConfig(levelId: number): LevelConfig {
    const baseConfig = {
        id: levelId,
        startPosition: { x: 100, y: 500 },
        goalPosition: { x: 2800, y: 600 } // Default Ground Level (688 roughly, adjust for size)
    };

    switch (levelId) {
        case 1:
            return {
                ...baseConfig,
                name: 'The Frosty Floes',
                background: 'bg_ocean', // Icy Blue/White
                music: 'music_floes',
                physics: { friction: 0.1 }
            };
        case 2:
            return {
                ...baseConfig,
                name: 'The Whispering Woods',
                background: 'bg_forest', // Muted Teal/Pine
                music: 'music_woods',
                mechanics: { hasMist: true, hasWindZones: true },
                goalPosition: { x: 2800, y: 600 }
            };
        case 3:
            return {
                ...baseConfig,
                name: 'The Crystal Caverns',
                background: 'bg_cave', // Dark Purple
                music: 'music_cave',
                mechanics: { isDark: true },
                goalPosition: { x: 2800, y: 600 }
            };
        case 4:
            return {
                ...baseConfig,
                name: 'The Howling Ridge',
                background: 'bg_storm', // Storm Grey
                music: 'music_storm',
                mechanics: { hasFallingIcicles: true },
                physics: { windX: -5 }, // Reduced from -20 to be playable
                goalPosition: { x: 2800, y: 600 }
            };
        case 5:
            return {
                ...baseConfig,
                name: 'The Summit',
                background: 'bg_ocean', // Warm/Fire Red at end? or Blue night
                music: 'music_ending',
                goalPosition: { x: 1000, y: 100 } // Adjusted height to sit on top of platform
            };
        default:
            return {
                ...baseConfig,
                name: 'Unknown Level',
                background: 'bg_ocean',
                music: 'music_floes',
                mechanics: {}
            };
    }
  }

  buildLevel(levelId: number): { 
      platforms: Phaser.Physics.Arcade.StaticGroup, 
      movingPlatforms: Phaser.Physics.Arcade.Group,
      collectibles: Phaser.Physics.Arcade.Group, 
      enemies: Phaser.Physics.Arcade.Group, 
      goal: Phaser.GameObjects.Sprite,
      windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[],
      bouncers: Phaser.Physics.Arcade.StaticGroup,
      npcs: Phaser.GameObjects.Group
  } {
     const platforms = this.scene.physics.add.staticGroup();
     const movingPlatforms = this.scene.physics.add.group({ allowGravity: false, immovable: true });
     const collectibles = this.scene.physics.add.group({ allowGravity: false, immovable: true });
     const enemies = this.scene.physics.add.group();
     const bouncers = this.scene.physics.add.staticGroup(); // For Barnaby
     const npcs = this.scene.add.group(); // For Luna
     const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];
     
     const tileColor = this.getTileColor(levelId);

     // Base Floor (except level 5)
     if (levelId !== 5) {
         // Create a floor with gaps
         for (let x = 0; x < 3000; x += 32) {
             if (levelId === 1 && x > 400 && x < 1200) continue; // Large gap for floating ice
             const p = platforms.create(x, GAME_HEIGHT - 32, 'pixel').setScale(32, 32).setTint(tileColor).setOrigin(0,0);
             p.refreshBody();
             // Ensure collision flags are reset
             p.body.checkCollision.down = true;
             p.body.checkCollision.up = true;
             p.body.checkCollision.left = true;
             p.body.checkCollision.right = true;
         }
     } else {
         for (let x = 0; x < 2000; x += 32) {
             const p = platforms.create(x, GAME_HEIGHT - 32, 'pixel').setScale(32, 32).setTint(tileColor).setOrigin(0,0);
             p.refreshBody();
             // Ensure collision flags are reset
             p.body.checkCollision.down = true;
             p.body.checkCollision.up = true;
             p.body.checkCollision.left = true;
             p.body.checkCollision.right = true;
         }
     }

     // Level Specifics
     if (levelId === 1) {
         // Floating ice blocks (Moving platforms)
         // Ground at 688. 
         // 1st Platform: 600 (Diff 88)
         // 2nd Platform: 520 (Diff 80)
         // 3rd Platform: 440 (Diff 80)
         const p1 = movingPlatforms.create(500, 600, 'platform_96x32').setTint(tileColor);
         const p2 = movingPlatforms.create(800, 520, 'platform_96x32').setTint(tileColor);
         const p3 = movingPlatforms.create(1100, 440, 'platform_96x32').setTint(tileColor);
         
         // Platform bodies automatically match texture size (96x32)
         [p1, p2, p3].forEach(p => {
             p.setImmovable(true);
             
             // Ensure full collision
             p.body.checkCollision.up = true;
             p.body.checkCollision.down = true;
             p.body.checkCollision.left = true;
             p.body.checkCollision.right = true;
         });

         // Barnaby (Bounce Pad)
         const barnaby = bouncers.create(1250, 450, 'barnaby'); 
         barnaby.refreshBody();
     } 
     else if (levelId === 2) {
         // Vertical platforms
         // Ground 688
         // 1: 580 (Diff 108)
         // 2: 480 (Diff 100)
         // 3: 380 (Diff 100)
         const p1 = platforms.create(500, 580, 'platform_96x32').setTint(tileColor).refreshBody();
         const p2 = platforms.create(800, 480, 'platform_96x32').setTint(tileColor).refreshBody();
         const p3 = platforms.create(500, 380, 'platform_96x32').setTint(tileColor).refreshBody();
         
         [p1, p2, p3].forEach(p => {
             // Static platforms usually just need checkCollision update
             p.body.checkCollision.up = true;
             p.body.checkCollision.down = true;
             p.body.checkCollision.left = true;
             p.body.checkCollision.right = true;
         });
         
         // Luna (Visual Guide)
         const luna = this.scene.add.image(850, 350, 'luna');
         npcs.add(luna);
         // Add text bubble? Handled in scene updates or simple visual

         // Wind Zone
         const windZone = this.scene.add.rectangle(700, 300, 200, 400, 0x00ff00, 0) as any;
         this.scene.physics.add.existing(windZone);
         (windZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
         windZones.push(windZone);
     }
     else if (levelId === 3) {
         // Caverns - Sliding focus
         const p1 = platforms.create(500, 580, 'platform_96x32').setTint(tileColor).refreshBody();
         const p2 = platforms.create(900, 480, 'platform_96x32').setTint(tileColor).refreshBody();
         
         [p1, p2].forEach(p => {
             p.body.checkCollision.up = true;
             p.body.checkCollision.down = true;
             p.body.checkCollision.left = true;
             p.body.checkCollision.right = true;
         });

         // Embers
         collectibles.create(600, 450, 'ember').setScale(0.2); // Reduced from 0.5
         collectibles.create(1000, 350, 'ember').setScale(0.2); // Reduced from 0.5
         
         // Mitten (Narrative Collectible) - reused ember graphic for now or add text trigger
         // We can use a special collectible type
         const mitten = collectibles.create(1500, 500, 'ember').setScale(0.2).setTint(0xff0000); // Reduced from 0.5
         mitten.setData('type', 'mitten');
     }
     else if (levelId === 5) {
         // Spiral
         for(let i=0; i<8; i++) {
             const p = platforms.create(300 + i*100, 600 - i*60, 'platform_96x32').setTint(tileColor).refreshBody();
             p.body.checkCollision.up = true;
             p.body.checkCollision.down = true;
             p.body.checkCollision.left = true;
             p.body.checkCollision.right = true;
         }
     }

     // Fish
     collectibles.create(400, 450, 'fish').setScale(0.1); 
     if (levelId !== 5) collectibles.create(1200, 450, 'fish').setScale(0.1);

     // Goal
     const goalConfig = this.getLevelConfig(levelId).goalPosition!;
     const goal = this.scene.physics.add.sprite(goalConfig.x, goalConfig.y, 'marmalade');
     goal.setImmovable(true);
     (goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;
     
     // Marmalade Hitbox
     // Similar to Pippin, assuming 128x128 frame.
     goal.body.setSize(40, 40);
     goal.body.setOffset(44, 88);

     return { platforms, movingPlatforms, collectibles, enemies, goal, windZones, bouncers, npcs };
  }

  private getTileColor(levelId: number): number {
      switch(levelId) {
          case 1: return 0xaaddff; // Ice Blue
          case 2: return 0x228822; // Forest Green (Muted Teal) - 0x2E8B57 ?
          case 3: return 0x554455; // Cave Purple/Grey
          case 4: return 0x444455; // Storm Grey
          case 5: return 0x8B4513; // Wood (Lighthouse)
          default: return 0x888888;
      }
  }
}
