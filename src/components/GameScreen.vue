<template>
  <!-- ocupa todo el alto disponible debajo del header -->
  <div class="game-screen">
    <!-- HUD -->
    <div class="hud">
      <div class="timer" :class="{ warn: timerWarn }">{{ timerDisplay }}</div>
      <div class="pairs-hud">Parejas <strong>{{ matchedPairs }}</strong>/12</div>
      <button class="btn btn-gray btn-sm" @click="$emit('go-home')">← Menú</button>
    </div>

    <!-- Grid — todas las cartas visibles a la vez -->
    <div class="game-grid">
      <div
        v-for="card in gameCards"
        :key="card.uid"
        class="card"
        :class="{ flipped: card.flipped, matched: card.matched }"
        @click="$emit('flip-card', card)"
      >
        <div class="card-inner">

          <!-- Reverso -->
          <div class="card-face card-back">
            <span class="back-icon">🐍</span>
            <span class="back-label">CR</span>
          </div>

          <!-- Frente -->
          <div class="card-face card-front" :class="card.venenosa ? 'ven' : 'nov'">
            <div class="card-img-wrap">
              <img
                v-if="card.imagen"
                class="card-img"
                :src="imgSrc(card.imagen)"
                :alt="card.nombre"
                loading="lazy"
                @error="onImgErr($event, card.venenosa)"
              />
              <div v-else class="img-fallback">{{ card.venenosa ? '☠️' : '🌿' }}</div>
            </div>
            <div class="card-info">
              <span class="badge" :class="card.venenosa ? 'badge-ven' : 'badge-nov'">
                {{ card.venenosa ? '⚠ Venenosa' : '✓ No venenosa' }}
              </span>
              <p class="nombre">{{ card.nombre }}</p>
              <p class="cientifico">{{ card.cientifico }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  gameCards:    { type: Array,   required: true },
  matchedPairs: { type: Number,  required: true },
  timerDisplay: { type: String,  required: true },
  timerWarn:    { type: Boolean, required: true },
})
defineEmits(['flip-card', 'go-home'])

function imgSrc(filename) {
  if (!filename) return null
  return new URL(`../assets/snakes/${filename}`, import.meta.url).href
}

function onImgErr(e, venenosa) {
  e.target.outerHTML = `<div class="img-fallback">${venenosa ? '☠️' : '🌿'}</div>`
}
</script>

<style scoped>
/* ── Contenedor principal: llena el espacio bajo el header ── */
.game-screen {
  width: 100%;
  height: calc(100dvh - var(--header-h));
  display: flex;
  flex-direction: column;
  padding: 6px 8px 8px;
  overflow: hidden;
  max-width: 1100px;
  margin: 0 auto;
}

/* ── HUD ── */
.hud {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  margin-bottom: 6px;
  gap: 8px;
}

.timer {
  font-size: 1.9rem;
  font-weight: 900;
  color: var(--accent);
  min-width: 74px;
  font-variant-numeric: tabular-nums;
}
.timer.warn { color: #ff6b6b; animation: pulse .8s infinite alternate; }
@keyframes pulse { from { opacity: 1; } to { opacity: .45; } }

.pairs-hud { font-size: 1rem; color: var(--text-dim); }
.pairs-hud strong { color: var(--accent); }

/* ── Grid: 6×4 = 24 cartas, todo en pantalla ── */
.game-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 7px;
}

/* ── Carta ── */
.card {
  min-width: 0;
  min-height: 0;
  cursor: pointer;
  perspective: 800px;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .42s cubic-bezier(.4,0,.2,1);
  border-radius: 8px;
}

.card.flipped .card-inner,
.card.matched .card-inner { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Reverso */
.card-back {
  background: var(--green-dark);
  border: 1.5px solid rgba(149,212,74,.35);
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-image:
    repeating-linear-gradient(45deg,  rgba(149,212,74,.05) 0 2px, transparent 2px 13px),
    repeating-linear-gradient(-45deg, rgba(149,212,74,.05) 0 2px, transparent 2px 13px);
}
.back-icon  { font-size: 1.6rem; filter: drop-shadow(0 0 6px rgba(149,212,74,.5)); }
.back-label { font-size: .55rem; color: rgba(149,212,74,.45); text-transform: uppercase; letter-spacing: 1px; }

/* Frente */
.card-front {
  transform: rotateY(180deg);
}
.card-front.ven { background: linear-gradient(170deg,#3d0000,#6e0f0f); border: 1.5px solid rgba(255,80,80,.45); }
.card-front.nov { background: linear-gradient(170deg,#0e2a1a,#1a5035); border: 1.5px solid rgba(149,212,74,.38); }

/* Imagen */
.card-img-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
:deep(.img-fallback) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: rgba(0,0,0,.2);
}

/* Texto */
.card-info {
  flex-shrink: 0;
  padding: 4px 5px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: rgba(0,0,0,.35);
}

.badge {
  font-size: .48rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 20px;
  letter-spacing: .3px;
  text-transform: uppercase;
  white-space: nowrap;
}
.badge-ven { background: rgba(255,80,80,.22); color: #ff9090; border: 1px solid rgba(255,80,80,.4); }
.badge-nov { background: rgba(149,212,74,.18); color: var(--accent); border: 1px solid rgba(149,212,74,.38); }

.nombre {
  font-size: .6rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  line-height: 1.2;
}
.cientifico {
  font-size: .5rem;
  font-style: italic;
  color: rgba(255,255,255,.55);
  text-align: center;
  line-height: 1.2;
}

/* Carta emparejada */
.card.matched .card-front {
  box-shadow: 0 0 14px rgba(255,215,0,.45), inset 0 0 8px rgba(255,215,0,.1);
  border-color: rgba(255,215,0,.55) !important;
}

/* ── Mobile portrait: 4×6 ── */
@media (max-width: 600px) {
  .game-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 5px;
  }
  .game-screen { padding: 4px 5px 6px; }
  .hud { margin-bottom: 4px; }
  .timer { font-size: 1.5rem; min-width: 60px; }
  .pairs-hud { font-size: .85rem; }
  .nombre     { font-size: .55rem; }
  .cientifico { font-size: .45rem; }
  .badge      { font-size: .42rem; }
}

/* ── Mobile landscape: 6×4 con más ancho ── */
@media (max-height: 500px) and (orientation: landscape) {
  .game-grid {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 4px;
  }
  .timer { font-size: 1.4rem; }
  .hud { margin-bottom: 3px; }
}
</style>
