import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../types';

export class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#8B4513'); // Warm wood color (Lighthouse interior)

    // Center content
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    // Narrative Text
    this.add.text(centerX, centerY - 150, 'THE END', { 
        fontSize: '64px', 
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 150, 'Pippin & Marmalade United', {
        fontSize: '32px',
        color: '#ffcc99',
        fontStyle: 'italic'
    }).setOrigin(0.5);

    // Sprites "curled up"
    // Using Marmalade sleeping frame and Pippin slide (laying down) frame
    const marmalade = this.add.sprite(centerX + 20, centerY, 'marmalade', '2'); // Sleeping
    const pippin = this.add.sprite(centerX - 20, centerY + 10, 'pippin', '5'); // Laying down

    marmalade.setScale(2);
    pippin.setScale(2);
    pippin.setFlipX(true); // Face Marmalade

    // Fire effect (simple particles)
    this.add.particles(0, 0, 'pixel', {
        x: centerX,
        y: centerY + 50,
        speed: { min: 20, max: 50 },
        angle: { min: 220, max: 320 },
        scale: { start: 10, end: 0 },
        blendMode: 'ADD',
        lifespan: 1000,
        frequency: 100,
        tint: [0xff0000, 0xffa500, 0xffff00]
    });
    
    // Restart logic
    const restartText = this.add.text(centerX, GAME_HEIGHT - 50, 'Press SPACE to Restart', {
        fontSize: '24px',
        color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
        targets: restartText,
        alpha: 1,
        duration: 1000,
        delay: 2000,
        yoyo: true,
        repeat: -1
    });

    this.input.keyboard?.once('keydown-SPACE', () => {
        this.scene.start('MenuScene');
    });
  }
}

