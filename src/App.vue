<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GameWrapper from './components/GameWrapper.vue';
import MediaPlayer from './components/MediaPlayer.vue';

const currentView = ref<'game' | 'media'>('game');

onMounted(() => {
  // Simple routing based on URL path or hash
  const path = window.location.pathname;
  
  if (path.startsWith('/media')) {
    currentView.value = 'media';
  } else {
    currentView.value = 'game';
  }
});
</script>

<template>
  <div class="app-container">
    <main class="content">
      <GameWrapper v-if="currentView === 'game'" />
      <MediaPlayer v-else />
    </main>
  </div>
</template>

<style>
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a2332;
  color: #e8f4f8;
  overflow: hidden;
}

.content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Global resets that might affect Vue components */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #1a2332;
}
</style>
