import Phaser from 'phaser';

export class DialogueBubble extends Phaser.GameObjects.Container {
  private bubble: Phaser.GameObjects.Graphics;
  private isVisible: boolean = false;
  // private content?: Phaser.GameObjects.Image | Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, contentKey?: string, text?: string) {
    super(scene, x, y);
    scene.add.existing(this);

    this.bubble = scene.add.graphics();
    this.drawBubble(100, 60);
    this.add(this.bubble);

    if (contentKey) {
        const img = scene.add.image(0, -10, contentKey).setScale(0.5);
        this.add(img);
        // this.content = img;
    } else if (text) {
        const txt = scene.add.text(0, -10, text, {
            fontSize: '16px',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        this.add(txt);
        // this.content = txt;
    }

    // Float animation
    scene.tweens.add({
        targets: this,
        y: y - 10,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    this.setAlpha(0);
  }

  private drawBubble(w: number, h: number) {
      this.bubble.fillStyle(0xffffff, 1);
      this.bubble.fillRoundedRect(-w/2, -h, w, h, 10);
      
      // Arrow
      this.bubble.beginPath();
      this.bubble.moveTo(-10, 0);
      this.bubble.lineTo(10, 0);
      this.bubble.lineTo(0, 10);
      this.bubble.fillPath();
  }

  public show() {
      if (!this.scene || this.isVisible) return;
      this.isVisible = true;
      this.scene.tweens.add({
          targets: this,
          alpha: 1,
          scale: 1,
          duration: 200,
          ease: 'Back.out'
      });
  }

  public hide() {
      if (!this.scene || !this.isVisible) return;
      this.isVisible = false;
      this.scene.tweens.add({
          targets: this,
          alpha: 0,
          scale: 0,
          duration: 200,
          ease: 'Back.in'
      });
  }
}

