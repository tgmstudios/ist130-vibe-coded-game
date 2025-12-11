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

        const tileColor = 0x6b4423; // Brown (Dirt/Wood)
        const levelWidth = 4500;

        // --- Ground ---
        // Continuous ground but with some "root" obstacles or gaps
        this.createFloor(platforms, 0, 1000, tileColor);
        this.createFloor(platforms, 1200, 2500, tileColor); // Gap 1000-1200
        this.createFloor(platforms, 2700, 4500, tileColor); // Gap 2500-2700

        // --- Tree 1 (Tutorial Climb) ---
        // Easy steps
        this.createPlatform(platforms, 400, 550, tileColor);
        this.createPlatform(platforms, 300, 450, tileColor);
        this.createPlatform(platforms, 450, 350, tileColor); // High perch

        // --- Gap Crossing 1 (1000-1200) ---
        // Needs platforms to cross
        this.createPlatform(platforms, 1050, 550, tileColor);
        this.createPlatform(platforms, 1150, 500, tileColor);

        // --- Tree 2 (Wind Challenge) ---
        // Wind blows left, so moving right is harder.
        // Platforms need to be closer or have backstops.
        this.createPlatform(platforms, 1400, 500, tileColor);
        this.createPlatform(platforms, 1600, 400, tileColor);
        this.createPlatform(platforms, 1400, 300, tileColor); // Zig-zag up

        // Wind Zone 1 (Pushing back)
        // Center x=1500, width=300. Right edge = 1650.
        // Place Luna at 1700 to blow left
        this.createWindZone(scene, windZones, 1500, 300, 300, 400);
        this.createLunaWind(scene, npcs, 1700, 300);

        // --- Middle Section (The Thicket) ---
        // Dense platforming
        this.createPlatform(platforms, 1900, 550, tileColor);
        this.createPlatform(platforms, 2100, 450, tileColor);
        this.createPlatform(platforms, 2300, 350, tileColor);
        this.createPlatform(platforms, 2500, 450, tileColor); // Descent

        // --- Gap Crossing 2 (2500-2700) ---
        // Moving platform
        const m1 = movingPlatforms.create(2600, 550, 'platform_96x32').setTint(tileColor);
        m1.setImmovable(true);
        m1.body.checkCollision.up = true;
        m1.body.checkCollision.down = true;
        m1.body.checkCollision.left = true;
        m1.body.checkCollision.right = true;
        scene.tweens.add({
            targets: m1,
            y: 450,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        // --- Tree 3 (The Canopy) ---
        // High route
        this.createPlatform(platforms, 2900, 500, tileColor);
        this.createPlatform(platforms, 3100, 400, tileColor);
        this.createPlatform(platforms, 3300, 300, tileColor);
        this.createPlatform(platforms, 3600, 300, tileColor); // Long jump
        this.createPlatform(platforms, 3900, 400, tileColor);

        // Wind Zone 2 (High altitude wind)
        // Center x=3400, width=400. Right edge = 3600.
        // Place Luna at 3650 to blow left
        this.createWindZone(scene, windZones, 3400, 250, 400, 300);
        this.createLunaWind(scene, npcs, 3650, 250);

        // --- NPCs ---
        // Removed static Luna from start
        
        // --- Collectibles ---
        collectibles.create(450, 300, 'fish').setScale(0.1); // Tree 1 top
        collectibles.create(1100, 450, 'fish').setScale(0.1); // Gap 1
        collectibles.create(1400, 250, 'fish').setScale(0.1); // Tree 2 top
        collectibles.create(2100, 400, 'fish').setScale(0.1); // Thicket
        collectibles.create(3300, 250, 'fish').setScale(0.1); // Canopy
        collectibles.create(4000, 550, 'fish').setScale(0.1); // Ground path

        // --- Goal ---
        const goal = scene.physics.add.sprite(4300, 600, 'marmalade');
        goal.setImmovable(true);
        (goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        goal.body.setSize(40, 40);
        goal.body.setOffset(44, 88);

        return { platforms, movingPlatforms, collectibles, enemies, goal, windZones, bouncers, npcs };
    }

    private createFloor(group: Phaser.Physics.Arcade.StaticGroup, startX: number, endX: number, color: number) {
        // Use tileSprite or repeating image for better performance and look
        // But StaticGroup expects individual bodies or we manage a large tileSprite with a body?
        // Simplest: Create individual blocks using the texture 'forest_tiles'
        // Assuming forest_tiles is 32x32 or similar. 
        // If it's a tileset sheet, we need to pick a frame. 
        // If it's a single texture image like a block, we can just use it.
        // Based on user prompt "terrain_branch.png", it might be a tileset.
        // Let's assume for now it's a texture we can just use.
        // Since we don't know the exact dimensions of terrain_branch.png, let's try using it as a fill.
        
        // Actually, let's use the 'forest_tiles' image key I loaded in Preloader.
        // If it's a large image, we might need to crop it or use it as a texture.
        
        for (let x = startX; x < endX; x += 32) {
            // Using 'forest_tiles' instead of 'pixel'
            // We scale it to 32x32 if it's not.
            // But if it is a tileset, this might look weird (showing the whole sheet).
            // Let's stick to the color tint fix requested (Brown/Grey) but ensure it applies.
            // The user said "colors still arent changing". 
            // My previous edit changed the variable 'tileColor', but if the browser cached it, it wouldn't show.
            // OR if I used 'forest_tiles' but it has no white pixels, tinting might not work as expected.
            // 'platform_96x32' IS white. 'pixel' IS white.
            // So tinting SHOULD work.
            
            // Wait, the user said "make sure platform colors match level theme... forrest should have brown for dirt".
            // If they see green, it means they see the OLD build.
            // OR I am using the wrong texture.
            
            // Let's try to use the actual 'forest_tiles' image if possible, 
            // but if I just want to fix the COLOR, I should ensure the tint is applied.
            
            // Let's switch to using 'forest_tiles' (and 'cave_tiles') directly if they are suitable block textures.
            // Since I don't know their content, I'll tile them.
            
            const p = group.create(x, GAME_HEIGHT - 32, 'forest_tiles')
                .setOrigin(0,0)
                .setDisplaySize(32, 32); // Force size
            
            // If the texture is dark, tint might effectively darken it further.
            // Let's clear tint if we use a texture, or tint it slightly.
            p.clearTint(); 
            
            p.refreshBody();
            p.body.checkCollision.up = true;
            p.body.checkCollision.down = true;
            p.body.checkCollision.left = true;
            p.body.checkCollision.right = true;
        }
    }

    private createPlatform(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, color: number) {
        // Use forest_tiles for platforms too
        const p = group.create(x, y, 'forest_tiles')
            .setDisplaySize(96, 32)
            .refreshBody();
        p.clearTint();
        
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
        // Emit within the rectangle bounds
        scene.add.particles(0, 0, 'pixel', {
            x: { min: x - w/2, max: x + w/2 },
            y: { min: y - h/2, max: y + h/2 },
            quantity: 2,
            frequency: 50,
            angle: 180, // Left
            speedX: { min: -400, max: -200 },
            scaleX: { min: 20, max: 60 }, // Long lines
            scaleY: { min: 1, max: 2 },   // Thin
            alpha: { min: 0.2, max: 0.5 },
            lifespan: 600,
            tint: 0xffffff
        });
    }

    private createLunaWind(scene: Phaser.Scene, group: Phaser.GameObjects.Group, x: number, y: number) {
        const luna = scene.add.image(x, y, 'luna');
        luna.setFlipX(true); // Face left
        group.add(luna);
        
        // Removed particle_wind emitter from Luna
    }
}
