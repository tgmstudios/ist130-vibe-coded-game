<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createGame } from '../game/PhaserGame';

const gameContainer = ref<HTMLDivElement | null>(null);
const gameCanvas = ref<HTMLCanvasElement | null>(null);
let gameInstance: Phaser.Game | null = null;

onMounted(() => {
  if (gameCanvas.value) {
    gameInstance = createGame(gameCanvas.value);
  }
});

onBeforeUnmount(() => {
  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
  }
});
</script>

<template>
  <div ref="gameContainer" class="game-wrapper">
    <canvas ref="gameCanvas" id="game-canvas"></canvas>
  </div>
</template>

<style scoped>
.game-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}

canvas {
  display: block;
  /* Phaser handles sizing, but we ensure it doesn't overflow */
  max-width: 100%;
  max-height: 100%;
}
</style>

