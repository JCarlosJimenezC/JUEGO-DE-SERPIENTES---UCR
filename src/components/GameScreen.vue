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
  padding: .5rem .6rem;
  margin-bottom: .8rem;
  gap: .5rem;
}

.timer {
  font-size: 2.4rem;
  font-weight: 900;
  color: var(--accent);
  min-width: 90px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  transition: color .3s;
}
.timer.warn { color: #ff6b6b; animation: pulse .8s infinite alternate; }
@keyframes pulse { from { opacity: 1; } to { opacity: .5; } }

.pairs-hud { font-size: 1.1rem; color: var(--text-dim); }
.pairs-hud strong { color: var(--accent); }

/* Grid — 4 columnas en desktop, 3 en mobile */
.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
  padding: 0 .2rem;
}

/* Cards */
.card {
  aspect-ratio: .72;
  cursor: pointer;
  perspective: 900px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .45s cubic-bezier(.4,0,.2,1);
  border-radius: 12px;
}

.card.flipped .card-inner,
.card.matched .card-inner { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  overflow: hidden;
}

.card-back {
  background: var(--green-dark);
  border: 2px solid rgba(149,212,74,.35);
  background-image:
    repeating-linear-gradient(45deg,  rgba(149,212,74,.05) 0, rgba(149,212,74,.05) 2px, transparent 2px, transparent 14px),
    repeating-linear-gradient(-45deg, rgba(149,212,74,.05) 0, rgba(149,212,74,.05) 2px, transparent 2px, transparent 14px);
}
.back-icon  { font-size: 2.6rem; margin-bottom: 6px; filter: drop-shadow(0 0 8px rgba(149,212,74,.5)); }
.back-label { font-size: .65rem; color: rgba(149,212,74,.5); text-transform: uppercase; letter-spacing: 1px; text-align: center; }

.card-front { transform: rotateY(180deg); text-align: center; }
.card-front.venenosa    { background: linear-gradient(160deg,#4a0000,#7a1010); border: 2px solid rgba(255,80,80,.5); }
.card-front.no-venenosa { background: linear-gradient(160deg,#133320,#1e5c3a); border: 2px solid rgba(149,212,74,.4); }

.badge {
  font-size: .65rem;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 700;
  letter-spacing: .4px;
  margin-bottom: 8px;
  text-transform: uppercase;
  white-space: nowrap;
}
.venenosa    .badge { background: rgba(255,80,80,.25);  color: #ff9090;      border: 1px solid rgba(255,80,80,.4); }
.no-venenosa .badge { background: rgba(149,212,74,.2); color: var(--accent); border: 1px solid rgba(149,212,74,.4); }

.emoji      { font-size: 2rem; margin-bottom: 6px; }
.nombre     { font-size: .85rem; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 5px; }
.cientifico { font-size: .68rem; font-style: italic; color: rgba(255,255,255,.6); line-height: 1.3; }

.card.matched .card-front {
  box-shadow: 0 0 20px rgba(255,215,0,.4), inset 0 0 12px rgba(255,215,0,.1);
  border-color: rgba(255,215,0,.5) !important;
}

/* ── Mobile ── */
@media (max-width: 600px) {
  .game-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .hud { padding: .4rem .4rem; margin-bottom: .5rem; }
  .timer { font-size: 1.8rem; min-width: 70px; }
  .pairs-hud { font-size: .95rem; }

  .badge      { font-size: .55rem; padding: 2px 6px; margin-bottom: 5px; }
  .emoji      { font-size: 1.5rem; margin-bottom: 4px; }
  .nombre     { font-size: .72rem; }
  .cientifico { font-size: .58rem; }
  .back-icon  { font-size: 2rem; }
  .back-label { font-size: .55rem; }
}
</style>
