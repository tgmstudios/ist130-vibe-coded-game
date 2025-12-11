import Phaser from 'phaser';
import { ILevel, LevelObjects } from './ILevel';
import { GAME_HEIGHT } from '../types';

export class Level2 implements ILevel {
    public build(scene: Phaser.Scene): LevelObjects {
        const platforms = scene.physics.add.staticGroup();
        const movingPlatforms = scene.physics.add.group({ allowGravity: false, immovable: true });
        const collectibles = scene.physics.add.group({ allowGravity: false, immovable: true });
        const enemies = scene.physics.add.group();
        const bouncers = scene.physics.add.staticGroup();
        const npcs = scene.add.group();
        const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

        const tileColor = 0x228822; // Forest Green

        // --- Ground ---
        this.createFloor(platforms, 0, 3000, tileColor);

        // --- Vertical Platforms (Tree Climbing) ---
        // Tree 1
        this.createPlatform(platforms, 400, 550, tileColor);
        this.createPlatform(platforms, 300, 450, tileColor);
        this.createPlatform(platforms, 450, 350, tileColor);
        
        // Tree 2 (Wind Gap)
        this.createPlatform(platforms, 800, 500, tileColor);
        this.createPlatform(platforms, 950, 400, tileColor);
        this.createPlatform(platforms, 800, 300, tileColor); // High point

        // Tree 3 (Descent)
        this.createPlatform(platforms, 1300, 400, tileColor);
        this.createPlatform(platforms, 1450, 500, tileColor);

        // --- Wind Zones ---
        // Between Tree 1 and 2
        this.createWindZone(scene, windZones, 600, 300, 200, 400);
        
        // Between Tree 2 and 3 (Higher up)
        this.createWindZone(scene, windZones, 1100, 200, 200, 400);

        // --- NPCs ---
        // Luna (Visual Guide) near the first wind zone
        const luna = scene.add.image(550, 300, 'luna');
        npcs.add(luna);

        // --- Collectibles ---
        collectibles.create(450, 300, 'fish').setScale(0.1);
        collectibles.create(800, 250, 'fish').setScale(0.1); // High reward
        collectibles.create(1450, 450, 'fish').setScale(0.1);

        // --- Goal ---
        const goal = scene.physics.add.sprite(2800, 600, 'marmalade');
        goal.setImmovable(true);
        (goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        goal.body.setSize(40, 40);
        goal.body.setOffset(44, 88);

        return { platforms, movingPlatforms, collectibles, enemies, goal, windZones, bouncers, npcs };
    }

    private createFloor(group: Phaser.Physics.Arcade.StaticGroup, startX: number, endX: number, color: number) {
        for (let x = startX; x < endX; x += 32) {
            const p = group.create(x, GAME_HEIGHT - 32, 'pixel').setScale(32, 32).setTint(color).setOrigin(0,0);
            p.refreshBody();
        }
    }

    private createPlatform(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, color: number) {
        const p = group.create(x, y, 'platform_96x32').setTint(color).refreshBody();
        p.body.checkCollision.up = true;
        p.body.checkCollision.down = true;
        p.body.checkCollision.left = true;
        p.body.checkCollision.right = true;
    }

    private createWindZone(scene: Phaser.Scene, windZones: any[], x: number, y: number, w: number, h: number) {
        const windZone = scene.add.rectangle(x, y, w, h, 0x00ff00, 0) as any;
        scene.physics.add.existing(windZone);
        (windZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        windZones.push(windZone);
    }
}

