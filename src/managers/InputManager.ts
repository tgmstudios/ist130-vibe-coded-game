import Phaser from 'phaser';

export class InputManager {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  // private slideKey!: Phaser.Input.Keyboard.Key;
  private wKey!: Phaser.Input.Keyboard.Key;
  private aKey!: Phaser.Input.Keyboard.Key;
  private sKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    if (this.scene.input.keyboard) {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // this.slideKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.wKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  }

  get left(): boolean {
    return this.cursors?.left.isDown || this.aKey?.isDown || false;
  }

  get right(): boolean {
    return this.cursors?.right.isDown || this.dKey?.isDown || false;
  }

  get up(): boolean {
    return this.cursors?.up.isDown || this.wKey?.isDown || false;
  }

  get down(): boolean {
    return this.cursors?.down.isDown || this.sKey?.isDown || false;
  }

  get jumpJustPressed(): boolean {
    return (this.cursors?.up && Phaser.Input.Keyboard.JustDown(this.cursors.up)) || 
           (this.jumpKey && Phaser.Input.Keyboard.JustDown(this.jumpKey)) || 
           (this.wKey && Phaser.Input.Keyboard.JustDown(this.wKey)) ||
           false;
  }

  get jumpHeld(): boolean {
      return this.cursors?.up.isDown || this.jumpKey?.isDown || this.wKey?.isDown || false;
  }

  get slide(): boolean {
      return this.cursors?.down.isDown || this.sKey?.isDown || false;
  }
}


