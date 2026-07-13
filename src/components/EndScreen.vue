<template>
  <div class="screen">
    <div class="end-box">
      <div class="end-icon">{{ result?.completed ? '🎉' : '⏰' }}</div>
      <div class="end-title">
        {{ result?.completed ? '¡Todas las parejas!' : '¡Se acabó el tiempo!' }}
      </div>
      <div class="end-subtitle">
        {{ result?.completed
          ? 'Completaste el juego. ¡Excelente memoria!'
          : `Encontraste ${result?.pairs} de 12 parejas.` }}
      </div>

      <div class="end-stats">
        <div class="stat-box">
          <div class="stat-value">{{ result?.pairs }}/12</div>
          <div class="stat-label">Parejas</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ result?.completed ? fmtTime(result.timeUsed) : '-' }}</div>
          <div class="stat-label">Tiempo</div>
        </div>
      </div>

      <div class="name-row">
        <input
          :value="playerName"
          type="text"
          maxlength="20"
          placeholder="Tu nombre..."
          @input="$emit('update:playerName', $event.target.value)"
          @keyup.enter="$emit('save')"
        />
        <button class="btn btn-green" @click="$emit('save')">Guardar</button>
      </div>

      <div class="btn-row">
        <button class="btn btn-green" @click="$emit('restart')">▶ Jugar de nuevo</button>
        <button class="btn btn-gray"  @click="$emit('go-home')">🏆 Ver Ranking</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  result:     { type: Object,   default: null },
  playerName: { type: String,   required: true },
  fmtTime:    { type: Function, required: true },
})
defineEmits(['update:playerName', 'save', 'restart', 'go-home'])
</script>

<style scoped>
.end-box {
  background: rgba(30,64,32,.4);
  border: 1px solid rgba(149,212,74,.25);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 440px;
  width: 100%;
}

.end-icon     { font-size: 3rem; margin-bottom: .5rem; }
.end-title    { font-size: 1.6rem; font-weight: 700; color: var(--accent); margin-bottom: .5rem; }
.end-subtitle { color: var(--text-dim); margin-bottom: 1.2rem; font-size: 1rem; }

.end-stats { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem; }
.stat-box  { background: rgba(0,0,0,.3); border-radius: 10px; padding: .6rem 1rem; min-width: 90px; }
.stat-value { font-size: 1.5rem; font-weight: 900; color: var(--accent); }
.stat-label { font-size: .7rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: .5px; }

.name-row {
  display: flex;
  gap: .5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;
}
.name-row input {
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid rgba(149,212,74,.3);
  background: rgba(0,0,0,.4);
  color: var(--text);
  font-size: 1rem;
  width: 180px;
  outline: none;
}
.name-row input:focus { border-color: var(--accent); }

.btn-row { display: flex; gap: .7rem; justify-content: center; flex-wrap: wrap; }

@media (max-width: 600px) { .end-stats { gap: 1rem; } }
</style>
