import Phaser from 'phaser';

export class AudioManager {
  private scene: Phaser.Scene;
  private currentMusic?: Phaser.Sound.BaseSound;
  private currentMusicKey: string = '';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public playMusic(key: string, config: Phaser.Types.Sound.SoundConfig = { loop: true, volume: 0.5 }) {
    if (this.currentMusicKey === key) return;

    // Fade out old
    if (this.currentMusic && this.currentMusic.isPlaying) {
        this.scene.tweens.add({
            targets: this.currentMusic,
            volume: 0,
            duration: 1000,
            onComplete: () => {
                // @ts-ignore - stop() exists on BaseSound but TS might complain if not casted to specific type
                this.currentMusic?.stop(); 
            }
        });
    }

    // Play new
    if (this.scene.cache.audio.exists(key)) {
        this.currentMusicKey = key;
        this.currentMusic = this.scene.sound.add(key, { ...config, volume: 0 });
        this.currentMusic.play();
        
        this.scene.tweens.add({
            targets: this.currentMusic,
            volume: config.volume || 0.5,
            duration: 1000
        });
    }
  }

  public playSFX(key: string, config: Phaser.Types.Sound.SoundConfig = { volume: 1 }) {
      if (this.scene.cache.audio.exists(key)) {
          this.scene.sound.play(key, config);
      }
  }

  public stopAll() {
      this.scene.sound.stopAll();
      this.currentMusic = undefined;
      this.currentMusicKey = '';
  }
}

