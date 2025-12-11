import Phaser from 'phaser';

export class HUDScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super('HUDScene');
  }

  create(data: { collected: number }) {
    // Fish Icon
    this.add.image(30, 30, 'fish').setScale(0.1);

    // Text
    this.scoreText = this.add.text(50, 20, `${data.collected || 0}`, { 
        fontSize: '32px', 
        color: '#ffffff',
        fontFamily: 'Arial', // Or a better game font if available
        stroke: '#000000',
        strokeThickness: 4
    });

    const gameScene = this.scene.get('GameScene');
    if (gameScene) {
        gameScene.events.on('updateHUD', (count: number) => {
            this.scoreText.setText(`${count}`);
        });
    }
  }
}


