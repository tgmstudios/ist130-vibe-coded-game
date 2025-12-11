import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../types';

export class PrologueScene extends Phaser.Scene {
  private hasStartedGame = false;
  private pippin!: Phaser.GameObjects.Sprite;
  private marmalade!: Phaser.GameObjects.Sprite;
  private windParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private snowParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private door!: Phaser.GameObjects.Rectangle;
  private bgGraphics!: Phaser.GameObjects.Graphics;
  
  // Audio
  private musicWarm!: Phaser.Sound.BaseSound;
  private musicStorm!: Phaser.Sound.BaseSound;

  constructor() {
    super('PrologueScene');
  }

  init() {
    this.hasStartedGame = false;
  }

  create() {
    console.log('PrologueScene: create');
    
    // 1. Setup Environment (Warm Start)
    // Background: Warm Amber Gradient or Color
    this.bgGraphics = this.add.graphics();
    this.bgGraphics.fillGradientStyle(0xffcc99, 0xffcc99, 0xffa07a, 0xffa07a, 1);
    this.bgGraphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Lighthouse (Background element)
    // Scale it up and place it on the side
    this.add.image(GAME_WIDTH * 0.8, GAME_HEIGHT * 0.6, 'lighthouse')
        .setOrigin(0.5, 1)
        .setScale(0.4)
        .setTint(0xffaa88); // Warm tint

    // Door (Visual representation for Marmalade to enter)
    this.door = this.add.rectangle(GAME_WIDTH * 0.8, GAME_HEIGHT * 0.6, 10, 30, 0x4a3c31)
        .setOrigin(0.5, 1);

    // Ground
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT, GAME_WIDTH, 100, 0x2d1b0e).setOrigin(0.5, 1);

    // 2. Characters
    // Marmalade (Sitting near the lighthouse door)
    this.marmalade = this.add.sprite(GAME_WIDTH * 0.75, GAME_HEIGHT - 120, 'marmalade', '1')
        .setScale(2);
    this.marmalade.play('marmalade-idle');
    
    // Pippin (Standing further out)
    this.pippin = this.add.sprite(GAME_WIDTH * 0.6, GAME_HEIGHT - 110, 'pippin', '1')
        .setScale(2);
    this.pippin.play('idle');

    // 3. Audio Setup
    this.musicWarm = this.sound.add('music_ending', { volume: 0, loop: true });
    this.musicStorm = this.sound.add('music_storm', { volume: 0, loop: true });
    
    this.musicWarm.play();
    this.tweens.add({ targets: this.musicWarm, volume: 0.5, duration: 1000 });

    // 4. Particle Systems (Initially dormant/light)
    this.snowParticles = this.add.particles(0, 0, 'particle_snow', {
        x: { min: 0, max: GAME_WIDTH },
        y: -50,
        lifespan: 3000,
        speedY: { min: 50, max: 100 },
        speedX: { min: -20, max: 20 },
        scale: { start: 0.2, end: 0.1 },
        quantity: 1,
        frequency: 200,
        blendMode: 'ADD'
    });

    this.windParticles = this.add.particles(0, 0, 'particle_wind', {
        x: -50,
        y: { min: 0, max: GAME_HEIGHT },
        lifespan: 1000,
        speedX: { min: 400, max: 800 },
        scale: { start: 0.5, end: 0 },
        quantity: 0, // Start with none
        blendMode: 'ADD',
        emitting: false
    });

    // 5. Narrative Text
    const text1 = this.add.text(GAME_WIDTH/2, 100,
        "Pippin and Marmalade were inseparable...",
        { fontSize: '24px', color: '#d4a574', align: 'center', fontStyle: 'italic' }
    ).setOrigin(0.5).setAlpha(0);

