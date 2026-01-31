import Phaser from 'phaser';
import { ILevel, LevelObjects } from './ILevel';
import { GAME_HEIGHT } from '../types';

export class Level8 implements ILevel {
    public build(scene: Phaser.Scene): LevelObjects {
        const platforms = scene.physics.add.staticGroup();
        const movingPlatforms = scene.physics.add.group({ allowGravity: false, immovable: true });
        const collectibles = scene.physics.add.group({ allowGravity: false, immovable: true });
        const enemies = scene.physics.add.group();
        const bouncers = scene.physics.add.staticGroup();
        const npcs = scene.add.group();
        const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

        const tileColor = 0xffffff; // Stark white for the summit
        const rockColor = 0x95a5a6; // Grey for rocks

        // --- Ground Segments (The Ascent Begins) ---
        // Start platform
        this.createFloor(platforms, 0, 300, tileColor);

        // --- The Climb (Complex vertical platforming) ---
        // Section 1: Icy steps and moving blocks
        this.createPlatform(platforms, 450, 650, tileColor);
        this.createPlatform(platforms, 600, 550, tileColor);
        const mp1 = movingPlatforms.create(800, 500, 'platform_96x32').setTint(tileColor); // Vertical mover
        scene.tweens.add({ targets: mp1, y: 350, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.createPlatform(platforms, 600, 250, rockColor); // High perch

        // Section 2: Wind gauntlet
        this.createPlatform(platforms, 900, 450, rockColor);
        this.createWindZone(scene, windZones, 1050, 350, 400, 400); // Strong updraft
        this.createLunaWind(scene, npcs, 1150, 500, false); // Luna creating updraft
        this.createPlatform(platforms, 1300, 200, tileColor); // Platform above wind

        // Enemy on the high platform
        const enemy1 = enemies.create(1300, 150, 'penguin');
        enemy1.setCollideWorldBounds(false).setBounce(0).setVelocityX(80);
        enemy1.setData('patrolMin', 1250).setData('patrolMax', 1350);

        // Section 3: Tricky diagonal and falling platforms
        const mp2 = movingPlatforms.create(1500, 400, 'platform_96x32').setTint(rockColor); // Diagonal
        scene.tweens.add({ targets: mp2, x: 1700, y: 600, duration: 2500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        
        this.createPlatform(platforms, 1900, 650, tileColor);
        this.createPlatform(platforms, 2100, 550, tileColor);
        // A bouncer for a high jump
        const bouncer1 = bouncers.create(2250, 500, 'barnaby');
        bouncer1.refreshBody();

        this.createPlatform(platforms, 2200, 200, rockColor); // High reward platform

        // Section 4: The approach to the summit (multiple enemies)
        this.createFloor(platforms, 2400, 3000, tileColor);
        const enemy2 = enemies.create(2500, 600, 'penguin').setVelocityX(100);
        enemy2.setCollideWorldBounds(false).setBounce(0);
        enemy2.setData('patrolMin', 2420).setData('patrolMax', 2680);
        const enemy3 = enemies.create(2800, 600, 'penguin').setVelocityX(-120);
        enemy3.setCollideWorldBounds(false).setBounce(0);
        enemy3.setData('patrolMin', 2700).setData('patrolMax', 2980);

        this.createPlatform(platforms, 3100, 500, rockColor);
        const mp3 = movingPlatforms.create(3300, 400, 'platform_96x32').setTint(tileColor); // Fast horizontal
        scene.tweens.add({ targets: mp3, x: 3600, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.createPlatform(platforms, 3800, 300, rockColor);


        // --- Collectible Embers (Tricky Locations) ---
        collectibles.create(600, 200, 'ember').setScale(0.15); // High perch at start
        collectibles.create(1150, 250, 'ember').setScale(0.15); // In the updraft
        collectibles.create(2200, 150, 'ember').setScale(0.15); // High reward after bouncer
        collectibles.create(3850, 250, 'ember').setScale(0.15); // On the final platform before boss

        // --- The Summit (Boss Encounter Area) ---
        this.createFloor(platforms, 4000, 5000, tileColor, 700); // Wider floor for the arena

        // Boss-like Encounter: The Yeti Penguin
        const boss = enemies.create(4500, 550, 'penguin');
        boss.setScale(2.5).setTint(0xaaaaff).setImmovable(true);
        (boss.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
        boss.setCollideWorldBounds(false).setBounce(0);
        boss.setVelocityX(150);
        boss.setData('patrolMin', 4200).setData('patrolMax', 4800);
        
        // Add smaller, faster patrol guards in the arena
        const guard1 = enemies.create(4300, 600, 'penguin').setVelocityX(200);
        guard1.setCollideWorldBounds(false).setBounce(0).setData('patrolMin', 4100).setData('patrolMax', 4900);
        const guard2 = enemies.create(4700, 600, 'penguin').setVelocityX(-200);
        guard2.setCollideWorldBounds(false).setBounce(0).setData('patrolMin', 4100).setData('patrolMax', 4900);

        // Add some small platforms to help dodge
        this.createPlatform(platforms, 4250, 550, rockColor);
        this.createPlatform(platforms, 4750, 550, rockColor);

        // Final wind hazard pushing away from the goal
        this.createWindZone(scene, windZones, 4900, 450, 200, 400, true);
        this.createLunaWind(scene, npcs, 5000, 450, true);

        // --- Goal ---
        const goal = scene.physics.add.sprite(4950, 600, 'marmalade');
        goal.setImmovable(true);
        (goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        goal.body.setSize(40, 40).setOffset(44, 88);


        // Set properties for all moving platforms
        movingPlatforms.children.iterate((c: any) => {
            const p = c as Phaser.Physics.Arcade.Sprite;
            p.setImmovable(true);
            p.body.checkCollision.up = true;
            p.body.checkCollision.down = true;
            p.body.checkCollision.left = true;
            p.body.checkCollision.right = true;
            return true;
        });

        return { platforms, movingPlatforms, collectibles, enemies, goal, windZones, bouncers, npcs };
    }

    private createFloor(group: Phaser.Physics.Arcade.StaticGroup, startX: number, endX: number, color: number, y: number = GAME_HEIGHT - 32) {
        for (let x = startX; x < endX; x += 32) {
            const p = group.create(x, y, 'pixel').setScale(32, 32).setTint(color).setOrigin(0, 0);
            p.refreshBody();
        }
    }

    private createPlatform(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, color: number) {
        const p = group.create(x, y, 'platform_96x32').setTint(color).refreshBody();
        p.body.checkCollision.up = true;
    }

    private createWindZone(scene: Phaser.Scene, windZones: any[], x: number, y: number, w: number, h: number, pushLeft: boolean = false) {
        const windZone = scene.add.rectangle(x, y, w, h, 0x00ff00, 0) as any;
        scene.physics.add.existing(windZone, true); // static
        windZone.setData('pushLeft', pushLeft);
        windZones.push(windZone);

        // Visual Effects
        scene.add.particles(0, 0, 'pixel', {
            x: { min: x - w / 2, max: x + w / 2 },
            y: { min: y - h / 2, max: y + h / 2 },
            quantity: 3,
            frequency: 40,
            angle: pushLeft ? 180 : -90, // Left or Up
            speedX: pushLeft ? { min: -500, max: -300 } : 0,
            speedY: pushLeft ? 0 : { min: -500, max: -300 },
            scaleX: { min: 20, max: 60 },
            scaleY: { min: 1, max: 2 },
            alpha: { min: 0.3, max: 0.6 },
            lifespan: 800,
            tint: 0xffffff
        });
    }

    private createLunaWind(scene: Phaser.Scene, group: Phaser.GameObjects.Group, x: number, y: number, flipX: boolean) {
        const luna = scene.add.image(x, y, 'luna');
        luna.setFlipX(flipX);
        group.add(luna);
    }
}
