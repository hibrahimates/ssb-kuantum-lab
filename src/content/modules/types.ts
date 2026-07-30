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

export type Scene3dId =
  | 'bloch-sphere'
  | 'superposition-wave'
  | 'entangle-pair'
  | 'energy-landscape'
  | 'noise-cloud'
  | 'hero-orbit'

export type TryItKind = 'lab-js' | 'qubo-config' | 'qaoa-params'

export interface TryItSpec {
  kind: TryItKind
  title: string
  starter: string
  hint?: string
}

export interface ModuleResource {
  label: string
  url: string
  note?: string
}

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
  narration?: string
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
  narration?: string
  codeBlock?: { language?: string; code: string }
  visual?: PlaygroundId
  miniPlayground?: PlaygroundId
  scene3d?: Scene3dId
  tryIt?: TryItSpec
}

export interface ModuleContent {
  slug: string
  order: number
  title: string
  subtitle: string
  season: 1 | 2 | 3 | 4
  seasonTitle: string
  levelLabel: string
  nextHook: string
  goal: string
  goalNarration?: string
  analogy?: ModuleAnalogy
  intuitions?: ModuleIntuition[]
  tryThis?: ModuleTryThis[]
  playgrounds?: PlaygroundId[]
  sections: ModuleSection[]
  quiz: QuizQuestion[]
  resources?: ModuleResource[]
  /** @deprecated Prefer `playgrounds` */
  simType?: PlaygroundId
}

export interface ModuleMeta {
  slug: string
  order: number
  title: string
  subtitle: string
  season: 1 | 2 | 3 | 4
  seasonTitle: string
  levelLabel: string
}
