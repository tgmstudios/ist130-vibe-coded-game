import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load minimal assets for preloader (e.g. progress bar background) if needed
  }

  create() {
    this.scene.start('PreloaderScene');
  }
}


