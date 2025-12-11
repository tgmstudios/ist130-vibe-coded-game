import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../types';

export class PrologueScene extends Phaser.Scene {
  private hasStartedGame = false;

  constructor() {
    super('PrologueScene');
  }

  init() {
    this.hasStartedGame = false;
  }

  create() {
    console.log('PrologueScene: create');
    this.cameras.main.setBackgroundColor('#000000');

    const text1 = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 
        "Pippin and Marmalade were inseparable.", 
        { fontSize: '28px', color: '#ffcc99', align: 'center' }
    ).setOrigin(0.5).setAlpha(0);

    const text2 = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 
        "Until the storm came...", 
        { fontSize: '28px', color: '#aaccff', align: 'center' }
    ).setOrigin(0.5).setAlpha(0);

    // Timeline
    // In recent Phaser versions, createTimeline might be on the tweens manager or scene.
    // However, it is often simpler to chain tweens.
    // Alternatively, this.tweens.timeline was the old way, but it might be removed in v3.60+.
    // We will use a chain of tweens for compatibility.
    
    this.tweens.add({
        targets: text1,
        alpha: 1,
        duration: 2000,
        hold: 2000,
        yoyo: true,
        onComplete: () => {
             this.tweens.add({
                targets: text2,
                alpha: 1,
                duration: 2000,
                hold: 2000,
                yoyo: true,
                onComplete: () => {
                    this.startGame();
                }
            });
        }
    });
    // Skip Prompt
    const skipText = this.add.text(GAME_WIDTH - 20, GAME_HEIGHT - 20, 'Press SPACE to Skip', {
        fontSize: '18px',
        color: '#ffffff',
    }).setOrigin(1, 1).setAlpha(0.5);

    // Skip
    this.input.keyboard?.once('keydown-SPACE', () => {
        console.log('PrologueScene: SPACE pressed');
        this.startGame();
    });
  }

  private startGame() {
      if (this.hasStartedGame) return;
      this.hasStartedGame = true;
      console.log('PrologueScene: Starting GameScene');
      this.scene.start('GameScene', { level: 1 });
  }
}
