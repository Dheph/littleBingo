const STORAGE_KEY = 'bingo-app-state-v1'

export function loadState(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveState(state: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, state)
  } catch {
    // silently fail
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // silently fail
  }
}
