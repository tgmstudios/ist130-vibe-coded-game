export class GameLoop {
  private callback: (deltaTime: number) => void;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor(callback: (deltaTime: number) => void) {
    this.callback = callback;
  }

  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    const deltaTime = this.lastTime === 0 ? 0 : (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Cap delta time to prevent large jumps
    const cappedDelta = Math.min(deltaTime, 0.1);

    this.callback(cappedDelta);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = 0;
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

