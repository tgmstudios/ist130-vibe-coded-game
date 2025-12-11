import Phaser from 'phaser';
import { ILevel, LevelObjects } from './ILevel';
import { GAME_HEIGHT } from '../types';

export class Level5 implements ILevel {
    public build(scene: Phaser.Scene): LevelObjects {
        const platforms = scene.physics.add.staticGroup();
        const movingPlatforms = scene.physics.add.group({ allowGravity: false, immovable: true });
        const collectibles = scene.physics.add.group({ allowGravity: false, immovable: true });
        const enemies = scene.physics.add.group();
        const bouncers = scene.physics.add.staticGroup();
        const npcs = scene.add.group();
        const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

        const tileColor = 0x8B4513; // Wood (Interior)
        const exteriorColor = 0x444455; // Stone (Exterior Base)

        // --- Ground (The Approach) ---
        // Snow leading up to the door
        this.createFloor(platforms, 0, 800, 0xaaddff); // Ice/Snow color

        // --- The Lighthouse Structure ---
        // Tower Width: ~400px (800 to 1200)
        // We will build "Walls" using vertical blocks
        
        const towerLeft = 800;
        const towerRight = 1200;
        const towerBottom = GAME_HEIGHT - 32;
        const towerTop = 100;

        // Base Foundation
        this.createPlatform(platforms, 800, towerBottom - 32, exteriorColor);
        this.createPlatform(platforms, 900, towerBottom - 32, exteriorColor);
        this.createPlatform(platforms, 1000, towerBottom - 32, exteriorColor);
        this.createPlatform(platforms, 1100, towerBottom - 32, exteriorColor);

        // Walls (Left and Right)
        // Building up from bottom to top
        for (let y = towerBottom - 64; y > towerTop; y -= 32) {
             // Left Wall
             const l = platforms.create(towerLeft, y, 'pixel').setScale(32, 32).setTint(exteriorColor).setOrigin(0,0).refreshBody();
             l.body.checkCollision.right = true; // Inner face
             
             // Right Wall
             const r = platforms.create(towerRight, y, 'pixel').setScale(32, 32).setTint(exteriorColor).setOrigin(0,0).refreshBody();
             r.body.checkCollision.left = true; // Inner face
        }

        // --- Interior Platforms (The Climb) ---
        // Zig-zagging up
        // Level 1: 600
        this.createPlatform(platforms, 900, 600, tileColor);
        
        // Level 2: 500 (Right side)
        this.createPlatform(platforms, 1050, 500, tileColor);
        
        // Level 3: 400 (Left side)
        this.createPlatform(platforms, 900, 400, tileColor);

        // Level 4: 300 (Center split)
        this.createPlatform(platforms, 950, 300, tileColor); // Small step
        this.createPlatform(platforms, 1100, 250, tileColor); // High step

        // Level 5: 150 (Top Deck Floor)
        // Spanning the width
        this.createPlatform(platforms, 850, 150, tileColor);
        this.createPlatform(platforms, 950, 150, tileColor);
        this.createPlatform(platforms, 1050, 150, tileColor);

        // --- Collectibles ---
        collectibles.create(900, 550, 'fish').setScale(0.1);
        collectibles.create(1100, 350, 'fish').setScale(0.1);
        collectibles.create(1000, 200, 'fish').setScale(0.1);

        // --- Goal (Marmalade) ---
        // Sitting on the top deck
        const goal = scene.physics.add.sprite(1000, 110, 'marmalade');
        goal.setImmovable(true);
        (goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        goal.body.setSize(40, 40);
        goal.body.setOffset(44, 88);

        // --- Ambience ---
        // Add the "Lamp" glow at the top?
        // (Handled by scene mechanics if needed, but we can add a simple sprite/tint)
        
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
}
