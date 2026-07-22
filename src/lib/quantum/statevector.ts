import { C, normalizeAmps, type Complex } from './complex'

/** Single-qubit state |ψ⟩ = α|0⟩ + β|1⟩. */
export interface QubitState {
  alpha: Complex
  beta: Complex
}

export interface BlochCoords {
  x: number
  y: number
  z: number
}

export function qubitFromAngles(theta: number, phi: number): QubitState {
  const half = theta / 2
  return {
    alpha: C.fromPolar(Math.cos(half), 0),
    beta: C.fromPolar(Math.sin(half), phi),
  }
}

export function probZero(state: QubitState): number {
  return C.abs2(state.alpha)
}

export function probOne(state: QubitState): number {
  return C.abs2(state.beta)
}

export function blochCoords(state: QubitState): BlochCoords {
  const aConj = C.conj(state.alpha)
  const z = probZero(state) - probOne(state)
  const axb = C.mul(aConj, state.beta)
  return { x: 2 * axb.re, y: 2 * axb.im, z }
}

/** Born-rule measurement: returns 0 or 1 and collapsed state. */
export function measureQubit(state: QubitState, rng = Math.random()): {
  outcome: 0 | 1
  collapsed: QubitState
} {
  const p0 = probZero(state)
  if (rng < p0) {
    return { outcome: 0, collapsed: { alpha: C.one(), beta: C.zero() } }
  }
  return { outcome: 1, collapsed: { alpha: C.zero(), beta: C.one() } }
}

/** Two-qubit statevector in |00⟩,|01⟩,|10⟩,|11⟩ order (4 amplitudes). */
export type TwoQubitAmps = [Complex, Complex, Complex, Complex]

export function createProductState(a: QubitState, b: QubitState): TwoQubitAmps {
  return [
    C.mul(a.alpha, b.alpha),
    C.mul(a.alpha, b.beta),
    C.mul(a.beta, b.alpha),
    C.mul(a.beta, b.beta),
  ]
}

/** Bell state |Φ⁺⟩ = (|00⟩ + |11⟩) / √2 */
export function createBellState(): TwoQubitAmps {
  const invSqrt2 = 1 / Math.sqrt(2)
  return [
    C.fromPolar(invSqrt2, 0),
    C.zero(),
    C.zero(),
    C.fromPolar(invSqrt2, 0),
  ]
}

export function twoQubitProbabilities(amps: TwoQubitAmps): [number, number, number, number] {
  return amps.map((a) => C.abs2(a)) as [number, number, number, number]
}

export function measureTwoQubit(amps: TwoQubitAmps, rng = Math.random()): {
  outcome: 0 | 1 | 2 | 3
  label: string
  collapsed: TwoQubitAmps
} {
  const probs = twoQubitProbabilities(amps)
  let r = rng
  for (let i = 0; i < 4; i++) {
    r -= probs[i]
    if (r <= 0) {
      const collapsed: TwoQubitAmps = [C.zero(), C.zero(), C.zero(), C.zero()]
      collapsed[i] = C.one()
      return { outcome: i as 0 | 1 | 2 | 3, label: i.toString(2).padStart(2, '0'), collapsed }
    }
  }
  const collapsed: TwoQubitAmps = [C.zero(), C.zero(), C.zero(), C.zero()]
  collapsed[3] = C.one()
  return { outcome: 3, label: '11', collapsed }
}

/** N-qubit statevector, |0…0⟩ index 0. */
export function createUniformSuperposition(n: number): Complex[] {
  const dim = 1 << n
  const amp = 1 / Math.sqrt(dim)
  return Array.from({ length: dim }, () => ({ re: amp, im: 0 }))
}

export function applyPhase(state: Complex[], index: number, phase: number): Complex[] {
  const next = state.map((a) => ({ ...a }))
  next[index] = C.mul(next[index], C.exp(phase))
  return next
}

/** Max-Cut cost layer: exp(-i γ (I − Z_i Z_j) / 2) on one edge. */
export function applyMaxCutCostEdge(
  state: Complex[],
  n: number,
  i: number,
  j: number,
  gamma: number,
): Complex[] {
  const dim = state.length
  const next = state.map((a) => ({ ...a }))
  for (let idx = 0; idx < dim; idx++) {
    const xi = (idx >> (n - 1 - i)) & 1
    const xj = (idx >> (n - 1 - j)) & 1
    const zz = xi === xj ? 1 : -1
    const phase = (-gamma * (1 - zz)) / 2
    next[idx] = C.mul(next[idx], C.exp(phase))
  }
  return next
}

/** Apply Rx(2β) = exp(-i β X) on qubit `q` (0 = leftmost in bitstring). */
export function applyRx(state: Complex[], n: number, q: number, beta: number): Complex[] {
  const dim = state.length
  const next = state.map((a) => ({ ...a }))
  const mask = 1 << (n - 1 - q)
  const c = Math.cos(beta)
  const s = Math.sin(beta)

  for (let idx = 0; idx < dim; idx++) {
    if ((idx & mask) !== 0) continue
    const j = idx | mask
    const a0 = state[idx]
    const a1 = state[j]
    next[idx] = C.add(C.scale(a0, c), C.mul({ re: 0, im: -s }, a1))
    next[j] = C.add(C.mul({ re: 0, im: -s }, a0), C.scale(a1, c))
  }
  return next
}

/** Hadamard on qubit q. */
export function applyHadamard(state: Complex[], n: number, q: number): Complex[] {
  const dim = state.length
  const next = state.map((a) => ({ ...a }))
  const mask = 1 << (n - 1 - q)
  const invSqrt2 = 1 / Math.sqrt(2)

  for (let idx = 0; idx < dim; idx++) {
    if ((idx & mask) !== 0) continue
    const j = idx | mask
    const a0 = state[idx]
    const a1 = state[j]
    next[idx] = C.scale(C.add(a0, a1), invSqrt2)
    next[j] = C.scale(C.sub(a0, a1), invSqrt2)
  }
  return next
}

export function applyHadamardAll(state: Complex[], n: number): Complex[] {
  let s = state
  for (let q = 0; q < n; q++) {
    s = applyHadamard(s, n, q)
  }
  return s
}

export { normalizeAmps, type Complex }
