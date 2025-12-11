import Phaser from 'phaser';
import { ILevel, LevelObjects } from './ILevel';
import { GAME_HEIGHT } from '../types';

export class Level3 implements ILevel {
    public build(scene: Phaser.Scene): LevelObjects {
        const platforms = scene.physics.add.staticGroup();
        const movingPlatforms = scene.physics.add.group({ allowGravity: false, immovable: true });
        const collectibles = scene.physics.add.group({ allowGravity: false, immovable: true });
        const enemies = scene.physics.add.group();
        const bouncers = scene.physics.add.staticGroup();
        const npcs = scene.add.group();
        const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

        const tileColor = 0x808080; // Rock Grey
        const levelWidth = 5500;

        // --- Ground ---
        this.createFloor(platforms, 0, 1500, tileColor);
        this.createFloor(platforms, 1700, 3000, tileColor); // Gap 1500-1700
        this.createFloor(platforms, 3200, 5500, tileColor); // Gap 3000-3200

        // --- Section 1: The Entrance (0-1500) ---
        // Simple jumps to warm up
        this.createPlatform(platforms, 400, 550, tileColor);
        this.createPlatform(platforms, 600, 450, tileColor);
        this.createPlatform(platforms, 800, 550, tileColor);

        // Tunnel Start
        // Ceiling blocks to force path
        for (let x = 1000; x < 1400; x += 32) {
             const p = platforms.create(x, 500, 'platform_96x32').setTint(tileColor).setScale(0.5, 1).refreshBody(); // Half width blocks
             p.body.checkCollision.down = true; // Only collide bottom so you hit your head
        }
        
        // --- Section 2: The Deep Drop (1500-1700) ---
        // Gap with platforms low down
        this.createPlatform(platforms, 1600, 600, tileColor); // Low safe spot

        // --- Section 3: The Crystal Bridges (1700-3000) ---
        // Upper route vs Lower route
        // Lower
        this.createPlatform(platforms, 1900, 600, tileColor);
        this.createPlatform(platforms, 2100, 600, tileColor);
        
        // Upper
        this.createPlatform(platforms, 1800, 450, tileColor);
        this.createPlatform(platforms, 2000, 350, tileColor);
        this.createPlatform(platforms, 2200, 450, tileColor);

        // Convergence
        this.createPlatform(platforms, 2500, 500, tileColor);
        
        // Slide Tunnel (2600-2900)
        // Platform at 600 height (Ground 688). Gap 88px. Player 60px.
        // Let's make it tighter: 640 height. Gap 48px. Slide required (30px).
        for(let x = 2600; x < 2900; x+=96) {
             const p = platforms.create(x, 640, 'platform_96x32').setTint(tileColor).refreshBody();
             p.body.checkCollision.down = true;
        }

        // --- Section 4: The Ascent (3000-4000) ---
        // Climbing up out of the deep
        this.createPlatform(platforms, 3300, 500, tileColor);
        this.createPlatform(platforms, 3500, 400, tileColor);
        this.createPlatform(platforms, 3700, 300, tileColor); // Peak

        // Collectible at peak
        collectibles.create(3700, 250, 'ember').setScale(0.2);

        // --- Section 5: The Stalactite Field (4000-5000) ---
        // Platforms with obstacles overhead
        this.createPlatform(platforms, 4000, 500, tileColor);
        this.createPlatform(platforms, 4200, 500, tileColor);
        this.createPlatform(platforms, 4400, 500, tileColor);
        
        // "Stalactites" (Platforms high up acting as obstacles or scenery)
        this.createPlatform(platforms, 4100, 300, tileColor);
        this.createPlatform(platforms, 4300, 300, tileColor);

        // --- Collectibles (Embers) ---
        // Light radius extenders
        collectibles.create(500, 500, 'ember').setScale(0.2);
        collectibles.create(1200, 650, 'ember').setScale(0.2); // Under tunnel
        collectibles.create(1900, 550, 'ember').setScale(0.2); // Lower path
        collectibles.create(2000, 300, 'ember').setScale(0.2); // Upper path
        collectibles.create(2750, 680, 'ember').setScale(0.2); // In slide tunnel
        collectibles.create(4500, 450, 'ember').setScale(0.2);

        // Narrative Mitten
        const mitten = collectibles.create(4800, 600, 'ember').setScale(0.2).setTint(0xff0000);
        mitten.setData('type', 'mitten');

        // Fish
        collectibles.create(1100, 650, 'fish').setScale(0.1);
        collectibles.create(2200, 400, 'fish').setScale(0.1);
        collectibles.create(3500, 350, 'fish').setScale(0.1);

        // --- Goal ---
        const goal = scene.physics.add.sprite(5200, 600, 'marmalade');
        goal.setImmovable(true);
        (goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        goal.body.setSize(40, 40);
        goal.body.setOffset(44, 88);

        return { platforms, movingPlatforms, collectibles, enemies, goal, windZones, bouncers, npcs };
    }

    private createFloor(group: Phaser.Physics.Arcade.StaticGroup, startX: number, endX: number, color: number) {
        for (let x = startX; x < endX; x += 32) {
            const p = group.create(x, GAME_HEIGHT - 32, 'cave_tiles')
                .setOrigin(0,0)
                .setDisplaySize(32, 32);
            p.clearTint();
            p.refreshBody();
        }
    }

    private createPlatform(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, color: number) {
        const p = group.create(x, y, 'cave_tiles')
            .setDisplaySize(96, 32)
            .refreshBody();
        p.clearTint();
        
        p.body.checkCollision.up = true;
        p.body.checkCollision.down = true;
        p.body.checkCollision.left = true;
        p.body.checkCollision.right = true;
    }
}
