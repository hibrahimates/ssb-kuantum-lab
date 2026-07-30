import { maxCutValue, type UnweightedGraph } from '../quantum/qubo'

export interface LabJsResult {
  ok: true
  lines: string[]
}

export interface LabJsError {
  ok: false
  error: string
}

const FORBIDDEN =
  /\b(window|document|fetch|eval|Function|import|require|globalThis|self|top|parent|localStorage|sessionStorage|XMLHttpRequest|WebSocket|Worker|navigator|location|alert|confirm|prompt)\b/

function formatArg(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

function measure(prob1: number): 0 | 1 {
  const p = Number(prob1)
  if (Number.isNaN(p) || p < 0 || p > 1) {
    throw new Error('measure(prob1): prob1 0–1 arası olmalı')
  }
  return Math.random() < p ? 1 : 0
}

function hadamardToy(): { p0: number; p1: number } {
  return { p0: 0.5, p1: 0.5 }
}

function maxCutCost(bitstring: string, edges: [number, number][]): number {
  if (typeof bitstring !== 'string' || bitstring.length === 0) {
    throw new Error('maxCutCost(bitstring, edges): bitstring gerekli')
  }
  if (!Array.isArray(edges)) {
    throw new Error('maxCutCost(bitstring, edges): edges dizi olmalı')
  }
  const bits = bitstring.split('').map((c) => (c === '1' ? 1 : 0))
  const n = bits.length
  const graph: UnweightedGraph = { nodes: n, edges }
  return maxCutValue(graph, bits)
}

function shotsHistogram(prob1: number, shots: number): Record<string, number> {
  const p = Number(prob1)
  const s = Math.floor(Number(shots))
  if (Number.isNaN(p) || p < 0 || p > 1) {
    throw new Error('shotsHistogram(prob1, shots): prob1 0–1 arası olmalı')
  }
  if (!Number.isInteger(s) || s < 1) {
    throw new Error('shotsHistogram(prob1, shots): shots pozitif tam sayı olmalı')
  }
  const hist: Record<string, number> = { '0': 0, '1': 0 }
  for (let i = 0; i < s; i++) {
    const bit = measure(p)
    hist[String(bit)] += 1
  }
  return hist
}

export function runLabJs(source: string): LabJsResult | LabJsError {
  const code = source.trim()
  if (!code) {
    return { ok: false, error: 'Kod boş — starter kodu düzenleyip Çalıştır.' }
  }
  if (FORBIDDEN.test(code)) {
    return { ok: false, error: 'İzin verilmeyen anahtar kelime (window, fetch, eval, …).' }
  }

  const lines: string[] = []
  const print = (...args: unknown[]) => {
    lines.push(args.map(formatArg).join(' '))
  }

  try {
    const runner = new Function(
      'print',
      'measure',
      'hadamardToy',
      'maxCutCost',
      'shotsHistogram',
      `"use strict";\n${code}`,
    ) as (
      print: (...args: unknown[]) => void,
      measure: (prob1: number) => 0 | 1,
      hadamardToy: () => { p0: number; p1: number },
      maxCutCost: (bitstring: string, edges: [number, number][]) => number,
      shotsHistogram: (prob1: number, shots: number) => Record<string, number>,
    ) => void

    runner(print, measure, hadamardToy, maxCutCost, shotsHistogram)

    if (lines.length === 0) {
      lines.push('(çıktı yok — print(...) kullan)')
    }

    return { ok: true, lines }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}
