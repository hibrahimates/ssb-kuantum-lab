import {
  bestClassicalQubo,
  bitsToLabel,
  maxCutToQubo,
  type UnweightedGraph,
} from '../quantum/qubo'

export interface QuboConfigInput {
  edges: [number, number][]
  n?: number
}

function parseEdges(raw: unknown): [number, number][] {
  if (!Array.isArray(raw)) {
    throw new Error('Kenar listesi dizi olmalı: [[0,1],[1,2],...]')
  }
  const edges: [number, number][] = []
  for (const item of raw) {
    if (!Array.isArray(item) || item.length < 2) {
      throw new Error('Her kenar [i,j] çifti olmalı')
    }
    const i = Number(item[0])
    const j = Number(item[1])
    if (!Number.isInteger(i) || !Number.isInteger(j) || i < 0 || j < 0) {
      throw new Error(`Geçersiz kenar: [${item[0]}, ${item[1]}]`)
    }
    if (i === j) continue
    edges.push([i, j])
  }
  if (edges.length === 0) {
    throw new Error('En az bir kenar gerekli')
  }
  return edges
}

function inferNodeCount(edges: [number, number][], n?: number): number {
  if (n !== undefined) {
    const nodes = Number(n)
    if (!Number.isInteger(nodes) || nodes < 1) {
      throw new Error('"n" pozitif tam sayı olmalı')
    }
    return nodes
  }
  let max = 0
  for (const [i, j] of edges) {
    max = Math.max(max, i, j)
  }
  return max + 1
}

function parseInput(source: string): QuboConfigInput {
  const trimmed = source.trim()
  if (!trimmed) {
    throw new Error('JSON veya kenar listesi gir')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new Error('Geçerli JSON bekleniyor: { "edges": [[0,1],...], "n": 3 }')
  }

  if (Array.isArray(parsed)) {
    const edges = parseEdges(parsed)
    return { edges, n: inferNodeCount(edges) }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('JSON nesnesi veya kenar dizisi bekleniyor')
  }

  const obj = parsed as Record<string, unknown>
  if (!obj.edges) {
    throw new Error('"edges" alanı gerekli')
  }

  const edges = parseEdges(obj.edges)
  const n = obj.n !== undefined ? inferNodeCount(edges, Number(obj.n)) : inferNodeCount(edges)
  return { edges, n }
}

function formatMatrix(Q: number[][]): string {
  const lines = Q.map((row, i) =>
    row.map((v) => String(v).padStart(4)).join(' ') + `  // satır ${i}`,
  )
  return lines.join('\n')
}

export function runQuboConfig(source: string): { ok: true; output: string } | { ok: false; error: string } {
  try {
    const { edges, n } = parseInput(source)
    const graph: UnweightedGraph = { nodes: n!, edges }
    const Q = maxCutToQubo(graph)
    const best = bestClassicalQubo(Q, graph)
    const label = bitsToLabel(best.bits)

    const output = [
      `Graf: ${n} düğüm, ${edges.length} kenar`,
      `Kenarlar: ${edges.map(([a, b]) => `[${a},${b}]`).join(', ')}`,
      '',
      'Q matrisi (Max-Cut → minimize):',
      formatMatrix(Q),
      '',
      `En iyi bitstring: ${label}`,
      `QUBO maliyeti: ${best.quboCost}`,
      `Max-Cut değeri: ${best.cutValue}`,
    ].join('\n')

    return { ok: true, output }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}
