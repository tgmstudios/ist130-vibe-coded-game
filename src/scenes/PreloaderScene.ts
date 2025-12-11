import Phaser from 'phaser';

// Import assets
import pippinAtlas from '../assets/character_pippin/texture.json?url';
import pippinTexture from '../assets/character_pippin/texture.png';
import marmaladeAtlas from '../assets/character_marmalade/texture.json?url';
import marmaladeTexture from '../assets/character_marmalade/texture.png';
import barnabyImg from '../assets/character_barnaby.png';
import lunaImg from '../assets/character_luna.png';

import iceTilesImg from '../assets/terrain_icy.png';
import forestTilesImg from '../assets/terrain_branch.png';
import caveTilesImg from '../assets/terrain_rock.png';

import bgOcean from '../assets/background_ocean.png';
import bgForest from '../assets/background_forrest.png';
import bgStorm from '../assets/background_storm.png';

import musicFloes from '../assets/level_1_track_1_winters_whisper.mp3';
import musicMenu from '../assets/level_1_track_2_winters_whisper.mp3';
import musicWoods from '../assets/level_2_track_1_whispered_in_the_pines.mp3';
import musicCave from '../assets/level_3_track_1_echoes_in_the_hollow.mp3';
import musicStorm from '../assets/level_4_track_1_stormrunner.mp3';
import musicEnding from '../assets/level_5_track_1_by_the_fireside.mp3';

import snowParticle from '../assets/particle_snow.png';
import windParticle from '../assets/particle_wind.png';
import emberImg from '../assets/collectable_ember.png';
import fishImg from '../assets/collectable_fish.png';
import lighthouseImg from '../assets/ui_lighthouse.png';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload() {
    // Sprites
    this.load.atlas('pippin', pippinTexture, pippinAtlas);
    this.load.atlas('marmalade', marmaladeTexture, marmaladeAtlas);
    this.load.image('barnaby', barnabyImg);
    this.load.image('luna', lunaImg);

    // Tiles
    this.load.image('ice_tiles', iceTilesImg);
    this.load.image('forest_tiles', forestTilesImg);
    this.load.image('cave_tiles', caveTilesImg);

    // Backgrounds
    this.load.image('bg_ocean', bgOcean);
    this.load.image('bg_forest', bgForest);
    this.load.image('bg_cave', bgStorm); // Placeholder
    this.load.image('bg_storm', bgStorm);

    // Audio
    this.load.audio('music_floes', musicFloes);
    this.load.audio('music_menu', musicMenu);
    this.load.audio('music_woods', musicWoods);
    this.load.audio('music_cave', musicCave);
    this.load.audio('music_storm', musicStorm);
    this.load.audio('music_ending', musicEnding);

    // Particles/Collectibles
    this.load.image('particle_snow', snowParticle);
    this.load.image('particle_wind', windParticle);
    this.load.image('ember', emberImg);
    this.load.image('fish', fishImg);
    this.load.image('lighthouse', lighthouseImg);
  }

  create() {
    // Create 1x1 white pixel for placeholders
    if (!this.textures.exists('pixel')) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false } as any);
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 1, 1);
        graphics.generateTexture('pixel', 1, 1);
    }

    // Create 96x32 platform texture for moving platforms
    if (!this.textures.exists('platform_96x32')) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false } as any);
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 96, 32);
        graphics.generateTexture('platform_96x32', 96, 32);
    }

    // --- Procedural Pattern Textures ---
    // Forest Wood Pattern (Brown Stripes)
    if (!this.textures.exists('pattern_wood')) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false } as any);
        // Base
        graphics.fillStyle(0x8B4513); // SaddleBrown
        graphics.fillRect(0, 0, 32, 32);
        // Grain
        graphics.lineStyle(2, 0x654321); // Darker Brown
        graphics.beginPath();
        graphics.moveTo(0, 10);
        graphics.lineTo(32, 10);
        graphics.moveTo(0, 20);
        graphics.lineTo(32, 20);
        graphics.strokePath();
        graphics.generateTexture('pattern_wood', 32, 32);
    }

    // Cave Rock Pattern (Grey Stone)
    if (!this.textures.exists('pattern_rock')) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false } as any);
        // Base
        graphics.fillStyle(0x808080); // Grey
        graphics.fillRect(0, 0, 32, 32);
        // Cracks/Texture
        graphics.fillStyle(0x606060); // Darker Grey
        graphics.fillRect(5, 5, 10, 10);
        graphics.fillRect(18, 18, 8, 8);
        graphics.fillRect(20, 5, 5, 5);
        graphics.generateTexture('pattern_rock', 32, 32);
    }

    this.createAnimations();
    // LoadingScene will handle the transition to MenuScene when assets are loaded
  }

  private createAnimations() {
    // Pippin animations (using Atlas)
    // Assuming keys in JSON are something like 'pippin-idle-0', 'pippin-run-0', etc.
    // Adjust prefix based on actual JSON content.
    // If we don't know exact frame names, we can try to guess or just use what's available.
    // Based on file listing (1.png, 2.png...), the atlas likely generated frame names like '1', '2'.
    // Let's assume standard names or generic frame generation if needed.
    
    // NOTE: Since I cannot see inside the JSON, I will assume frame names are '1', '2', '3', '4', '5'.
    
    if (!this.anims.exists('idle')) {
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'pippin', frame: '1' }], // Standing
            frameRate: 4,
            repeat: -1
        });
    }

    if (!this.anims.exists('run')) {
        this.anims.create({
            key: 'run',
            frames: [{ key: 'pippin', frame: '2' }], // Running/Walking (just one frame?) - if single frame, just display it. 
            // If the user said "2 is running/walking", usually implies a loop, but if there's only one frame "2", we just use that.
            // If they meant 2, 3, etc., but listed distinct states per number, likely static poses.
            // "1 is standing. 2 is running/walking, 3 is jumping, 4 is falling, 5 is laying down" implies single frames per state.
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.anims.exists('jump')) {
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'pippin', frame: '3' }], // 3 is jumping
            frameRate: 10,
            repeat: 0
        });
    }

    if (!this.anims.exists('fall')) {
        this.anims.create({
            key: 'fall',
            frames: [{ key: 'pippin', frame: '4' }], // 4 is falling
            frameRate: 10,
            repeat: 0
        });
    }
    
    if (!this.anims.exists('slide')) {
        this.anims.create({
            key: 'slide',
            frames: [{ key: 'pippin', frame: '5' }], // 5 is laying down (slide)
            frameRate: 10,
            repeat: 0
        });
    }

    // Marmalade animations
    if (!this.anims.exists('marmalade-idle')) {
        this.anims.create({
            key: 'marmalade-idle',
            frames: [{ key: 'marmalade', frame: '1' }], // 1 is sitting
            frameRate: 4,
            repeat: -1
        });
    }
    
    if (!this.anims.exists('marmalade-sleep')) {
        this.anims.create({
            key: 'marmalade-sleep',
            frames: [{ key: 'marmalade', frame: '2' }], // 2 is sleeping
            frameRate: 4,
            repeat: -1
        });
    }

    if (!this.anims.exists('marmalade-window')) {
        this.anims.create({
            key: 'marmalade-window',
            frames: [{ key: 'marmalade', frame: '3' }], // 3 is sitting on window
            frameRate: 4,
            repeat: -1
        });
    }
  }
}
