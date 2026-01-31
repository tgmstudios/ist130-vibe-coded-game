import Phaser from 'phaser';
import { ILevel, LevelObjects } from './ILevel';
import { GAME_HEIGHT } from '../types';

export class Level7 implements ILevel {
    public build(scene: Phaser.Scene): LevelObjects {
        const platforms = scene.physics.add.staticGroup();
        const movingPlatforms = scene.physics.add.group({ allowGravity: false, immovable: true });
        const collectibles = scene.physics.add.group({ allowGravity: false, immovable: true });
        const enemies = scene.physics.add.group();
        const bouncers = scene.physics.add.staticGroup();
        const npcs = scene.add.group();
        const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

        const tileColor = 0x88ccff; // Bright Ice Blue

        // --- Ground Segments (Many gaps for increased difficulty) ---
        // Start area
        this.createFloor(platforms, 0, 400, tileColor);

        // Island 1
        this.createFloor(platforms, 600, 1000, tileColor);

        // Island 2
        this.createFloor(platforms, 1300, 1800, tileColor);

        // Island 3
        this.createFloor(platforms, 2100, 2600, tileColor);

        // Island 4
        this.createFloor(platforms, 2900, 3400, tileColor);

        // End area
        this.createFloor(platforms, 3700, 4500, tileColor);

        // --- Elevated Platforms (Vertical challenge) ---
        // Section 1: Ascent from start
        this.createPlatform(platforms, 200, 550, tileColor);
        this.createPlatform(platforms, 350, 450, tileColor);
        this.createPlatform(platforms, 200, 350, tileColor); // High perch

        // Over gap 1 (400-600)
        this.createPlatform(platforms, 500, 500, tileColor);

        // Section 2: Island 1 vertical climb
        this.createPlatform(platforms, 700, 500, tileColor);
        this.createPlatform(platforms, 850, 400, tileColor);
        this.createPlatform(platforms, 700, 300, tileColor);
        this.createPlatform(platforms, 950, 250, tileColor); // Very high

        // Over gap 2 (1000-1300) - Tricky jump sequence
        this.createPlatform(platforms, 1100, 400, tileColor);
        this.createPlatform(platforms, 1200, 300, tileColor);

        // Section 3: Island 2 hazard zone
        this.createPlatform(platforms, 1400, 500, tileColor);
        this.createPlatform(platforms, 1600, 400, tileColor);
        this.createPlatform(platforms, 1400, 300, tileColor);
        this.createPlatform(platforms, 1700, 250, tileColor);

        // Over gap 3 (1800-2100) - Long gap
        this.createPlatform(platforms, 1900, 450, tileColor);
        this.createPlatform(platforms, 2000, 350, tileColor);

        // Section 4: Island 3 gauntlet
        this.createPlatform(platforms, 2200, 550, tileColor);
        this.createPlatform(platforms, 2350, 450, tileColor);
        this.createPlatform(platforms, 2500, 350, tileColor);

        // Over gap 4 (2600-2900)
        this.createPlatform(platforms, 2750, 400, tileColor);

        // Section 5: Island 4 final climb
        this.createPlatform(platforms, 3000, 500, tileColor);
        this.createPlatform(platforms, 3200, 400, tileColor);
        this.createPlatform(platforms, 3100, 300, tileColor);
        this.createPlatform(platforms, 3300, 200, tileColor); // Highest platform

        // Over gap 5 (3400-3700) - Final challenge
        this.createPlatform(platforms, 3550, 450, tileColor);
        this.createPlatform(platforms, 3650, 350, tileColor);

        // End section platforms
        this.createPlatform(platforms, 3900, 500, tileColor);
        this.createPlatform(platforms, 4100, 400, tileColor);

        // --- Moving Platforms (Multiple challenging movers) ---
        // Gap 1 - Fast horizontal
        const mp1 = movingPlatforms.create(500, 600, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp1,
            x: 550,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Gap 2 - Vertical mover
        const mp2 = movingPlatforms.create(1150, 500, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp2,
            y: 350,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Gap 3 - Fast horizontal
        const mp3 = movingPlatforms.create(1950, 550, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp3,
            x: 2050,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Gap 4 - Diagonal mover (tricky!)
        const mp4 = movingPlatforms.create(2700, 550, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp4,
            x: 2850,
            y: 400,
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Gap 5 - Double movers
        const mp5 = movingPlatforms.create(3500, 550, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp5,
            y: 450,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const mp6 = movingPlatforms.create(3600, 400, 'platform_96x32').setTint(tileColor);
        scene.tweens.add({
            targets: mp6,
            x: 3680,
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        [mp1, mp2, mp3, mp4, mp5, mp6].forEach(p => {
            p.setImmovable(true);
            p.body.checkCollision.up = true;
            p.body.checkCollision.down = true;
            p.body.checkCollision.left = true;
            p.body.checkCollision.right = true;
        });

        // --- Bouncers ---
        const bouncer1 = bouncers.create(800, 600, 'barnaby');
        bouncer1.refreshBody();

        const bouncer2 = bouncers.create(2300, 600, 'barnaby');
        bouncer2.refreshBody();

        const bouncer3 = bouncers.create(3800, 600, 'barnaby');
        bouncer3.refreshBody();

        // --- Enemies (Many patrolling enemies for difficulty) ---
        // Enemy 1 - Island 1 patrol
        const enemy1 = enemies.create(700, 600, 'penguin');
        enemy1.setCollideWorldBounds(false);
        enemy1.setBounce(0);
        enemy1.setVelocityX(80);
        enemy1.setData('patrolMin', 620);
        enemy1.setData('patrolMax', 980);

        // Enemy 2 - Island 2 patrol (fast)
        const enemy2 = enemies.create(1500, 600, 'penguin');
        enemy2.setCollideWorldBounds(false);
        enemy2.setBounce(0);
        enemy2.setVelocityX(-100);
        enemy2.setData('patrolMin', 1320);
        enemy2.setData('patrolMax', 1780);

        // Enemy 3 - Island 2 platform patrol
        const enemy3 = enemies.create(1600, 350, 'penguin');
        enemy3.setCollideWorldBounds(false);
        enemy3.setBounce(0);
        enemy3.setVelocityX(50);
        enemy3.setData('patrolMin', 1400);
        enemy3.setData('patrolMax', 1700);

        // Enemy 4 - Island 3 patrol
        const enemy4 = enemies.create(2300, 600, 'penguin');
        enemy4.setCollideWorldBounds(false);
        enemy4.setBounce(0);
        enemy4.setVelocityX(70);
        enemy4.setData('patrolMin', 2120);
        enemy4.setData('patrolMax', 2580);

        // Enemy 5 - Island 4 patrol
        const enemy5 = enemies.create(3100, 600, 'penguin');
        enemy5.setCollideWorldBounds(false);
        enemy5.setBounce(0);
        enemy5.setVelocityX(-90);
        enemy5.setData('patrolMin', 2920);
        enemy5.setData('patrolMax', 3380);

        // Enemy 6 - End area patrol (very fast)
        const enemy6 = enemies.create(4000, 600, 'penguin');
        enemy6.setCollideWorldBounds(false);
        enemy6.setBounce(0);
        enemy6.setVelocityX(110);
        enemy6.setData('patrolMin', 3720);
        enemy6.setData('patrolMax', 4300);

        // --- Wind Zones (Two challenging wind sections) ---
        // Wind Zone 1 - Pushes left over gap 3
        this.createWindZone(scene, windZones, 1950, 400, 300, 350);
        this.createLunaWind(scene, npcs, 2100, 350);

        // Wind Zone 2 - Pushes left in final stretch
        this.createWindZone(scene, windZones, 3550, 350, 250, 300);
        this.createLunaWind(scene, npcs, 3700, 300);

        // --- Collectibles (Fish rewards for exploration) ---
        collectibles.create(200, 300, 'fish').setScale(0.1);  // High start platform
        collectibles.create(950, 200, 'fish').setScale(0.1);  // Highest Island 1
        collectibles.create(1200, 250, 'fish').setScale(0.1); // Gap 2 high
        collectibles.create(1700, 200, 'fish').setScale(0.1); // Island 2 top
        collectibles.create(2500, 300, 'fish').setScale(0.1); // Island 3 top
        collectibles.create(3300, 150, 'fish').setScale(0.1); // Highest platform in game
        collectibles.create(4100, 350, 'fish').setScale(0.1); // End section

        // --- Goal ---
        const goal = scene.physics.add.sprite(4300, 600, 'marmalade');
        goal.setImmovable(true);
        (goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        goal.body.setSize(40, 40);
        goal.body.setOffset(44, 88);

        return { platforms, movingPlatforms, collectibles, enemies, goal, windZones, bouncers, npcs };
    }

    private createFloor(group: Phaser.Physics.Arcade.StaticGroup, startX: number, endX: number, color: number) {
        for (let x = startX; x < endX; x += 32) {
            const p = group.create(x, GAME_HEIGHT - 32, 'pixel').setScale(32, 32).setTint(color).setOrigin(0, 0);
            p.refreshBody();
            p.body.checkCollision.down = true;
            p.body.checkCollision.up = true;
            p.body.checkCollision.left = true;
            p.body.checkCollision.right = true;
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
        // Physics Zone
        const windZone = scene.add.rectangle(x, y, w, h, 0x00ff00, 0) as any;
        scene.physics.add.existing(windZone);
        (windZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        windZones.push(windZone);

        // Visual Effects (White Lines)
        scene.add.particles(0, 0, 'pixel', {
            x: { min: x - w / 2, max: x + w / 2 },
            y: { min: y - h / 2, max: y + h / 2 },
            quantity: 2,
            frequency: 50,
            angle: 180, // Left
            speedX: { min: -400, max: -200 },
            scaleX: { min: 20, max: 60 },
            scaleY: { min: 1, max: 2 },
            alpha: { min: 0.2, max: 0.5 },
            lifespan: 600,
            tint: 0xffffff
        });
    }

    private createLunaWind(scene: Phaser.Scene, group: Phaser.GameObjects.Group, x: number, y: number) {
        const luna = scene.add.image(x, y, 'luna');
        luna.setFlipX(true); // Face left
        group.add(luna);
    }
}
