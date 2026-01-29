import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../types';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    console.log('MenuScene: create');
    this.add.image(0, 0, 'bg_ocean').setOrigin(0,0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/3, 'WinterTrek', {
        fontSize: '64px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);
    
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/3 + 60, 'Snowbound & Snuggles', {
        fontSize: '32px',
        color: '#aaddff',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    const startText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'Press SPACE to Start', {
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
        targets: startText,
        alpha: 0,
        duration: 1000,
        yoyo: true,
        repeat: -1
    });

    // Music
    this.sound.stopAll();
    if (this.cache.audio.exists('music_menu')) {
        this.sound.play('music_menu', { loop: true, volume: 0.5 });
    }

    this.input.keyboard?.once('keydown-SPACE', () => {
        console.log('MenuScene: SPACE pressed');
        this.sound.stopAll();
        this.scene.start('PrologueScene');
    });

    // Level Select
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 120, 'Select Level:', {
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
    }).setOrigin(0.5);

    // Media Player Link
    const mediaText = this.add.text(GAME_WIDTH - 20, 20, 'Media Player', {
        fontSize: '20px',
        color: '#aaddff',
        stroke: '#000000',
        strokeThickness: 2
    })
    .setOrigin(1, 0)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => mediaText.setColor('#ffff00'))
    .on('pointerout', () => mediaText.setColor('#aaddff'))
    .on('pointerdown', () => {
        window.open('/media', '_blank');
    });

    const levels = [1, 2, 3, 4, 5, 6];
    const spacing = 80;
    const startX = GAME_WIDTH / 2 - ((levels.length - 1) * spacing) / 2;

    levels.forEach((level, index) => {
        const levelBtn = this.add.text(startX + (index * spacing), GAME_HEIGHT - 70, `${level}`, {
             fontSize: '32px',
             color: '#aaddff',
             stroke: '#000000',
             strokeThickness: 4
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        levelBtn.on('pointerover', () => levelBtn.setColor('#ffff00'));
        levelBtn.on('pointerout', () => levelBtn.setColor('#aaddff'));
        levelBtn.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('GameScene', { level: level });
        });
    });
  }
}
