# WinterTrek: Snowbound & Snuggles

A heartfelt 2D platformer web game about a penguin journeying through a harsh winter storm to reach his cat friend.

## Features

- **Mario-style platforming** with smooth jumping mechanics
- **Beautiful winter aesthetic** with soft cold blues, ice whites, and warm accents
- **Parallax scrolling backgrounds** with drifting snow effects
- **Collectible stars and hearts** scattered throughout the journey
- **Enemy snowballs** that patrol platforms (can be stomped!)
- **Heartfelt narrative** as you progress toward reuniting with your cat friend
- **Win condition** when you reach the cat at the end

## Controls

- **Arrow Keys / WASD**: Move left and right
- **Space / W / Up Arrow**: Jump

## Development

### Setup

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The game will open in your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Game Design

### Emotion & Vibe
- Determined, cozy-in-the-cold, adventurous, and heartfelt
- A blend of struggle against the storm and warmth from friends
- Soft, gentle, and wholesome, even when stakes feel high
- Hopeful and persistent as the penguin continues forward

### Color Palette
- Soft cold blues, ice whites, slate grays, pale lavender, and muted teals
- Occasional warm accents (lanterns, scarves, fires) to signal comfort
- Textures: powdery snow, subtle grain, soft-edged shadows, hazy storm overlays

### Architecture

The game is built with:
- **HTML5 Canvas** for rendering
- **TypeScript** for type safety
- **Vite** for fast development and building
- **ES Modules** for modern JavaScript
- **Modular architecture** with separate systems for:
  - Game loop and timing
  - Input management
  - Physics and collision detection
  - Rendering with camera system
  - Scene and level management
  - Entity system (Penguin, Enemies, Collectibles, etc.)

### Level Data

Levels are data-driven using JSON/TypeScript data structures. See `src/data/levels/level1.ts` for an example.

## Future Enhancements

- Sprite sheet animations for characters
- Sound effects and ambient music
- Multiple levels
- Checkpoint system
- More enemy types
- NPCs that offer hints and encouragement
- Particle effects for collectibles and impacts

