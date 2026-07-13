import { ref, computed } from 'vue'
import { ALL_SNAKES } from '../data/snakes'

const TOTAL_PAIRS  = 12
const GAME_SECONDS = 180
const LS_KEY       = 'ucr_snakes_ranking'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function fmtTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function useGame() {
  const screen       = ref('start')
  const gameCards    = ref([])
  const flippedCards = ref([])
  const matchedPairs = ref(0)
  const canFlip      = ref(true)
  const timeLeft     = ref(GAME_SECONDS)
  const gameActive   = ref(false)
  const lastResult   = ref(null)
  const playerName   = ref('')
  const ranking      = ref([])
  let   timerHandle  = null

  const timerDisplay = computed(() => fmtTime(timeLeft.value))
  const timerWarn    = computed(() => timeLeft.value <= 30)

  const sortedRanking = computed(() =>
    [...ranking.value]
      .sort((a, b) => {
        if (a.completed && !b.completed) return -1
        if (!a.completed && b.completed) return  1
        if (a.completed  &&  b.completed) return a.timeUsed - b.timeUsed
        return b.pairs - a.pairs
      })
      .slice(0, 20)
  )

  function loadRanking() {
    try { ranking.value = JSON.parse(localStorage.getItem(LS_KEY)) || [] }
    catch { ranking.value = [] }
  }

  function startGame() {
    clearInterval(timerHandle)
    const selected = shuffle(ALL_SNAKES).slice(0, TOTAL_PAIRS)
    gameCards.value = shuffle(
      [...selected, ...selected].map((s, i) => ({ ...s, uid: i, flipped: false, matched: false }))
    )
    matchedPairs.value = 0
    flippedCards.value = []
    canFlip.value      = true
    timeLeft.value     = GAME_SECONDS
    gameActive.value   = true
    lastResult.value   = null
    screen.value       = 'game'
    timerHandle = setInterval(tick, 1000)
  }

  function flipCard(card) {
    if (!canFlip.value || !gameActive.value) return
    if (card.flipped || card.matched) return
    if (flippedCards.value.length >= 2) return

    card.flipped = true
    flippedCards.value.push(card)

    if (flippedCards.value.length === 2) {
      canFlip.value = false
      setTimeout(checkMatch, 900)
    }
  }

  function checkMatch() {
    const [a, b] = flippedCards.value
    if (a.nombre === b.nombre) {
      a.matched = true
      b.matched = true
      matchedPairs.value++
      if (matchedPairs.value === TOTAL_PAIRS) endGame(true)
    } else {
      a.flipped = false
      b.flipped = false
    }
    flippedCards.value = []
    canFlip.value = true
  }

  function tick() {
    timeLeft.value--
    if (timeLeft.value <= 0) endGame(false)
  }

  function endGame(completed) {
    clearInterval(timerHandle)
    gameActive.value = false
    lastResult.value = {
      completed,
      pairs:    matchedPairs.value,
      timeUsed: GAME_SECONDS - timeLeft.value,
    }
    playerName.value = ''
    screen.value = 'end'
  }

  function saveScore() {
    if (!lastResult.value) { goHome(); return }
    ranking.value.push({
      name:      playerName.value.trim() || 'Anónimo',
      pairs:     lastResult.value.pairs,
      timeUsed:  lastResult.value.timeUsed,
      completed: lastResult.value.completed,
      date:      new Date().toLocaleDateString('es-CR'),
    })
    localStorage.setItem(LS_KEY, JSON.stringify(ranking.value))
    lastResult.value = null
    goHome()
  }

  function clearRanking() {
    if (!confirm('¿Borrar todo el ranking?')) return
    ranking.value = []
    localStorage.removeItem(LS_KEY)
  }

  function goHome() {
    clearInterval(timerHandle)
    gameActive.value = false
    screen.value = 'start'
  }

  loadRanking()

  return {
    screen, gameCards, matchedPairs, timeLeft,
    timerDisplay, timerWarn, sortedRanking,
    lastResult, playerName,
    startGame, flipCard, saveScore, clearRanking, goHome, fmtTime,
  }
}
