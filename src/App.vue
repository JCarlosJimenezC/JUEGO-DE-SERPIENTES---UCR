<template>
  <header class="site-header">
    <h1>🐍 Serpientes de Costa Rica</h1>
    <p>Encuentra la Pareja &mdash; UCR</p>
  </header>

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
  text-align: center;
  padding: 1.2rem 1rem .5rem;
  width: 100%;
}
.site-header h1 {
  font-size: 1.9rem;
  color: var(--accent);
  text-shadow: 0 0 30px rgba(149,212,74,.4);
  letter-spacing: 1px;
}
.site-header p {
  color: var(--text-dim);
  font-size: .9rem;
  margin-top: .2rem;
}
</style>
