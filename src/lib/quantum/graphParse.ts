import type { UnweightedGraph } from './qubo'

/** Parse edge DSL like "0-1,1-2,2-0" into a graph with inferred node count. */
export function parseEdgeList(
  input: string,
  minNodes = 3,
  maxNodes = 8,
): { graph: UnweightedGraph; error?: string } {
  const trimmed = input.trim()
  if (!trimmed) {
    return { graph: { nodes: minNodes, edges: [] }, error: 'Kenar listesi boş.' }
  }

  const edgeSet = new Set<string>()
  let maxNode = -1

  for (const part of trimmed.split(',')) {
    const token = part.trim()
    if (!token) continue
    const match = token.match(/^(\d+)\s*[-–]\s*(\d+)$/)
    if (!match) {
      return { graph: { nodes: minNodes, edges: [] }, error: `Geçersiz kenar: "${token}"` }
    }
    const i = Number(match[1])
    const j = Number(match[2])
    if (i === j) {
      return { graph: { nodes: minNodes, edges: [] }, error: 'Döngü kenarı desteklenmiyor.' }
    }
    maxNode = Math.max(maxNode, i, j)
    edgeSet.add(`${Math.min(i, j)}-${Math.max(i, j)}`)
  }

  const nodes = Math.max(minNodes, maxNode + 1)
  if (nodes > maxNodes) {
    return { graph: { nodes: minNodes, edges: [] }, error: `En fazla ${maxNodes} düğüm desteklenir.` }
  }

  const edges = [...edgeSet].map((k) => {
    const [a, b] = k.split('-').map(Number)
    return [a, b] as [number, number]
  })

  return { graph: { nodes, edges } }
}

export const GRAPH_PRESETS: Record<string, UnweightedGraph> = {
  square: {
    nodes: 4,
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
  },
  diamond: {
    nodes: 4,
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2],
    ],
  },
  pentagon: {
    nodes: 5,
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ],
  },
  triangle: {
    nodes: 3,
    edges: [
      [0, 1],
      [1, 2],
      [2, 0],
    ],
  },
}
