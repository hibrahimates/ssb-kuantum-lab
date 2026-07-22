import { getAllModuleMetas } from '../content/modules'
import { getQuizScore } from './progress'

export const UNLOCK_THRESHOLD = 70

export function calculateScorePercent(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function isUnlocked(scorePercent: number, threshold = UNLOCK_THRESHOLD): boolean {
  return scorePercent >= threshold
}

export function formatScore(scorePercent: number): string {
  return `%${scorePercent}`
}

/** Soft unlock: module 1 always open; module N requires previous quiz ≥70%. */
export function isModuleUnlocked(moduleSlug: string): boolean {
  const metas = getAllModuleMetas()
  const meta = metas.find((m) => m.slug === moduleSlug)
  if (!meta) return false
  if (meta.order === 1) return true

  const previous = metas.find((m) => m.order === meta.order - 1)
  if (!previous) return true

  const prevScore = getQuizScore(previous.slug)
  return prevScore !== undefined && isUnlocked(prevScore)
}

export function getUnlockRequirement(moduleSlug: string): string | undefined {
  const metas = getAllModuleMetas()
  const meta = metas.find((m) => m.slug === moduleSlug)
  if (!meta || meta.order === 1) return undefined

  const previous = metas.find((m) => m.order === meta.order - 1)
  if (!previous) return undefined

  return `Bu modülü açmak için «${previous.title}» quizini en az %${UNLOCK_THRESHOLD} ile geçmelisin.`
}
