import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { InputManager } from '../managers/InputManager';
import { LevelManager } from '../managers/LevelManager';
import { LevelConfig, GAME_WIDTH, GAME_HEIGHT } from '../types';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputMgr!: InputManager;
  private levelMgr!: LevelManager;
  private currentLevelId: number = 1;
  private levelConfig!: LevelConfig;
  
  // Game Objects
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms!: Phaser.Physics.Arcade.Group;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private goal!: Phaser.GameObjects.Sprite;
  private windZones!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[];
  private bouncers!: Phaser.Physics.Arcade.StaticGroup;
  
  // Mechanics
  private darknessRT?: Phaser.GameObjects.RenderTexture;
  private mist?: Phaser.GameObjects.Particles.ParticleEmitter;
  private mistWindy?: Phaser.GameObjects.Particles.ParticleEmitter;
  // private windEmitter?: Phaser.GameObjects.Particles.ParticleEmitter; // Removed global wind
  private bg?: Phaser.GameObjects.TileSprite;
  private lightSprite?: Phaser.GameObjects.Image;
  private collectedCount = 0;
  private lightRadius = 150;
  private isEnding = false;
  private isInWindZone = false;

  constructor() {
    super('GameScene');
  }

  init(data: { level: number }) {
      this.currentLevelId = data.level || 1;
      this.lightRadius = 150;
      this.isEnding = false;
  }

  create() {
    this.inputMgr = new InputManager(this);
    this.levelMgr = new LevelManager(this);
    this.levelConfig = this.levelMgr.getLevelConfig(this.currentLevelId);

    // Background
    this.bg = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, this.levelConfig.background)
        .setOrigin(0, 0)
        .setScrollFactor(0);

    // Build Level
    const levelObjects = this.levelMgr.buildLevel(this.currentLevelId);
    this.platforms = levelObjects.platforms;
    this.movingPlatforms = levelObjects.movingPlatforms;
    this.collectibles = levelObjects.collectibles;
    this.enemies = levelObjects.enemies;
    this.goal = levelObjects.goal;
    this.windZones = levelObjects.windZones || [];
    this.bouncers = levelObjects.bouncers;

    // Player
    this.player = new Player(this, this.levelConfig.startPosition.x, this.levelConfig.startPosition.y, this.inputMgr);

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    const worldWidth = this.levelConfig.width || 4000;
    this.cameras.main.setBounds(0, 0, worldWidth, GAME_HEIGHT); 
    this.physics.world.setBounds(0, 0, worldWidth, GAME_HEIGHT);
    // Allow falling off the world bottom
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, undefined, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this);
    
    // Bouncer Collision (Barnaby)
    if (this.bouncers) {
        this.physics.add.collider(this.player, this.bouncers, this.hitBouncer, undefined, this);
    }

    // Music
    this.sound.stopAll();
    if (this.cache.audio.exists(this.levelConfig.music)) {
        this.sound.play(this.levelConfig.music, { loop: true, volume: 0.5 });
    }

    // Level Specific Setup
    this.setupLevelMechanics();
    
    // HUD
    this.scene.launch('HUDScene', { collected: this.collectedCount });

    // Pause Handler
    this.input.keyboard?.on('keydown-ESC', () => {
        if (!this.isEnding) {
            this.scene.pause();
            this.scene.launch('PauseScene');
        }
    });
  }

  update(_time: number, delta: number) {
      if (this.isEnding) return;

      this.player.update(_time, delta);
      this.updateLevelMechanics(_time, delta);

      // Parallax Background
      if (this.bg) {
          this.bg.tilePositionX = this.cameras.main.scrollX * 0.5;
      }
      
      // Fall death
      if (this.player.y > GAME_HEIGHT) {
          this.scene.restart({ level: this.currentLevelId });
      }
  }

  private setupLevelMechanics() {
      // Bobbing Platforms (Level 1)
      if (this.currentLevelId === 1) {
          this.movingPlatforms.children.iterate((child: any) => {
               this.tweens.add({
                   targets: child,
                   y: child.y + 30, // Bob distance
                   duration: 2000,
                   yoyo: true,
                   repeat: -1,
                   ease: 'Sine.easeInOut'
               });
               return true;
          });
      }

      // Mist (Level 2)
      if (this.levelConfig.mechanics?.hasMist) {
           // Calm Snow
           this.mist = this.add.particles(0, 0, 'particle_snow', {
               x: { min: 0, max: GAME_WIDTH },
               y: 0, // Emit from top
               quantity: 2,
               frequency: 50,
               angle: { min: 80, max: 100 },
               speedY: { min: 50, max: 150 },
               speedX: { min: -20, max: 20 },
               scale: { min: 0.05, max: 0.15 },
               alpha: { min: 0.2, max: 0.8 },
               lifespan: 10000,
               gravityY: 10
           });
           this.mist.setScrollFactor(0);

           // Windy Snow (Initially inactive)
           this.mistWindy = this.add.particles(0, 0, 'particle_snow', {
               x: { min: 0, max: GAME_WIDTH },
               y: 0, 
               quantity: 2,
               frequency: 20, // More frequent in wind
               angle: { min: 100, max: 120 }, // Blown left
               speedY: { min: 50, max: 150 },
               speedX: { min: -300, max: -100 }, // Strong left wind
               scale: { min: 0.05, max: 0.15 },
               alpha: { min: 0.2, max: 0.8 },
               lifespan: 10000,
               gravityY: 10,
               emitting: false
           });
           this.mistWindy.setScrollFactor(0);
      }
      
      // Darkness (Level 3)
      if (this.levelConfig.mechanics?.isDark) {
           this.darknessRT = this.make.renderTexture({ width: GAME_WIDTH, height: GAME_HEIGHT }, false);
           this.darknessRT.setScrollFactor(0);
           this.darknessRT.setDepth(100);
           
           if (!this.textures.exists('light_circle')) {
               const graphics = this.make.graphics({ x: 0, y: 0, add: false } as any);
               graphics.fillStyle(0xffffff);
               graphics.fillCircle(50, 50, 50);
               graphics.generateTexture('light_circle', 100, 100);
           }
           this.lightSprite = this.make.image({ key: 'light_circle', add: false } as any);
      }
  }
  
  private updateLevelMechanics(time: number, delta: number) {
      // Wind Physics (Global)
      if (this.levelConfig.physics?.windX) {
          this.player.body!.velocity.x += this.levelConfig.physics.windX * (delta/16);
      }

      // Wind Zones (Level 2)
      if (this.windZones.length > 0) {
          // Initialize wind visuals if not present
          /* Global wind emitter removed in favor of local level visuals
          if (!this.windEmitter) {
               this.windEmitter = this.add.particles(0, 0, 'particle_wind', {
                   x: { min: 0, max: GAME_WIDTH },
                   y: { min: 0, max: GAME_HEIGHT },
                   quantity: 0, // Emit only when active
                   frequency: 100,
                   angle: 180, // Left
                   speedX: { min: -500, max: -300 },
                   scaleX: { min: 0.5, max: 2 },
                   scaleY: { min: 0.1, max: 0.2 },
                   alpha: { min: 0.3, max: 0.6 },
                   lifespan: 1000,
                   emitting: false
               });
               this.windEmitter.setScrollFactor(0);
          }
          */

          const wasInWind = this.isInWindZone;
          this.isInWindZone = false;

          this.physics.overlap(this.player, this.windZones, () => {
              this.isInWindZone = true;
              this.player.body!.velocity.x -= 10;
          });

          // State change handling
          if (this.isInWindZone !== wasInWind) {
              console.log('Wind Zone Transition:', this.isInWindZone);
              if (this.isInWindZone) {
                  // Enter Wind
                  // if (this.windEmitter) this.windEmitter.start();
                  if (this.mist) this.mist.stop();
                  if (this.mistWindy) this.mistWindy.start();
              } else {
                  // Exit Wind
                  // if (this.windEmitter) this.windEmitter.stop();
                  if (this.mist) this.mist.start();
                  if (this.mistWindy) this.mistWindy.stop();
              }
          }
      }
      
      // Falling Icicles (Level 4)
      if (this.levelConfig.mechanics?.hasFallingIcicles) {
          // Random spawn
          if (Phaser.Math.Between(0, 100) > 98) {
              const x = this.cameras.main.scrollX + Phaser.Math.Between(0, GAME_WIDTH);
              const icicle = this.physics.add.image(x, 0, 'pixel').setScale(10, 30).setTint(0xaaddff);
              icicle.setVelocityY(300);
              this.physics.add.overlap(this.player, icicle, () => {
                  this.scene.restart({ level: this.currentLevelId });
              });
              // Destroy after falling
              this.time.delayedCall(3000, () => icicle.destroy());
          }
      }

      // Mist Scrolling (handled by particles now)
      // if (this.mist) {
      //    this.mist.tilePositionX += 2;
      // }

      // Darkness Mask
      if (this.darknessRT && this.lightSprite) {
           this.darknessRT.clear();
           this.darknessRT.fill(0x000000, 0.95);
           
           const playerX = this.player.x - this.cameras.main.scrollX;
           const playerY = this.player.y - this.cameras.main.scrollY;
           
           this.lightSprite.setScale(this.lightRadius / 50);
           this.darknessRT.erase(this.lightSprite, playerX, playerY);
      }
  }

  private collectItem(_player: any, item: any) {
      if (item.texture.key === 'ember') {
          if (item.getData('type') === 'mitten') {
               // Show message?
               this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'You found a Mitten!', {
                   fontSize: '24px',
                   backgroundColor: '#000'
               }).setOrigin(0.5).setScrollFactor(0);
               this.time.delayedCall(2000, () => { /* hide text */ });
          } else {
              this.lightRadius = 250;
              this.time.delayedCall(5000, () => this.lightRadius = 150);
          }
      } else {
          // Fish
          this.collectedCount++;
          this.events.emit('updateHUD', this.collectedCount);
      }
      item.disableBody(true, true);
  }
  
  private hitBouncer(_player: any, bouncer: any) {
      if (this.player.body!.touching.down && bouncer.body.touching.up) {
          this.player.setVelocityY(-600); // Big bounce
          // Play sound
      }
  }

  private hitEnemy(_player: any, enemy: any) {
      if (this.player.body!.velocity.y > 0 && this.player.y < enemy.y) {
          enemy.disableBody(true, true);
          this.player.setVelocityY(-300);
      } else {
          this.scene.restart({ level: this.currentLevelId });
      }
  }

  private reachGoal(_player: any, _goal: any) {
      if (this.currentLevelId < 5) {
          this.scene.start('GameScene', { level: this.currentLevelId + 1 });
      } else {
          if (!this.isEnding) {
              this.isEnding = true;
              this.player.setVelocity(0,0);
              
              // Fade out and go to Ending Scene
              this.cameras.main.fadeOut(2000, 255, 255, 255);
              this.cameras.main.once('camerafadeoutcomplete', () => {
                  this.scene.stop('HUDScene');
                  this.scene.start('EndingScene');
              });
          }
      }
  }
}
