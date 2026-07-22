import type { QuizQuestion } from '../modules/types'

export type ArenaTopic =
  | 'temel'
  | 'qubo'
  | 'qaoa'
  | 'vqe'
  | 'nisq'
  | 'sektor'

export const ARENA_TOPIC_LABELS: Record<ArenaTopic, string> = {
  temel: 'Kuantum Temeller',
  qubo: 'QUBO / Ising',
  qaoa: 'QAOA',
  vqe: 'VQE',
  nisq: 'NISQ / IBM',
  sektor: 'Sektör',
}

export interface ArenaQuestion extends QuizQuestion {
  topic: ArenaTopic
}

export interface FormulationChoice {
  id: string
  label: string
  correct: boolean
  explanation: string
}

export interface FormulationStep {
  id: string
  title: string
  prompt: string
  choices: FormulationChoice[]
}

export interface FormulationTask {
  id: string
  title: string
  scenario: string
  steps: FormulationStep[]
}

export interface ArenaExamResult {
  answers: (number | null)[]
  correctCount: number
  topicCorrect: Record<ArenaTopic, { correct: number; total: number }>
}

export interface ArenaFormulationResult {
  selections: Record<string, string>
  correctCount: number
  totalSteps: number
}

export interface ArenaResult {
  examPercent: number
  formulationPercent: number
  totalPercent: number
  exam: ArenaExamResult
  formulation: ArenaFormulationResult
  completedAt: string
}
