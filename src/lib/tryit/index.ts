import type { TryItKind } from '../../content/modules/types'
import { runLabJs } from './labJs'
import { runQaoaParams } from './qaoaParams'
import { runQuboConfig } from './quboConfig'

export type TryItRunResult =
  | { ok: true; output: string }
  | { ok: false; error: string }

export function runTryIt(kind: TryItKind, source: string): TryItRunResult {
  switch (kind) {
    case 'qubo-config':
      return runQuboConfig(source)
    case 'qaoa-params':
      return runQaoaParams(source)
    case 'lab-js': {
      const result = runLabJs(source)
      if (!result.ok) return result
      return { ok: true, output: result.lines.join('\n') }
    }
    default: {
      const _exhaustive: never = kind
      return { ok: false, error: `Bilinmeyen TryIt türü: ${String(_exhaustive)}` }
    }
  }
}

export { runLabJs } from './labJs'
export { runQaoaParams } from './qaoaParams'
export { runQuboConfig } from './quboConfig'
