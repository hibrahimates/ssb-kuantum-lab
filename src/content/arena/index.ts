import type {
  ArenaExamResult,
  ArenaFormulationResult,
  ArenaQuestion,
  ArenaResult,
  ArenaTopic,
  FormulationTask,
} from './types'
import { ARENA_TOPIC_LABELS } from './types'

export type {
  ArenaTopic,
  ArenaQuestion,
  FormulationChoice,
  FormulationStep,
  FormulationTask,
  ArenaExamResult,
  ArenaFormulationResult,
  ArenaResult,
} from './types'

export { ARENA_TOPIC_LABELS } from './types'
export { ARENA_QUESTIONS, ARENA_EXAM_COUNT } from './questions'
export { FORMULATION_TASK, MAX_CUT_FORMULATION } from './formulation'

export function scoreExam(
  questions: ArenaQuestion[],
  answers: (number | null)[],
): ArenaExamResult {
  const topicCorrect: ArenaExamResult['topicCorrect'] = {
    temel: { correct: 0, total: 0 },
    qubo: { correct: 0, total: 0 },
    qaoa: { correct: 0, total: 0 },
    vqe: { correct: 0, total: 0 },
    nisq: { correct: 0, total: 0 },
    sektor: { correct: 0, total: 0 },
  }

  let correctCount = 0

  questions.forEach((q, i) => {
    topicCorrect[q.topic].total += 1
    if (answers[i] === q.correctIndex) {
      correctCount += 1
      topicCorrect[q.topic].correct += 1
    }
  })

  return { answers, correctCount, topicCorrect }
}

export function scoreFormulation(
  task: FormulationTask,
  selections: Record<string, string>,
): ArenaFormulationResult {
  let correctCount = 0

  for (const step of task.steps) {
    const selectedId = selections[step.id]
    const choice = step.choices.find((c) => c.id === selectedId)
    if (choice?.correct) correctCount += 1
  }

  return {
    selections,
    correctCount,
    totalSteps: task.steps.length,
  }
}

export function buildArenaResult(
  exam: ArenaExamResult,
  formulation: ArenaFormulationResult,
  examTotal: number,
): ArenaResult {
  const examPercent =
    examTotal === 0 ? 0 : Math.round((exam.correctCount / examTotal) * 100)
  const formulationPercent =
    formulation.totalSteps === 0
      ? 0
      : Math.round((formulation.correctCount / formulation.totalSteps) * 100)

  const totalPercent = Math.round(examPercent * 0.7 + formulationPercent * 0.3)

  return {
    examPercent,
    formulationPercent,
    totalPercent,
    exam,
    formulation,
    completedAt: new Date().toISOString(),
  }
}

export function getTopicBreakdownData(
  topicCorrect: ArenaExamResult['topicCorrect'],
): { topic: string; score: number }[] {
  return (Object.entries(topicCorrect) as [ArenaTopic, { correct: number; total: number }][])
    .filter(([, v]) => v.total > 0)
    .map(([topic, v]) => ({
      topic: ARENA_TOPIC_LABELS[topic],
      score: v.total === 0 ? 0 : Math.round((v.correct / v.total) * 100),
    }))
}
