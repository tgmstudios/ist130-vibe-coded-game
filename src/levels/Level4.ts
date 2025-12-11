import Phaser from 'phaser';
import { ILevel, LevelObjects } from './ILevel';
import { GAME_HEIGHT } from '../types';

export class Level4 implements ILevel {
    public build(scene: Phaser.Scene): LevelObjects {
        const platforms = scene.physics.add.staticGroup();
        const movingPlatforms = scene.physics.add.group({ allowGravity: false, immovable: true });
        const collectibles = scene.physics.add.group({ allowGravity: false, immovable: true });
        const enemies = scene.physics.add.group();
        const bouncers = scene.physics.add.staticGroup();
        const npcs = scene.add.group();
        const windZones: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

        const tileColor = 0x444455; // Storm Grey
        
        // Physics Review:
        // Gravity: 1000
        // Jump Force: -600 -> Max Height ~180px
        // Wind: -5 (Global) -> Pushes Left
        // Jumping Right is harder. Max horizontal distance is reduced.
        // Platforms need to be closer together (Horizontal < 150px, Vertical < 120px)

        // --- Start Area ---
        this.createFloor(platforms, 0, 400, tileColor);

        // --- Bridge Remnants (400 - 1500) ---
        // Tight jumps against wind
        // P1: x550, y550 (Dist 150, Up ~138 from ground) - Doable
        this.createPlatform(platforms, 550, 550, tileColor); 
        
        // P2: x700, y500 (Dist 150, Up 50)
        this.createPlatform(platforms, 700, 500, tileColor);

        // P3: x900, y500 (Dist 200 - might be hard with wind. Add helper)
        this.createPlatform(platforms, 850, 550, tileColor); // Helper low
        this.createPlatform(platforms, 1000, 450, tileColor); // Target high

        // Descent to safe ground
        this.createPlatform(platforms, 1200, 550, tileColor);
        this.createFloor(platforms, 1300, 1800, tileColor); // Safe Zone 1

        // --- Moving Platform Gap (1800 - 2400) ---
        // Pushing wind makes waiting for platform tricky if you jump too early.
        // Moving Platform 1
        const p1 = movingPlatforms.create(1900, 550, 'platform_96x32').setTint(tileColor);
        // Moving Platform 2
        const p2 = movingPlatforms.create(2150, 500, 'platform_96x32').setTint(tileColor);
        
        [p1, p2].forEach(p => {
            p.setImmovable(true);
            p.body.checkCollision.up = true;
            p.body.checkCollision.down = true;
            p.body.checkCollision.left = true;
            p.body.checkCollision.right = true;
            
            // Slower movement for fairness against wind
            scene.tweens.add({
                targets: p,
                x: p.x + 80, // Shorter range
                duration: 2500, // Slower
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Safe Zone 2
        this.createFloor(platforms, 2400, 2800, tileColor);

        // --- The High Ridge (2800 - 4000) ---
        // Climb up
        this.createPlatform(platforms, 2900, 550, tileColor);
        this.createPlatform(platforms, 3050, 450, tileColor);
        this.createPlatform(platforms, 3200, 350, tileColor);
        
        // Long high traverse
        this.createPlatform(platforms, 3400, 350, tileColor);
        this.createPlatform(platforms, 3600, 350, tileColor);
        this.createPlatform(platforms, 3800, 450, tileColor); // Down

        // --- Final Stretch ---
        this.createFloor(platforms, 4000, 4500, tileColor);

        // --- Collectibles ---
        collectibles.create(1000, 400, 'fish').setScale(0.1);
        collectibles.create(2000, 450, 'fish').setScale(0.1); // On moving path
        collectibles.create(3400, 300, 'fish').setScale(0.1); // High ridge

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
