export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private keysPressed: Map<string, boolean> = new Map();
  private keysJustPressed: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', (e) => {
      // Prevent default for space and arrow keys to avoid scrolling
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }
      
      // Track if this is a new key press (wasn't already down)
      if (!this.keys.get(e.code)) {
        this.keysJustPressed.add(e.code);
      }
      this.keys.set(e.code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
      this.keysJustPressed.delete(e.code);
    });
  }

  public update(): void {
    // Clear previous frame's pressed keys
    this.keysPressed.clear();
    
    // Copy just-pressed keys to the pressed map for this frame
    const keysToProcess = new Set(this.keysJustPressed);
    keysToProcess.forEach(key => {
      this.keysPressed.set(key, true);
    });
    
    // Clear just-pressed set for next frame
    // (they're now in keysPressed, and new keydowns will repopulate keysJustPressed)
    this.keysJustPressed.clear();
  }

  public isKeyDown(key: string): boolean {
    return this.keys.get(key) === true;
  }

  public isKeyPressed(key: string): boolean {
    // Check both the pressed map (from previous frame) and just-pressed set (this frame)
    return this.keysPressed.get(key) === true || this.keysJustPressed.has(key);
  }

  public getHorizontalAxis(): number {
    let axis = 0;
    if (this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA')) axis -= 1;
    if (this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD')) axis += 1;
    return axis;
  }

  public isJumpPressed(): boolean {
    return this.isKeyPressed('Space') || this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp');
  }
}

