<script setup lang="ts">
import { ref, computed } from 'vue';

// Define asset types
type AssetType = 'image' | 'audio' | 'unknown';

interface Asset {
  path: string;
  name: string;
  url: string;
  type: AssetType;
}

// Load assets
// We use a relative path from this component to the assets directory
const assetModules = import.meta.glob('../assets/*.*', { eager: true });

const assets: Asset[] = Object.entries(assetModules).map(([path, mod]) => {
  // path is like "../assets/filename.ext"
  const filename = path.split('/').pop() || '';
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Format name: remove extension, replace underscores/hyphens with spaces, title case
  const name = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  let type: AssetType = 'unknown';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) type = 'image';
  if (['mp3', 'wav', 'ogg'].includes(extension)) type = 'audio';

  return {
    path,
    name,
    url: (mod as any).default,
    type
  };
});

const filter = ref<'all' | 'audio' | 'image'>('all');
const selectedAsset = ref<Asset | null>(null);

const filteredAssets = computed(() => {
  if (filter.value === 'all') return assets;
  return assets.filter(a => a.type === filter.value);
});

const selectAsset = (asset: Asset) => {
  selectedAsset.value = asset;
};

// Audio player specific logic
const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const onTimeUpdate = () => {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime;
  }
};

const onLoadedMetadata = () => {
  if (audioPlayer.value) {
    duration.value = audioPlayer.value.duration;
  }
};

const onEnded = () => {
  isPlaying.value = false;
  // Auto-play next audio if applicable? 
  // Let's keep it simple for now, or maybe play next in list.
  playNext();
};

const togglePlay = () => {
  if (!audioPlayer.value) return;
  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const playNext = () => {
  const currentList = filteredAssets.value.filter(a => a.type === 'audio');
  const idx = currentList.findIndex(a => a.url === selectedAsset.value?.url);
  if (idx !== -1 && idx < currentList.length - 1) {
    selectAsset(currentList[idx + 1]);
    // Allow DOM update then play
    setTimeout(() => audioPlayer.value?.play(), 100);
    isPlaying.value = true;
  }
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const seek = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = parseFloat(input.value);
  }
};

</script>

<template>
  <div class="media-player">
    <div class="sidebar">
      <div class="filters">
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
        <button :class="{ active: filter === 'audio' }" @click="filter = 'audio'">Audio</button>
        <button :class="{ active: filter === 'image' }" @click="filter = 'image'">Images</button>
      </div>
      <div class="asset-list">
        <div 
          v-for="asset in filteredAssets" 
          :key="asset.path"
          class="asset-item"
          :class="{ active: selectedAsset?.path === asset.path }"
          @click="selectAsset(asset)"
        >
          <span class="icon">{{ asset.type === 'audio' ? '🎵' : '🖼️' }}</span>
          <span class="name">{{ asset.name }}</span>
        </div>
      </div>
    </div>

    <div class="preview-area">
      <div v-if="!selectedAsset" class="empty-state">
        <p>Select an asset to preview</p>
        <div v-if="filter === 'image' || filter === 'all'" class="gallery-preview">
             <h3>Gallery Overview</h3>
             <div class="gallery-grid">
                <div 
                  v-for="asset in assets.filter(a => a.type === 'image')" 
                  :key="asset.path"
                  class="gallery-item"
                  @click="selectAsset(asset)"
                >
                  <img :src="asset.url" :alt="asset.name" loading="lazy" />
                  <span class="gallery-name">{{ asset.name }}</span>
                </div>
             </div>
        </div>
      </div>

      <div v-else class="content-viewer">
        <h2>{{ selectedAsset.name }}</h2>
        
        <div v-if="selectedAsset.type === 'image'" class="image-viewer">
          <img :src="selectedAsset.url" :alt="selectedAsset.name" />
        </div>

        <div v-if="selectedAsset.type === 'audio'" class="audio-player-ui">
          <div class="visualizer-placeholder">
            🎵
          </div>
          <audio 
            ref="audioPlayer"
            :src="selectedAsset.url" 
            @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedMetadata"
            @ended="onEnded"
            @play="isPlaying = true"
            @pause="isPlaying = false"
            autoplay
          ></audio>
          
          <div class="controls">
            <button class="play-btn" @click="togglePlay">
              {{ isPlaying ? '⏸️' : '▶️' }}
            </button>
            <div class="progress-bar">
              <span>{{ formatTime(currentTime) }}</span>
              <input 
                type="range" 
                min="0" 
                :max="duration || 100" 
                :value="currentTime" 
                @input="seek"
              />
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.media-player {
  display: flex;
  height: 100%;
  width: 100%;
  background: #1a2332;
  color: #e8f4f8;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background: #2d3a5c;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #3a4a6b;
}

.filters {
  display: flex;
  padding: 10px;
  gap: 5px;
  border-bottom: 1px solid #3a4a6b;
}

.filters button {
  flex: 1;
  font-size: 0.9rem;
}

.asset-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.asset-item {
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
}

.asset-item:hover {
  background: rgba(232, 244, 248, 0.1);
}

.asset-item.active {
  background: #3a4a6b;
  border-left: 4px solid #e8f4f8;
}

.preview-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: #8da1b6;
  width: 100%;
  height: 100%;
}

.gallery-preview {
  margin-top: 2rem;
  width: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.gallery-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #2d3a5c;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.gallery-name {
  font-size: 0.8rem;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.content-viewer {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.image-viewer img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="10" height="10" fill="%232d3a5c"/><rect x="10" y="10" width="10" height="10" fill="%232d3a5c"/></svg>') repeat;
}

.audio-player-ui {
  width: 100%;
  background: #2d3a5c;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.visualizer-placeholder {
  font-size: 64px;
  text-align: center;
  margin-bottom: 20px;
  animation: bounce 2s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.play-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e8f4f8;
  color: #2d3a5c;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
}

.progress-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: monospace;
}

input[type="range"] {
  flex: 1;
  accent-color: #e8f4f8;
}
</style>

