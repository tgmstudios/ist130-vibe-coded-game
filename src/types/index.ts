export enum PlayerState {
  IDLE = 'IDLE',
  RUN = 'RUN',
  JUMP = 'JUMP',
  FALL = 'FALL',
  SLIDE = 'SLIDE'
}

export interface LevelConfig {
  id: number;
  name: string;
  background: string;
  music: string;
  physics?: {
    friction?: number;
    windX?: number;
    gravityY?: number;
  };
  mechanics?: {
    hasMist?: boolean;
    isDark?: boolean;
    hasWindZones?: boolean;
    hasFallingIcicles?: boolean;
  };
  startPosition: { x: number; y: number };
  goalPosition?: { x: number; y: number };
  tilemap?: string; 
}

export interface EntityConfig {
  x: number;
  y: number;
  texture: string;
  frame?: number | string;
}

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

