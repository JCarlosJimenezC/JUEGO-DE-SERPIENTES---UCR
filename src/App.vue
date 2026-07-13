<template>
  <header class="site-header">
    <h1>🐍 Serpientes de Costa Rica</h1>
    <p>Encuentra la Pareja &mdash; UCR</p>
  </header>

  <div class="content-area">
    <transition name="fade" mode="out-in">
      <StartScreen
        v-if="screen === 'start'"
        key="start"
        :sorted-ranking="sortedRanking"
        :fmt-time="fmtTime"
        @start="startGame"
        @clear-ranking="clearRanking"
      />
      <GameScreen
        v-else-if="screen === 'game'"
        key="game"
        :game-cards="gameCards"
        :matched-pairs="matchedPairs"
        :timer-display="timerDisplay"
        :timer-warn="timerWarn"
        @flip-card="flipCard"
        @go-home="goHome"
      />
      <EndScreen
        v-else-if="screen === 'end'"
        key="end"
        :result="lastResult"
        v-model:player-name="playerName"
        :fmt-time="fmtTime"
        @save="saveScore"
        @restart="startGame"
        @go-home="goHome"
      />
    </transition>
  </div>
</template>

<script setup>
import StartScreen from './components/StartScreen.vue'
import GameScreen  from './components/GameScreen.vue'
import EndScreen   from './components/EndScreen.vue'
import { useGame, fmtTime } from './composables/useGame'

const {
  screen, gameCards, matchedPairs,
  timerDisplay, timerWarn, sortedRanking,
  lastResult, playerName,
  startGame, flipCard, saveScore, clearRanking, goHome,
} = useGame()
</script>

<style scoped>
.site-header {
  flex-shrink: 0;
  text-align: center;
  padding: .9rem 1rem .4rem;
  height: var(--header-h);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.site-header h1 {
  font-size: 1.7rem;
  color: var(--accent);
  text-shadow: 0 0 24px rgba(149,212,74,.4);
  letter-spacing: 1px;
  line-height: 1.2;
}
.site-header p {
  color: var(--text-dim);
  font-size: .82rem;
  margin-top: .15rem;
}

/* Área que queda debajo del header */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  width: 100%;
  overflow-y: auto; /* scroll en start/end screens */
}

@media (max-width: 600px) {
  .site-header h1 { font-size: 1.2rem; }
  .site-header p  { font-size: .75rem; }
}
</style>
