import Phaser from 'phaser';
import loadingBg from '../assets/background_ocean.png';
import { GAME_WIDTH, GAME_HEIGHT } from '../types';

export class LoadingScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;
  private assetText!: Phaser.GameObjects.Text;
  private penguins: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super('LoadingScene');
  }

  preload() {
    // Load minimal assets needed for the loading screen
    // Use bundled asset path so it works in production builds
    this.load.image('loading_bg', loadingBg);

    // Create snow particle texture if it doesn't exist
    if (!this.textures.exists('snow_particle')) {
      const graphics = this.make.graphics({ x: 0, y: 0, add: false } as any);
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(2, 2, 2);
      graphics.generateTexture('snow_particle', 4, 4);
    }
  }

  create() {
    // Background
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'loading_bg')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setTint(0x87ceeb); // Light blue tint for winter feel

    // Create snow particles
    this.createSnowParticles();

    // Title text
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.15, 'WinterTrek: Snowbound & Snuggles', {
      font: 'bold 48px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.25, 'A Winter Adventure', {
      font: '24px Arial',
      color: '#e8f4f8',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Create penguin silhouettes for visual interest
    this.createPenguinSilhouettes();

    // Progress bar background
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRoundedRect(GAME_WIDTH / 2 - 160, GAME_HEIGHT * 0.75 - 10, 320, 20, 5);

    // Progress bar
    this.progressBar = this.add.graphics();

    // Loading text
    this.loadingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.8, 'Loading...', {
      font: '18px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Percent text
    this.percentText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.85, '0%', {
      font: 'bold 24px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Asset text
    this.assetText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.9, '', {
      font: '14px Arial',
      color: '#cccccc'
    }).setOrigin(0.5);

    // Start the preloader scene in the background
    this.scene.launch('PreloaderScene');

    // Set up loading events after a brief delay to ensure PreloaderScene is initialized
    this.time.delayedCall(100, () => {
      this.scene.get('PreloaderScene').load.on('progress', this.onProgress, this);
      this.scene.get('PreloaderScene').load.on('fileprogress', this.onFileProgress, this);
      this.scene.get('PreloaderScene').load.on('complete', this.onComplete, this);
    });
  }

  private createSnowParticles() {
    this.add.particles(GAME_WIDTH / 2, -10, 'snow_particle', {
      speedY: { min: 20, max: 50 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 8000,
      gravityY: 10,
      quantity: 1,
      frequency: 200
    });
  }

  private createPenguinSilhouettes() {
    // Create simple penguin silhouettes using graphics
    for (let i = 0; i < 3; i++) {
      const textureKey = `penguin_${i}`;

      if (!this.textures.exists(textureKey)) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false } as any);
        graphics.fillStyle(0x000000, 0.6);
        graphics.fillRoundedRect(0, 0, 20, 30, 5); // Body
        graphics.fillRoundedRect(5, -10, 10, 15, 3); // Head
        graphics.fillTriangle(7, 18, 13, 18, 10, 25); // Beak
        graphics.generateTexture(textureKey, 20, 35);
      }

      const penguin = this.add.sprite(
        GAME_WIDTH * (0.3 + i * 0.2),
        GAME_HEIGHT * 0.5,
        textureKey
      );
      penguin.setScale(2);
      penguin.setAlpha(0.4);

      // Subtle bobbing animation
      this.tweens.add({
        targets: penguin,
        y: penguin.y - 5,
        duration: 2000 + i * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.penguins.push(penguin);
    }
  }

  private onProgress(value: number) {
    this.percentText.setText(`${Math.floor(value * 100)}%`);

    // Update progress bar
    this.progressBar.clear();
    this.progressBar.fillStyle(0x4a90e2, 1);
    this.progressBar.fillRoundedRect(
      GAME_WIDTH / 2 - 155,
      GAME_HEIGHT * 0.75 - 5,
      310 * value,
      10,
      3
    );

    // Add ice-like gradient effect
    this.progressBar.fillStyle(0x87ceeb, 0.8);
    this.progressBar.fillRoundedRect(
      GAME_WIDTH / 2 - 155,
      GAME_HEIGHT * 0.75 - 3,
      310 * value * 0.7,
      4,
      2
    );
  }

  private onFileProgress(file: Phaser.Loader.File) {
    this.assetText.setText(`Loading: ${file.key}`);
  }

  private onComplete() {
    // Fade out loading elements
    this.tweens.add({
      targets: [this.loadingText, this.percentText, this.assetText],
      alpha: 0,
      duration: 500,
      onComplete: () => {
        // Transition to menu scene after a brief delay
        this.time.delayedCall(300, () => {
          this.scene.start('MenuScene');
        });
      }
    });

    // Animate penguins sliding out
    this.penguins.forEach((penguin, index) => {
      this.tweens.add({
        targets: penguin,
        x: GAME_WIDTH + 100,
        duration: 800,
        delay: index * 200,
        ease: 'Back.easeIn'
      });
    });
  }
}
