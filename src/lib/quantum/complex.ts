/** Minimal complex number helpers for statevector math. */

export interface Complex {
  re: number
  im: number
}

export const C = {
  zero: (): Complex => ({ re: 0, im: 0 }),
  one: (): Complex => ({ re: 1, im: 0 }),
  fromPolar: (r: number, phi: number): Complex => ({
    re: r * Math.cos(phi),
    im: r * Math.sin(phi),
  }),
  add: (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im }),
  sub: (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im }),
  mul: (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }),
  scale: (a: Complex, s: number): Complex => ({ re: a.re * s, im: a.im * s }),
  conj: (a: Complex): Complex => ({ re: a.re, im: -a.im }),
  abs2: (a: Complex): number => a.re * a.re + a.im * a.im,
  abs: (a: Complex): number => Math.sqrt(C.abs2(a)),
  exp: (iPhase: number): Complex => ({ re: Math.cos(iPhase), im: Math.sin(iPhase) }),
}

export function normalizeAmps(amps: Complex[]): Complex[] {
  const norm = Math.sqrt(amps.reduce((s, a) => s + C.abs2(a), 0))
  if (norm < 1e-12) return amps.map(() => C.zero())
  return amps.map((a) => C.scale(a, 1 / norm))
}