    const text2 = this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 50, 
        "Until the storm came.", 
        { fontSize: '28px', color: '#ffffff', align: 'center', stroke: '#000000', strokeThickness: 4 }
    ).setOrigin(0.5).setAlpha(0);

    // Skip functionality
    this.add.text(GAME_WIDTH - 20, 20, 'SPACE to Skip', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 5, y: 5 }
    }).setOrigin(1, 0).setScrollFactor(0);

    this.input.keyboard?.once('keydown-SPACE', () => {
        this.stopAllAudio();
        this.startGame();
    });

    // 6. The Sequence
    this.startPrologueSequence(text1, text2);
  }

  private startPrologueSequence(text1: Phaser.GameObjects.Text, text2: Phaser.GameObjects.Text) {
    this.tweens.chain({
        tweens: [
            // Step 1: Fade in introductory text
            {
                targets: text1,
                alpha: 1,
                duration: 2000,
                hold: 2000,
                yoyo: true
            },
            // Step 2: The Storm Approaches (Color Shift + Wind)
            {
                targets: [],
                duration: 500,
                onComplete: () => {
                    // Start wind
                    this.windParticles.emitting = true;
                    this.windParticles.frequency = 100;
                    this.windParticles.quantity = 2;
                    
                    // Shift bg color to cold
                    // We can't tween graphics colors easily, so we overlay a cold rect and fade it in
                    const coldOverlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x001133).setOrigin(0).setAlpha(0);
                    this.tweens.add({ targets: coldOverlay, alpha: 0.6, duration: 2000 });
                    
                    // Audio shift
                    this.tweens.add({ targets: this.musicWarm, volume: 0, duration: 2000 });
                    this.musicStorm.play();
                    this.tweens.add({ targets: this.musicStorm, volume: 0.6, duration: 2000 });

                    // Characters react
                    this.pippin.play('idle'); // Ensure idle
                    // Make them shake a bit
                    this.tweens.add({
                        targets: [this.pippin, this.marmalade],
                        x: '+=2',
                        yoyo: true,
                        duration: 50,
                        repeat: 20
                    });
                }
            },
            // Step 3: Text 2 "Until the storm came"
            {
                targets: text2,
                alpha: 1,
                duration: 1000,
                hold: 1000,
                onComplete: () => {
                   // Step 4: The Separation
                   this.cameras.main.shake(1000, 0.01);
                   
                   // Increase Wind
                   this.windParticles.frequency = 20;
                   this.snowParticles.speedX = { min: -500, max: -800 };
                   this.snowParticles.speedY = { min: 50, max: 200 };
                   
                   // Marmalade "runs" inside (moves to door and fades)
                   this.tweens.add({
                       targets: this.marmalade,
                       x: this.door.x,
                       duration: 500,
                       onComplete: () => {
                           this.marmalade.setAlpha(0); // Inside
                           // Door "closes" visual (flash or shake door)
                           this.tweens.add({
                               targets: this.door,
                               scaleX: 0.1, // slamming shut visual?
                               duration: 100,
                               yoyo: true
                           });
                       }
                   });

                   // Pippin gets blown away
                   this.pippin.play('fall'); // Assuming fall anim exists
                   this.tweens.add({
                       targets: this.pippin,
                       x: -50, // Blown off screen left
                       y: this.pippin.y + 50, // Down slightly
                       angle: -360, // Tumble
                       duration: 1500,
                       ease: 'Quad.easeIn',
                       onComplete: () => {
                           // Fade out everything
                           this.cameras.main.fadeOut(1000, 0, 0, 0);
                       }
                   });
                }
            },
            // Wait for fade out
            {
                targets: text2, // dummy target
                alpha: 0, // fade out text
                duration: 2000,
                onComplete: () => {
                    this.stopAllAudio();
                    this.startGame();
                }
            }
        ]
    });
  }

  private stopAllAudio() {
      this.musicWarm.stop();
      this.musicStorm.stop();
  }

  private startGame() {
      if (this.hasStartedGame) return;
      this.hasStartedGame = true;
      this.scene.start('GameScene', { level: 1 });
  }
}
