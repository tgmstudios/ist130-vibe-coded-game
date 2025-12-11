import Phaser from 'phaser';

export interface LevelObjects {
    platforms: Phaser.Physics.Arcade.StaticGroup;
    movingPlatforms: Phaser.Physics.Arcade.Group;
    collectibles: Phaser.Physics.Arcade.Group;
    enemies: Phaser.Physics.Arcade.Group;
    goal: Phaser.GameObjects.Sprite;
    windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[];
    bouncers: Phaser.Physics.Arcade.StaticGroup;
    npcs: Phaser.GameObjects.Group;
}

export interface ILevel {
    build(scene: Phaser.Scene): LevelObjects;
}

