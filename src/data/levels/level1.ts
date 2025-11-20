import { LevelData } from '../../game/Level';

export const level1Data: LevelData = {
  width: 2000,
  height: 800,
  startPosition: { x: 100, y: 600 },
  platforms: [
    // Starting platform
    { x: 0, y: 700, width: 200, height: 20 },
    // First jump
    { x: 250, y: 650, width: 150, height: 20 },
    // Second jump
    { x: 450, y: 600, width: 150, height: 20 },
    // Third jump
    { x: 650, y: 550, width: 150, height: 20 },
    // Ground platform
    { x: 850, y: 700, width: 200, height: 20 },
    // Higher platform (adjusted to be reachable from ground platform)
    { x: 1100, y: 620, width: 150, height: 20 },
    // Lower platform
    { x: 1300, y: 650, width: 150, height: 20 },
    // Final platform
    { x: 1500, y: 600, width: 200, height: 20 },
    // End platform (where cat friend waits)
    { x: 1800, y: 700, width: 200, height: 20 },
  ],
  collectibles: [
    // Stars along the path
    { x: 300, y: 600, type: 'star' },
    { x: 500, y: 550, type: 'star' },
    { x: 700, y: 500, type: 'star' },
    { x: 1150, y: 570, type: 'star' },
    { x: 1350, y: 600, type: 'star' },
    { x: 1550, y: 550, type: 'star' },
    // Hearts for encouragement
    { x: 900, y: 650, type: 'heart' },
    { x: 1850, y: 650, type: 'heart' },
  ],
  enemies: [
    // Snowball enemies patrolling platforms
    { x: 600, y: 520, patrolDistance: 80 },
    { x: 1200, y: 590, patrolDistance: 100 },
    { x: 1400, y: 620, patrolDistance: 80 },
  ],
  catPosition: { x: 1850, y: 650 }
};

