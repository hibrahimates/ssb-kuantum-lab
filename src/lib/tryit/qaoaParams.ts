import {
  histogramToSortedEntries,
  runQaoaStatevector,
  sampleComputationalBasis,
  type QaoaParams,
} from '../quantum/qaoa'
import type { UnweightedGraph } from '../quantum/qubo'

function parseEdges(raw: unknown): [number, number][] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('"edges" dizi olmalı: [[0,1],[1,2],...]')
  }
  const edges: [number, number][] = []
  for (const item of raw) {
    if (!Array.isArray(item) || item.length < 2) {
      throw new Error('Her kenar [i,j] çifti olmalı')
    }
    edges.push([Number(item[0]), Number(item[1])])
  }
  return edges
}

function toNumberArray(value: unknown, name: string): number[] {
  if (typeof value === 'number') {
    return [value]
  }
  if (Array.isArray(value)) {
    if (value.length === 0) throw new Error(`"${name}" boş olamaz`)
    return value.map((v, i) => {
      const n = Number(v)
      if (Number.isNaN(n)) throw new Error(`"${name}[${i}]" sayı olmalı`)
      return n
    })
  }
  throw new Error(`"${name}" sayı veya dizi olmalı`)
}

function expandParams(gamma: number[], beta: number[], p: number): QaoaParams {
  const expand = (arr: number[], label: string): number[] => {
    if (arr.length === p) return arr
    if (arr.length === 1) return Array(p).fill(arr[0])
    throw new Error(`"${label}" uzunluğu p=${p} veya 1 olmalı (şu an ${arr.length})`)
  }
  return { gamma: expand(gamma, 'gamma'), beta: expand(beta, 'beta') }
}

function inferNodeCount(edges: [number, number][]): number {
  let max = 0
  for (const [i, j] of edges) {
    max = Math.max(max, i, j)
  }
  return max + 1
}

export function runQaoaParams(source: string): { ok: true; output: string } | { ok: false; error: string } {
  try {
    const trimmed = source.trim()
    if (!trimmed) throw new Error('JSON gir: { "gamma": 0.8, "beta": 0.6, "edges": [...] }')

    let parsed: unknown
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      throw new Error('Geçerli JSON bekleniyor')
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('JSON nesnesi bekleniyor')
    }

    const obj = parsed as Record<string, unknown>
    if (obj.gamma === undefined) throw new Error('"gamma" gerekli')
    if (obj.beta === undefined) throw new Error('"beta" gerekli')
    if (!obj.edges) throw new Error('"edges" gerekli')

    const edges = parseEdges(obj.edges)
    const n = inferNodeCount(edges)
    const graph: UnweightedGraph = { nodes: n, edges }

    const gammaRaw = toNumberArray(obj.gamma, 'gamma')
    const betaRaw = toNumberArray(obj.beta, 'beta')
    const p = obj.p !== undefined ? Number(obj.p) : Math.max(gammaRaw.length, betaRaw.length, 1)
    if (!Number.isInteger(p) || p < 1) {
      throw new Error('"p" pozitif tam sayı olmalı')
    }

    const params = expandParams(gammaRaw, betaRaw, p)
    const { expectedCut, state } = runQaoaStatevector(graph, params)
    const hist = sampleComputationalBasis(state, 1024, n)
    const top = histogramToSortedEntries(hist).slice(0, 6)

    const lines = [
      `Graf: ${n} qubit, ${edges.length} kenar, p=${p}`,
      `γ = [${params.gamma.map((v) => v.toFixed(3)).join(', ')}]`,
      `β = [${params.beta.map((v) => v.toFixed(3)).join(', ')}]`,
      '',
      `Beklenen Max-Cut: ${expectedCut.toFixed(4)}`,
      '',
      'Histogram özeti (1024 shot simülasyon):',
      ...top.map(
        (e) =>
          `  ${e.label}  ${e.count} kez (${((100 * e.count) / 1024).toFixed(1)}%)`,
      ),
    ]

    return { ok: true, output: lines.join('\n') }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}
