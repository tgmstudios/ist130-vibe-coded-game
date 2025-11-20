import { InputManager } from './InputManager';
import { Scene } from './Scene';
import { Renderer } from './Renderer';
import { GameLoop } from './GameLoop';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: Renderer;
  private inputManager: InputManager;
  private scene: Scene;
  private gameLoop: GameLoop;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D rendering context');
    }
    this.ctx = context;

    // Initialize renderer first with viewport dimensions
    const initialWidth = window.innerWidth || 800;
    const initialHeight = window.innerHeight || 600;
    this.renderer = new Renderer(this.ctx, initialWidth, initialHeight);

    // Set up canvas size with device pixel ratio support
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Initialize systems
    this.inputManager = new InputManager();
    this.scene = new Scene(this.inputManager);
    
    // Set up game loop
    this.gameLoop = new GameLoop((deltaTime: number) => {
      this.update(deltaTime);
      this.draw();
    });
  }

  private resizeCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    // Ensure we have valid dimensions
    const displayWidth = rect.width || window.innerWidth || 800;
    const displayHeight = rect.height || window.innerHeight || 600;
    
    // Set display size
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;
    
    // Set actual size in memory (scaled for DPR)
    const width = displayWidth * dpr;
    const height = displayHeight * dpr;
    
    // Only resize if dimensions changed to avoid unnecessary context resets
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      
      // Reset transform and scale context to handle DPR
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }
    
    // Update renderer dimensions (in logical pixels)
    this.renderer.setDimensions(displayWidth, displayHeight);
  }

  private update(deltaTime: number): void {
    this.inputManager.update();
    this.scene.update(deltaTime, this.renderer.getWidth(), this.renderer.getHeight());
  }

  private draw(): void {
    // Clear canvas with winter sky gradient
    this.renderer.clear();
    this.scene.draw(this.renderer);
  }

  public start(): void {
    this.gameLoop.start();
  }

  public stop(): void {
    this.gameLoop.stop();
  }
}

