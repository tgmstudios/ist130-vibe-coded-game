import Phaser from 'phaser';

export class HUDScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super('HUDScene');
  }

  create(data: { collected: number }) {
    this.scoreText = this.add.text(20, 20, `Fish: ${data.collected || 0}`, { 
        fontSize: '24px', 
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
    });

    const gameScene = this.scene.get('GameScene');
    if (gameScene) {
        gameScene.events.on('updateHUD', (count: number) => {
            this.scoreText.setText(`Fish: ${count}`);
        });
    }
  }
}


