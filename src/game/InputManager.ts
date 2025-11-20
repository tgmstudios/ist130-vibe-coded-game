export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private keysPrevious: Map<string, boolean> = new Map();
  private keysJustPressed: Set<string> = new Set();
  private jumpKeyBuffer: Set<string> = new Set(); // Buffer for jump keys that haven't been consumed

  constructor() {
    window.addEventListener('keydown', (e) => {
      // Prevent default for space and arrow keys to avoid scrolling
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }
      
      // If it's a jump key and wasn't already down, add to buffer
      if ((e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') && !this.keys.get(e.code)) {
        this.jumpKeyBuffer.add(e.code);
      }
      
      this.keys.set(e.code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
      this.jumpKeyBuffer.delete(e.code);
    });
  }

  public update(): void {
    // Detect keys that were just pressed this frame (transition from false to true)
    this.keysJustPressed.clear();
    this.keys.forEach((isDown, key) => {
      const wasDown = this.keysPrevious.get(key) === true;
      if (isDown && !wasDown) {
        this.keysJustPressed.add(key);
      }
    });
    
    // Update previous frame's state
    this.keysPrevious.clear();
    this.keys.forEach((isDown, key) => {
      this.keysPrevious.set(key, isDown);
    });
  }

  public isKeyDown(key: string): boolean {
    return this.keys.get(key) === true;
  }

  public isKeyPressed(key: string): boolean {
    // Check if key was just pressed this frame
    return this.keysJustPressed.has(key);
  }

  public getHorizontalAxis(): number {
    let axis = 0;
    if (this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA')) axis -= 1;
    if (this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD')) axis += 1;
    return axis;
  }

  public isJumpPressed(): boolean {
    // Check buffer first (most reliable)
    if (this.jumpKeyBuffer.size > 0) {
      return true;
    }
    // Fallback to frame-based detection
    return this.isKeyPressed('Space') || this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp');
  }

  public consumeJump(): void {
    // Clear the jump buffer after jump is executed
    this.jumpKeyBuffer.clear();
  }
}

