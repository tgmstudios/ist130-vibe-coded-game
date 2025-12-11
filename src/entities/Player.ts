import Phaser from 'phaser';
import { PlayerState } from '../types';
import { InputManager } from '../managers/InputManager';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private currentState: PlayerState = PlayerState.IDLE;
  private inputMgr: InputManager;
  
  // Physics Constants
  private readonly ACCELERATION = 800;
  private readonly DRAG = 1200; 
  private readonly AIR_DRAG = 400;
  private readonly MAX_SPEED = 200;
  private readonly JUMP_FORCE = -600;
  private readonly SLIDE_ACCEL = 400;
  private readonly SLIDE_DRAG = 100;
  // private readonly FLAP_FORCE = -50; // Force applied when flapping
  
  // Jump Mechanics
  private coyoteTimeCounter = 0;
  private readonly COYOTE_TIME = 150; // ms
  private jumpBufferCounter = 0;
  private readonly JUMP_BUFFER = 150; // ms
  private isJumping = false;
  // private canFlap = false;
  private isFlapping = false;

  // Idle Mechanics
  private idleTimer = 0;
  private readonly IDLE_SHIVER_TIME = 3000; // ms

  constructor(scene: Phaser.Scene, x: number, y: number, inputMgr: InputManager) {
    super(scene, x, y, 'pippin');
    this.inputMgr = inputMgr;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDrag(this.DRAG, 0);
    this.setMaxVelocity(this.MAX_SPEED, 800);
    
    // Hitbox adjustment
    // Increasing size for better playability.
    // Frame is 128x128. Character is bottom center.
    // Old: 24x40, offset 52x88.
    // New: 40x60 (Wider and Taller).
    // Offset X: (128 - 40) / 2 = 44.
    // Offset Y: 128 - 60 = 68.
    this.updateBodySize(40, 60); 
    this.updateBodyOffset(44, 68);
  }

  update(_time: number, delta: number) {
    // Timers
    if (this.body?.blocked.down) {
        this.coyoteTimeCounter = this.COYOTE_TIME;
        this.isJumping = false;
        // this.canFlap = false;
        this.isFlapping = false;
    } else {
        this.coyoteTimeCounter = Math.max(0, this.coyoteTimeCounter - delta);
    }

    if (this.inputMgr.jumpJustPressed) {
        this.jumpBufferCounter = this.JUMP_BUFFER;
    } else {
        this.jumpBufferCounter = Math.max(0, this.jumpBufferCounter - delta);
    }

    // State Logic
    this.handleMovement(delta);
    this.handleJump();
    this.updateState();
    this.playAnimation();
  }

  private handleMovement(delta: number) {
    const { left, right, slide } = this.inputMgr;
    const onGround = this.body!.blocked.down;

    // Sliding
    if (slide && onGround && Math.abs(this.body!.velocity.x) > 10) {
        this.setDragX(this.SLIDE_DRAG);
        
        if (this.currentState !== PlayerState.SLIDE) {
           // Enter slide
           // New normal: 40x60, offset 44x68.
           // Slide height: 30?
           // Feet at 68 + 60 = 128.
           // Slide Offset Y = 128 - 30 = 98.
           this.updateBodySize(40, 30);
           this.updateBodyOffset(44, 98);
        }

        if (left) this.setAccelerationX(-this.SLIDE_ACCEL * 0.5);
        else if (right) this.setAccelerationX(this.SLIDE_ACCEL * 0.5);
        else this.setAccelerationX(0);

    } else {
        // Normal movement
        if (this.currentState === PlayerState.SLIDE) {
             this.updateBodySize(40, 60);
             this.updateBodyOffset(44, 68);
        }

        this.setDragX(onGround ? this.DRAG : this.AIR_DRAG);

        if (left) {
            this.setAccelerationX(-this.ACCELERATION);
            this.setFlipX(false);
        } else if (right) {
            this.setAccelerationX(this.ACCELERATION);
            this.setFlipX(true);
        } else {
            this.setAccelerationX(0);
        }

        // Idle Timer
        if (this.body!.velocity.x === 0 && onGround) {
            this.idleTimer += delta;
        } else {
            this.idleTimer = 0;
        }
    }
  }

  private handleJump() {
     // Check Jump
    if (this.jumpBufferCounter > 0 && this.coyoteTimeCounter > 0) {
        this.jump();
    }
    
    // Variable Jump Height & Flap
    if (this.isJumping && !this.body!.blocked.down) {
        // Variable Height (Mario Style)
        if (!this.inputMgr.jumpHeld && this.body!.velocity.y < -100) {
             this.setVelocityY(this.body!.velocity.y * 0.9); // Cut velocity smoother
        }
        
        // Flap Mechanic (Flutter Jump)
        // Allow flap only on descent or near apex, and only if key held
        if (this.inputMgr.jumpHeld && this.body!.velocity.y > -50 && !this.isFlapping) {
             // Just a visual flutter or actual physics?
             // "hover at the apex"
             this.setVelocityY(this.body!.velocity.y - 10); // Counter gravity slightly
             this.isFlapping = true;
             // Only allow brief flap
        }
    }
  }

  private jump() {
      this.setVelocityY(this.JUMP_FORCE);
      this.isJumping = true;
      this.coyoteTimeCounter = 0;
      this.jumpBufferCounter = 0;
      this.isFlapping = false;
  }

  private updateState() {
    const onGround = this.body!.blocked.down;
    const velX = this.body!.velocity.x;
    const velY = this.body!.velocity.y;

    if (this.inputMgr.slide && onGround && Math.abs(velX) > 10) {
        this.currentState = PlayerState.SLIDE;
    } else if (!onGround) {
        if (velY < 0) this.currentState = PlayerState.JUMP;
        else this.currentState = PlayerState.FALL;
    } else {
        if (Math.abs(velX) > 10) this.currentState = PlayerState.RUN;
        else this.currentState = PlayerState.IDLE;
    }
  }

  private playAnimation() {
      let animKey = this.currentState.toLowerCase();

      // Shiver override
      if (this.currentState === PlayerState.IDLE && this.idleTimer > this.IDLE_SHIVER_TIME) {
          // Simulate shivering with a rotation tween
          if (!this.scene.tweens.isTweening(this)) {
              this.scene.tweens.add({
                  targets: this,
                  angle: { from: -2, to: 2 },
                  duration: 50,
                  yoyo: true,
                  repeat: 10,
                  onComplete: () => {
                      this.angle = 0; // Reset
                  }
              });
              this.idleTimer = 0; // Reset timer
          }
      }

      if (this.scene.anims.exists(animKey)) {
          this.play(animKey, true);
      }
  }

  // Helper for setting body size/offset
  private updateBodySize(w: number, h: number) {
      this.body?.setSize(w, h);
  }
  private updateBodyOffset(x: number, y: number) {
      this.body?.setOffset(x, y);
  }
}
