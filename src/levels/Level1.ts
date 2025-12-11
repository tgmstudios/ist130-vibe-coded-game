import Phaser from 'phaser';
import { ILevel, LevelObjects } from './ILevel';
import { GAME_HEIGHT } from '../types';

export class Level1 implements ILevel {
    public build(scene: Phaser.Scene): LevelObjects {
        const platforms = scene.physics.add.staticGroup();
        const movingPlatforms = scene.physics.add.group({ allowGravity: false, immovable: true });
        const collectibles = scene.physics.add.group({ allowGravity: false, immovable: true });
        const enemies = scene.physics.add.group();
        const bouncers = scene.physics.add.staticGroup();
        const npcs = scene.add.group();
        const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

        const tileColor = 0xaaddff; // Ice Blue

        // --- Ground Segments ---
        // Start Island
        this.createFloor(platforms, 0, 400, tileColor);
        
        // Middle Island (Barnaby)
        this.createFloor(platforms, 1200, 1600, tileColor);

        // End Island
        this.createFloor(platforms, 2400, 3000, tileColor);

        // --- Moving Platforms (Ice Floes) ---
        // Gap 1: 400 - 1200
        const p1 = movingPlatforms.create(500, 600, 'platform_96x32').setTint(tileColor);
        const p2 = movingPlatforms.create(750, 520, 'platform_96x32').setTint(tileColor); // Step up
        const p3 = movingPlatforms.create(1000, 440, 'platform_96x32').setTint(tileColor); // Step up

        // Gap 2: 1600 - 2400
        const p4 = movingPlatforms.create(1700, 500, 'platform_96x32').setTint(tileColor);
        const p5 = movingPlatforms.create(2000, 550, 'platform_96x32').setTint(tileColor);
        const p6 = movingPlatforms.create(2250, 480, 'platform_96x32').setTint(tileColor);

        [p1, p2, p3, p4, p5, p6].forEach(p => {
            p.setImmovable(true);
            p.body.checkCollision.up = true;
            p.body.checkCollision.down = true;
            p.body.checkCollision.left = true;
            p.body.checkCollision.right = true;
        });

        // --- Bouncers ---
        // Barnaby on the middle island
        const barnaby = bouncers.create(1350, 500, 'barnaby');
        barnaby.refreshBody();

        // --- Collectibles ---
        collectibles.create(750, 450, 'fish').setScale(0.1);
        collectibles.create(2000, 450, 'fish').setScale(0.1);

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
            p.body.checkCollision.down = true;
            p.body.checkCollision.up = true;
            p.body.checkCollision.left = true;
            p.body.checkCollision.right = true;
        }
    }
}

