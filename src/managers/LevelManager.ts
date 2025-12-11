import Phaser from 'phaser';
import { LevelConfig } from '../types';
import { ILevel, LevelObjects } from '../levels/ILevel';
import { Level1 } from '../levels/Level1';
import { Level2 } from '../levels/Level2';
import { Level3 } from '../levels/Level3';
import { Level4 } from '../levels/Level4';
import { Level5 } from '../levels/Level5';

export class LevelManager {
  private scene: Phaser.Scene;
  private levels: Map<number, ILevel>;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.levels = new Map();
    this.levels.set(1, new Level1());
    this.levels.set(2, new Level2());
    this.levels.set(3, new Level3());
    this.levels.set(4, new Level4());
    this.levels.set(5, new Level5());
  }

  getLevelConfig(levelId: number): LevelConfig {
    const baseConfig = {
        id: levelId,
        startPosition: { x: 100, y: 500 },
        goalPosition: { x: 3000, y: 600 }, // Default fallback
        width: 4000
    };

    switch (levelId) {
        case 1:
            return {
                ...baseConfig,
                name: 'The Frosty Floes',
                background: 'bg_ocean',
                music: 'music_floes',
                physics: { friction: 0.1 },
                goalPosition: { x: 2800, y: 600 },
                width: 3000
            };
        case 2:
            return {
                ...baseConfig,
                name: 'The Whispering Woods',
                background: 'bg_forest',
                music: 'music_woods',
                mechanics: { hasMist: true, hasWindZones: true },
                goalPosition: { x: 4300, y: 600 },
                width: 4500
            };
        case 3:
            return {
                ...baseConfig,
                name: 'The Crystal Caverns',
                background: 'bg_cave',
                music: 'music_cave',
                mechanics: { isDark: true },
                goalPosition: { x: 5200, y: 600 },
                width: 5500
            };
        case 4:
            return {
                ...baseConfig,
                name: 'The Howling Ridge',
                background: 'bg_storm',
                music: 'music_storm',
                mechanics: { hasFallingIcicles: true },
                physics: { windX: -5 },
                goalPosition: { x: 4300, y: 600 },
                width: 4500
            };
        case 5:
            return {
                ...baseConfig,
                name: 'The Summit',
                background: 'bg_ocean',
                music: 'music_ending',
                goalPosition: { x: 1000, y: 70 }, // Adjusted for tower top
                width: 2000
            };
        default:
            return {
                ...baseConfig,
                name: 'Unknown Level',
                background: 'bg_ocean',
                music: 'music_floes',
                mechanics: {}
            };
    }
  }

  buildLevel(levelId: number): LevelObjects {
     const levelStrategy = this.levels.get(levelId);
     if (levelStrategy) {
         return levelStrategy.build(this.scene);
     }
     
     // Fallback for unknown levels (shouldn't happen)
     return new Level1().build(this.scene);
  }
}
