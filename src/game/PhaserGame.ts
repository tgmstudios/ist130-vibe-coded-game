import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { LoadingScene } from '../scenes/LoadingScene';
import { PreloaderScene } from '../scenes/PreloaderScene';
import { MenuScene } from '../scenes/MenuScene';
import { PrologueScene } from '../scenes/PrologueScene';
import { GameScene } from '../scenes/GameScene';
import { HUDScene } from '../scenes/HUDScene';
import { EndingScene } from '../scenes/EndingScene';
import { PauseScene } from '../scenes/PauseScene';
import { GAME_WIDTH, GAME_HEIGHT } from '../types';

export const createGame = (canvas: HTMLCanvasElement) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    canvas: canvas,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 1000 },
        debug: false // Set to true to see hitboxes
      }
    },
    scene: [BootScene, LoadingScene, PreloaderScene, MenuScene, PrologueScene, GameScene, HUDScene, EndingScene, PauseScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  return new Phaser.Game(config);
};
