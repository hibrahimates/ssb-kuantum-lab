export type PlaygroundId =
  | 'qubit'
  | 'qubo'
  | 'qaoa'
  | 'constraint'
  | 'shots'
  | 'classical-vs-quantum'
  | 'knapsack'
  | 'variational'
  | 'live-qubo'
  | 'live-qaoa'
  | 'viz-coin'
  | 'viz-maze'
  | 'viz-radio'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface ModuleAnalogy {
  title: string
  text: string
  visual?: PlaygroundId
}

export interface ModuleIntuition {
  title: string
  setup: string
  insight: string
}

export interface ModuleTryThis {
  prompt: string
  hint?: string
}

export interface ModuleSection {
  id: string
  title: string
  body: string
  codeBlock?: { language?: string; code: string }
  visual?: PlaygroundId
  miniPlayground?: PlaygroundId
}

export interface ModuleContent {
  slug: string
  order: number
  title: string
  subtitle: string
  goal: string
  analogy?: ModuleAnalogy
  intuitions?: ModuleIntuition[]
  tryThis?: ModuleTryThis[]
  playgrounds?: PlaygroundId[]
  sections: ModuleSection[]
  quiz: QuizQuestion[]
  /** @deprecated Prefer `playgrounds` */
  simType?: PlaygroundId
}

export interface ModuleMeta {
  slug: string
  order: number
  title: string
  subtitle: string
}
