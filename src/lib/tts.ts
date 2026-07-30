/** Türkçe TTS — teknik terimleri fonetik okutur; cümle kuyruğu ile daha doğal akar. */

let queue: string[] = []
let active: SpeechSynthesisUtterance | null = null
let onQueueDone: (() => void) | null = null
let onChunkStart: ((index: number, total: number) => void) | null = null
let chunkIndex = 0

/** İngilizce/teknik kelimeler → Türkçe ses motorunun okuyabileceği biçim */
const PRONUNCIATIONS: [RegExp, string][] = [
  [/\b[Hh]ackathon\b/g, 'hakaton'],
  [/\bhackathon'?da\b/gi, 'hakatonda'],
  [/\bhackathon'?un\b/gi, 'hakatonun'],
  [/\bhackathon'?a\b/gi, 'hakatona'],
  [/\bQUBO\b/g, 'kübo'],
  [/\bQAOA\b/g, 'kaoa'],
  [/\bVQE\b/g, 'vi kyu i'],
  [/\bNISQ\b/g, 'nisk'],
  [/\bIBM\b/g, 'ay bi em'],
  [/\bQiskit\b/gi, 'kiskit'],
  [/\bAer\b/g, 'eyır'],
  [/\bOpen Plan\b/gi, 'open plan'],
  [/\bMax-?Cut\b/gi, 'maks kat'],
  [/\bqubit\b/gi, 'kübit'],
  [/\bqubits\b/gi, 'kübitler'],
  [/\bQubit\b/g, 'Kübit'],
  [/\bshot'?lar?\b/gi, 'şotlar'],
  [/\bshots?\b/gi, 'şot'],
  [/\btranspile\b/gi, 'transpayl'],
  [/\bbackend\b/gi, 'bekend'],
  [/\bfake backends?\b/gi, 'feyk bekend'],
  [/\bansatz\b/gi, 'anzats'],
  [/\bmixer\b/gi, 'miksir'],
  [/\bHamiltonian\b/gi, 'hamiltoniyen'],
  [/\bIsing\b/g, 'ayzing'],
  [/\bSampler\b/g, 'sempler'],
  [/\bEstimator\b/g, 'estimatör'],
  [/\bRuntime\b/g, 'rantaym'],
  [/\bAPI\b/g, 'ey pi ay'],
  [/\bentanglement\b/gi, 'dolaşıklık'],
  [/\bentangled\b/gi, 'dolaşık'],
  [/\bentangle\b/gi, 'dolaş'],
  [/\bsuperposition\b/gi, 'süperpozisyon'],
  [/\bdecoherence\b/gi, 'dekohörens'],
  [/\bplayground\b/gi, 'pleygraund'],
  [/\bchecklist\b/gi, 'çeklist'],
  [/\bnotebook\b/gi, 'notbuk'],
  [/\bYouTube\b/g, 'yutub'],
  [/\bTRUBA\b/g, 'truba'],
  [/\bSSB\b/g, 'se se be'],
  [/\bpip\b/g, 'pip'],
  [/\bvenv\b/g, 'vi env'],
  [/\bPython\b/g, 'payton'],
  [/\bJSON\b/g, 'ceyson'],
  [/\bURL\b/g, 'yu ar el'],
  [/\|0⟩/g, 'sıfır ket'],
  [/\|1⟩/g, 'bir ket'],
  [/⟨[^⟩]+⟩/g, 'beklenti değeri'],
  [/γ/g, 'gama'],
  [/β/g, 'beta'],
  [/θ/g, 'teta'],
  [/φ/g, 'fi'],
  [/α/g, 'alfa'],
  [/%(\d+)/g, 'yüzde $1'],
  [/\b(\d+)×(\d+)\b/g, '$1 çarpı $2'],
  [/→/g, ' ok '],
  [/—/g, ', '],
  [/–/g, ', '],
  [/`[^`]+`/g, ''],
  [/\bhttps?:\/\/\S+/gi, ''],
]

function synthAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}

/** macOS/Windows’taki daha doğal Türkçe sesleri tercih et */
function pickTurkishVoice(): SpeechSynthesisVoice | undefined {
  if (!synthAvailable()) return undefined
  const voices = speechSynthesis.getVoices()
  if (voices.length === 0) return undefined

  const preferredNames = [
    'yelda',
    'tolga',
    'emel',
    'microsoft alp',
    'microsoft emel',
    'google türkçe',
    'google turkish',
    'turkish',
  ]

  const byName = voices.find((v) => {
    const n = v.name.toLowerCase()
    return preferredNames.some((p) => n.includes(p)) && (v.lang.startsWith('tr') || n.includes('turkish'))
  })
  if (byName) return byName

  return (
    voices.find((v) => v.lang === 'tr-TR' && !/compact|eloquence/i.test(v.name)) ??
    voices.find((v) => v.lang === 'tr-TR') ??
    voices.find((v) => v.lang.startsWith('tr'))
  )
}

export function prepareSpeechText(raw: string): string {
  let text = raw
  for (const [pattern, replacement] of PRONUNCIATIONS) {
    text = text.replace(pattern, replacement)
  }
  // Markdown / jargon artıkları
  text = text
    .replace(/[*_#~]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim()
  return text
}

function splitIntoChunks(text: string): string[] {
  const prepared = prepareSpeechText(text)
  if (!prepared) return []
  const parts = prepared
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
  // Çok uzun parçaları virgülde böl
  const chunks: string[] = []
  for (const part of parts) {
    if (part.length <= 220) {
      chunks.push(part)
      continue
    }
    const sub = part.split(/(?<=[,;:])\s+/)
    let buf = ''
    for (const s of sub) {
      if ((buf + ' ' + s).trim().length > 200) {
        if (buf) chunks.push(buf.trim())
        buf = s
      } else {
        buf = (buf + ' ' + s).trim()
      }
    }
    if (buf) chunks.push(buf.trim())
  }
  return chunks.length > 0 ? chunks : [prepared]
}

function speakNext(): void {
  if (!synthAvailable()) return
  if (queue.length === 0) {
    active = null
    const done = onQueueDone
    onQueueDone = null
    onChunkStart = null
    done?.()
    return
  }

  const text = queue.shift()!
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'tr-TR'
  utter.rate = 0.88
  utter.pitch = 1.02
  utter.volume = 1
  const voice = pickTurkishVoice()
  if (voice) {
    utter.voice = voice
    utter.lang = voice.lang || 'tr-TR'
  }

  active = utter
  const idx = chunkIndex
  chunkIndex += 1
  onChunkStart?.(idx, idx + queue.length + 1)

  utter.onend = () => {
    if (active === utter) speakNext()
  }
  utter.onerror = () => {
    if (active === utter) {
      queue = []
      active = null
      const done = onQueueDone
      onQueueDone = null
      onChunkStart = null
      done?.()
    }
  }

  speechSynthesis.speak(utter)
}

export type SpeakOptions = {
  onDone?: () => void
  onChunkStart?: (index: number, total: number) => void
}

export function speak(text: string, options?: SpeakOptions): void {
  if (!synthAvailable()) {
    options?.onDone?.()
    return
  }
  stopSpeaking()
  const chunks = splitIntoChunks(text)
  if (chunks.length === 0) {
    options?.onDone?.()
    return
  }
  queue = [...chunks]
  chunkIndex = 0
  onQueueDone = options?.onDone ?? null
  onChunkStart = options?.onChunkStart ?? null
  // Bazı tarayıcılarda cancel sonrası hemen speak yutulur
  window.setTimeout(() => speakNext(), 40)
}

export function isSpeaking(): boolean {
  if (!synthAvailable()) return false
  return speechSynthesis.speaking && !speechSynthesis.paused
}

export function isPaused(): boolean {
  if (!synthAvailable()) return false
  return speechSynthesis.paused
}

export function stopSpeaking(): void {
  if (!synthAvailable()) return
  queue = []
  active = null
  onQueueDone = null
  onChunkStart = null
  chunkIndex = 0
  speechSynthesis.cancel()
}

export function pauseSpeaking(): void {
  if (!synthAvailable()) return
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause()
  }
}

export function resumeSpeaking(): void {
  if (!synthAvailable()) return
  if (speechSynthesis.paused) {
    speechSynthesis.resume()
  }
}

export function togglePauseSpeaking(): boolean {
  if (!synthAvailable()) return false
  if (speechSynthesis.paused) {
    resumeSpeaking()
    return false
  }
  if (speechSynthesis.speaking) {
    pauseSpeaking()
    return true
  }
  return false
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  speechSynthesis.onvoiceschanged = () => {
    pickTurkishVoice()
  }
}
