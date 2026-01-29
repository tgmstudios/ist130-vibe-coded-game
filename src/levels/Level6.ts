import Phaser from 'phaser';
import { ILevel, LevelObjects } from './ILevel';
import { GAME_HEIGHT } from '../types';

export class Level6 implements ILevel {
    public build(scene: Phaser.Scene): LevelObjects {
        const platforms = scene.physics.add.staticGroup();
        const movingPlatforms = scene.physics.add.group({ allowGravity: false, immovable: true });
        const collectibles = scene.physics.add.group({ allowGravity: false, immovable: true });
        const enemies = scene.physics.add.group();
        const bouncers = scene.physics.add.staticGroup();
        const npcs = scene.add.group();
        const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

        const tileColor = 0x6644aa; // Frozen cave purple

        // --- Ground Segments ---
        // Start area
        this.createFloor(platforms, 0, 600, tileColor);

        // Middle section 1
        this.createFloor(platforms, 800, 1600, tileColor);

        // Middle section 2
        this.createFloor(platforms, 1900, 2600, tileColor);

        // End section
        this.createFloor(platforms, 3000, 4000, tileColor);

        // --- Static Platforms ---
        // Over gap 1 (600-800)
        this.createPlatform(platforms, 700, 550, tileColor);

        // Elevated platforms in section 1
        this.createPlatform(platforms, 1000, 500, tileColor);
        this.createPlatform(platforms, 1200, 400, tileColor);
        this.createPlatform(platforms, 1400, 500, tileColor);

        // Over gap 2 (1600-1900)
        this.createPlatform(platforms, 1750, 550, tileColor);

        // Elevated platforms in section 2
        this.createPlatform(platforms, 2100, 450, tileColor);
        this.createPlatform(platforms, 2400, 400, tileColor);

        // Over gap 3 (2600-3000) - stepping stones
        this.createPlatform(platforms, 2700, 550, tileColor);
        this.createPlatform(platforms, 2900, 500, tileColor);

        // Elevated platforms in end section
        this.createPlatform(platforms, 3200, 450, tileColor);
        this.createPlatform(platforms, 3500, 500, tileColor);

        // --- Moving Platforms ---
        // Gap 2 area - horizontal mover
        const mp1 = movingPlatforms.create(1650, 500, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp1,
            x: 1850,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Section 2 - vertical mover
        const mp2 = movingPlatforms.create(2250, 500, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp2,
            y: 350,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Gap 3 area - horizontal mover
        const mp3 = movingPlatforms.create(2800, 450, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp3,
            x: 2950,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        [mp1, mp2, mp3].forEach(p => {
            p.setImmovable(true);
            p.body.checkCollision.up = true;
            p.body.checkCollision.down = true;
            p.body.checkCollision.left = true;
            p.body.checkCollision.right = true;
        });

        // --- Bouncers ---
        const bouncer1 = bouncers.create(1000, 600, 'barnaby');
        bouncer1.refreshBody();

        const bouncer2 = bouncers.create(2400, 500, 'barnaby');
        bouncer2.refreshBody();

        // --- Enemies ---
        const enemy1 = enemies.create(1300, 600, 'penguin');
        enemy1.setCollideWorldBounds(false);
        enemy1.setBounce(0);
        enemy1.setVelocityX(60);
        enemy1.setData('patrolMin', 1100);
        enemy1.setData('patrolMax', 1500);

        const enemy2 = enemies.create(3300, 600, 'penguin');
        enemy2.setCollideWorldBounds(false);
        enemy2.setBounce(0);
        enemy2.setVelocityX(-60);
        enemy2.setData('patrolMin', 3100);
        enemy2.setData('patrolMax', 3500);

        // --- Collectibles (Fish) ---
        collectibles.create(700, 480, 'fish').setScale(0.1);
        collectibles.create(1200, 340, 'fish').setScale(0.1);
        collectibles.create(2100, 390, 'fish').setScale(0.1);
        collectibles.create(3200, 390, 'fish').setScale(0.1);

        // --- Goal ---
        const goal = scene.physics.add.sprite(3800, 600, 'marmalade');
        goal.setImmovable(true);
        (goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        goal.body.setSize(40, 40);
        goal.body.setOffset(44, 88);

        return { platforms, movingPlatforms, collectibles, enemies, goal, windZones, bouncers, npcs };
    }

    private createFloor(group: Phaser.Physics.Arcade.StaticGroup, startX: number, endX: number, _color: number) {
        for (let x = startX; x < endX; x += 32) {
            const p = group.create(x, GAME_HEIGHT - 32, 'pattern_rock')
                .setOrigin(0, 0)
                .setDisplaySize(32, 32);
            p.clearTint();
            p.setTint(0x6644aa);
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
}
