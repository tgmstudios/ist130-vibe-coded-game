import { Game } from './game/Game';

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
  try {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const game = new Game(canvas);
    game.start();
  } catch (error) {
    console.error('Failed to initialize game:', error);
    // Show error message to user
    const container = document.getElementById('game-container');
    if (container) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: #e8f4f8; font-size: 18px; text-align: center; padding: 20px;">
          <div>
            <h2>Error loading game</h2>
            <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p style="font-size: 14px; margin-top: 10px;">Check the browser console for details.</p>
          </div>
        </div>
      `;
    }
  }
});

