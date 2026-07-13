<template>
  <div class="screen">
    <div class="hud">
      <div class="timer" :class="{ warn: timerWarn }">{{ timerDisplay }}</div>
      <div class="pairs-hud">Parejas: <strong>{{ matchedPairs }}</strong>/12</div>
      <button class="btn btn-gray btn-sm" @click="$emit('go-home')">← Menú</button>
    </div>

    <div class="game-grid">
      <div
        v-for="card in gameCards"
        :key="card.uid"
        class="card"
        :class="{ flipped: card.flipped, matched: card.matched }"
        @click="$emit('flip-card', card)"
      >
        <div class="card-inner">
          <div class="card-face card-back">
            <div class="back-icon">🐍</div>
            <div class="back-label">Serpientes<br />Costa Rica</div>
          </div>
          <div class="card-face card-front" :class="card.venenosa ? 'venenosa' : 'no-venenosa'">
            <div class="badge">{{ card.venenosa ? '⚠ Venenosa' : '✓ No Venenosa' }}</div>
            <div class="emoji">{{ card.venenosa ? '☠️' : '🌿' }}</div>
            <div class="nombre">{{ card.nombre }}</div>
            <div class="cientifico">{{ card.cientifico }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  gameCards:    { type: Array,   required: true },
  matchedPairs: { type: Number,  required: true },
  timerDisplay: { type: String,  required: true },
  timerWarn:    { type: Boolean, required: true },
})
defineEmits(['flip-card', 'go-home'])
</script>

<style scoped>
/* HUD */
.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: .4rem .5rem;
  margin-bottom: .6rem;
}

.timer {
  font-size: 2rem;
  font-weight: 900;
  color: var(--accent);
  min-width: 80px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  transition: color .3s;
}
.timer.warn { color: #ff6b6b; animation: pulse .8s infinite alternate; }
@keyframes pulse { from { opacity: 1; } to { opacity: .5; } }

.pairs-hud { font-size: 1.1rem; color: var(--text-dim); }
.pairs-hud strong { color: var(--accent); }

/* Grid */
.game-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  width: 100%;
}

/* Cards */
.card {
  aspect-ratio: .68;
  cursor: pointer;
  perspective: 900px;
  user-select: none;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .45s cubic-bezier(.4,0,.2,1);
  border-radius: 10px;
}

.card.flipped .card-inner,
.card.matched .card-inner { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px;
  overflow: hidden;
}

.card-back {
  background: var(--green-dark);
  border: 2px solid rgba(149,212,74,.35);
  background-image:
    repeating-linear-gradient(45deg,  rgba(149,212,74,.04) 0, rgba(149,212,74,.04) 2px, transparent 2px, transparent 12px),
    repeating-linear-gradient(-45deg, rgba(149,212,74,.04) 0, rgba(149,212,74,.04) 2px, transparent 2px, transparent 12px);
}
.back-icon  { font-size: 2rem; margin-bottom: 4px; filter: drop-shadow(0 0 6px rgba(149,212,74,.5)); }
.back-label { font-size: .5rem; color: rgba(149,212,74,.5); text-transform: uppercase; letter-spacing: 1px; text-align: center; }

.card-front { transform: rotateY(180deg); text-align: center; }
.card-front.venenosa    { background: linear-gradient(160deg,#4a0000,#7a1010); border: 2px solid rgba(255,80,80,.5); }
.card-front.no-venenosa { background: linear-gradient(160deg,#133320,#1e5c3a); border: 2px solid rgba(149,212,74,.4); }

.badge {
  font-size: .48rem;
  padding: 2px 6px;
  border-radius: 20px;
  font-weight: 700;
  letter-spacing: .5px;
  margin-bottom: 5px;
  text-transform: uppercase;
}
.venenosa    .badge { background: rgba(255,80,80,.25);  color: #ff9090;      border: 1px solid rgba(255,80,80,.4); }
.no-venenosa .badge { background: rgba(149,212,74,.2); color: var(--accent); border: 1px solid rgba(149,212,74,.4); }

.emoji     { font-size: 1.3rem; margin-bottom: 4px; }
.nombre    { font-size: .63rem; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 3px; }
.cientifico { font-size: .5rem; font-style: italic; color: rgba(255,255,255,.55); line-height: 1.3; }

.card.matched .card-front {
  box-shadow: 0 0 18px rgba(255,215,0,.4), inset 0 0 10px rgba(255,215,0,.1);
  border-color: rgba(255,215,0,.5) !important;
}

@media (max-width: 600px) {
  .game-grid { grid-template-columns: repeat(4, 1fr); gap: 5px; }
}
</style>
