import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../types';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    // Semi-transparent background
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7).setOrigin(0);

    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    // Title
    this.add.text(centerX, centerY - 100, 'PAUSED', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Resume Button
    const resumeText = this.add.text(centerX, centerY, 'RESUME', {
      fontSize: '32px',
      color: '#ffffff'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => resumeText.setColor('#ffff00'))
    .on('pointerout', () => resumeText.setColor('#ffffff'))
    .on('pointerdown', () => this.resumeGame());

    // Main Menu Button
    const menuText = this.add.text(centerX, centerY + 80, 'MAIN MENU', {
      fontSize: '32px',
      color: '#ffffff'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => menuText.setColor('#ffff00'))
    .on('pointerout', () => menuText.setColor('#ffffff'))
    .on('pointerdown', () => this.quitToMenu());

    // ESC to Resume
    this.input.keyboard?.on('keydown-ESC', () => {
        this.resumeGame();
    });
  }

  private resumeGame() {
    this.scene.resume('GameScene');
    this.scene.stop();
  }

  private quitToMenu() {
    this.scene.stop('GameScene');
    this.scene.stop('HUDScene');
    this.scene.start('MenuScene');
  }
}

