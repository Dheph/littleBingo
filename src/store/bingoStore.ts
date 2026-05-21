import { create } from 'zustand'
import type { BingoState, BingoTheme } from '../types'
import { loadState, saveState } from '../utils/storage'
import { drawNumber } from '../utils/draw'

const defaultTheme: BingoTheme = {
  primaryColor: '#6366f1',
  headerColor: '#1e1b4b',
  leftPanelColor: '#0f172a',
  rightPanelColor: '#1e293b',
  textColor: '#f8fafc',
  buttonColor: '#818cf8',
  bingoButtonColor: '#ef4444',
  bingoButtonText: 'BINGO!',
  backgroundImage: null,
  backgroundGradient: null,
  gradientFrom: '#0f172a',
  gradientTo: '#1e1b4b',
  gradientDirection: 'to bottom',
}

const defaultState: BingoState = {
  isSetup: false,
  title: '',
  totalNumbers: 75,
  drawnNumbers: [],
  currentNumber: null,
  theme: defaultTheme,
  lastUpdated: Date.now(),
}

function hydrate(): BingoState {
  const saved = loadState()
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return defaultState
    }
  }
  return defaultState
}

interface BingoStore extends BingoState {
  setup: (title: string, totalNumbers: number, theme: BingoTheme) => void
  draw: () => void
  bingo: () => void
  reset: () => void
  updateTheme: (theme: Partial<BingoTheme>) => void
  updateTitle: (title: string) => void
  updateTotalNumbers: (total: number) => void
  addManualNumber: (num: number) => void
  removeNumber: (num: number) => void
  clearDrawn: () => void
}

export const useBingoStore = create<BingoStore>((set, get) => {
  const persist = (state: Partial<BingoState>) => {
    set((prev) => {
      const next = { ...prev, ...state, lastUpdated: Date.now() }
      saveState(JSON.stringify(next))
      return next
    })
  }

  return {
    ...hydrate(),

    setup: (title, totalNumbers, theme) => {
      persist({ isSetup: true, title, totalNumbers, theme, drawnNumbers: [], currentNumber: null })
    },

    draw: () => {
      const { totalNumbers, drawnNumbers } = get()
      const next = drawNumber(totalNumbers, drawnNumbers)
      if (next !== null) {
        persist({ currentNumber: next, drawnNumbers: [...drawnNumbers, next] })
      }
    },

    bingo: () => {},

    reset: () => {
      const { theme, title, totalNumbers } = get()
      persist({ drawnNumbers: [], currentNumber: null, theme, title, totalNumbers })
    },

    updateTheme: (theme) => {
      const prev = get()
      persist({ theme: { ...prev.theme, ...theme } })
    },

    updateTitle: (title) => {
      persist({ title })
    },

    updateTotalNumbers: (totalNumbers) => {
      persist({ totalNumbers, drawnNumbers: [], currentNumber: null })
    },

    addManualNumber: (num) => {
      const { totalNumbers, drawnNumbers } = get()
      if (num >= 1 && num <= totalNumbers && !drawnNumbers.includes(num)) {
        persist({ currentNumber: num, drawnNumbers: [...drawnNumbers, num] })
      }
    },

    removeNumber: (num) => {
      const { drawnNumbers, currentNumber } = get()
      const newDrawn = drawnNumbers.filter((n) => n !== num)
      persist({
        drawnNumbers: newDrawn,
        currentNumber: currentNumber === num ? (newDrawn.length > 0 ? newDrawn[newDrawn.length - 1] : null) : currentNumber,
      })
    },

    clearDrawn: () => {
      persist({ drawnNumbers: [], currentNumber: null })
    },
  }
})
