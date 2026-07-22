export interface ArenaScoreSnapshot {
  totalPercent: number
  examPercent: number
  formulationPercent: number
  completedAt: string
}

export interface ProgressState {
  completedModules: string[]
  quizScores: Record<string, number>
  lastLocation: string
  lastArenaScore?: ArenaScoreSnapshot
}

const STORAGE_KEY = 'kuantum-lab-progress'

const defaultState: ProgressState = {
  completedModules: [],
  quizScores: {},
  lastLocation: '/',
}

function readState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      completedModules: parsed.completedModules ?? [],
      quizScores: parsed.quizScores ?? {},
      lastLocation: parsed.lastLocation ?? '/',
      lastArenaScore: parsed.lastArenaScore,
    }
  } catch {
    return { ...defaultState }
  }
}

function writeState(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getProgress(): ProgressState {
  return readState()
}

export function setLastLocation(path: string): void {
  const state = readState()
  state.lastLocation = path
  writeState(state)
}

export function saveQuizScore(moduleSlug: string, scorePercent: number): void {
  const state = readState()
  state.quizScores[moduleSlug] = scorePercent
  writeState(state)
}

export function markModuleComplete(moduleSlug: string): void {
  const state = readState()
  if (!state.completedModules.includes(moduleSlug)) {
    state.completedModules.push(moduleSlug)
  }
  writeState(state)
}

export function isModuleComplete(moduleSlug: string): boolean {
  return readState().completedModules.includes(moduleSlug)
}

export function getQuizScore(moduleSlug: string): number | undefined {
  return readState().quizScores[moduleSlug]
}

export function getCompletionPercent(totalModules: number): number {
  if (totalModules === 0) return 0
  const { completedModules } = readState()
  return Math.round((completedModules.length / totalModules) * 100)
}

export function saveArenaScore(snapshot: ArenaScoreSnapshot): void {
  const state = readState()
  state.lastArenaScore = snapshot
  writeState(state)
  notifyProgressChange()
}

export function getLastArenaScore(): ArenaScoreSnapshot | undefined {
  return readState().lastArenaScore
}

export function resetProgress(): void {
  writeState({ ...defaultState })
}

export const PROGRESS_EVENT = 'kuantum-lab-progress-change'

export function notifyProgressChange(): void {
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT))
}
