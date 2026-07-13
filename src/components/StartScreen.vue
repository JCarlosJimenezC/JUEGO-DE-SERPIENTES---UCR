<template>
  <div class="screen">
    <button class="btn btn-green" @click="$emit('start')">▶ Nueva Partida</button>

    <div class="ranking-header">
      <h2>🏆 Ranking</h2>
      <button class="btn btn-red btn-sm" @click="$emit('clear-ranking')">Borrar</button>
    </div>

    <div class="ranking-wrap">
      <p v-if="sortedRanking.length === 0" class="no-scores">
        Aún no hay puntajes. ¡Sé el primero!
      </p>
      <table v-else>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Parejas</th>
            <th>Tiempo</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in sortedRanking" :key="i">
            <td>
              <span v-if="i === 0" class="medal gold">🥇</span>
              <span v-else-if="i === 1" class="medal silver">🥈</span>
              <span v-else-if="i === 2" class="medal bronze">🥉</span>
              <span v-else class="pos">{{ i + 1 }}</span>
            </td>
            <td><strong>{{ entry.name }}</strong></td>
            <td>{{ entry.pairs }}/12</td>
            <td>{{ entry.completed ? fmtTime(entry.timeUsed) : '-' }}</td>
            <td>
              <span v-if="entry.completed" class="tag tag-ok">Completo</span>
              <span v-else class="tag tag-no">Incompleto</span>
            </td>
            <td class="date">{{ entry.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sortedRanking: { type: Array, required: true },
  fmtTime:       { type: Function, required: true },
})
defineEmits(['start', 'clear-ranking'])
</script>

<style scoped>

.ranking-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.2rem 0 .6rem;
}
.ranking-header h2 { color: var(--accent); font-size: 1.3rem; }

.ranking-wrap { width: 100%; overflow-x: auto; }

table { width: 100%; border-collapse: collapse; font-size: .88rem; }
th {
  padding: 8px 10px;
  color: var(--accent);
  border-bottom: 2px solid rgba(149,212,74,.3);
  text-align: left;
  white-space: nowrap;
}
td {
  padding: 7px 10px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
tr:hover td { background: rgba(149,212,74,.05); }

.gold   { color: #ffd700; }
.silver { color: #c0c0c0; }
.bronze { color: #cd7f32; }
.pos    { color: var(--text-dim); }
.date   { color: var(--text-dim); font-size: .8rem; }

.tag { padding: 2px 8px; border-radius: 20px; font-size: .78rem; }
.tag-ok { background: rgba(149,212,74,.2); color: var(--accent); }
.tag-no { background: rgba(255,100,100,.15); color: #ff9090; }

.no-scores { color: var(--text-dim); text-align: center; padding: 1.5rem; }
</style>
