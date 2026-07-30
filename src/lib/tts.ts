let utterance: SpeechSynthesisUtterance | null = null
let paused = false

function synthAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}

function pickTurkishVoice(): SpeechSynthesisVoice | undefined {
  if (!synthAvailable()) return undefined
  const voices = speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === 'tr-TR') ??
    voices.find((v) => v.lang.startsWith('tr')) ??
    voices.find((v) => v.lang.startsWith('en'))
  )
}

function ensureVoicesLoaded(): void {
  if (!synthAvailable()) return
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.getVoices()
  }
}

export function isSpeaking(): boolean {
  if (!synthAvailable()) return false
  return speechSynthesis.speaking && !speechSynthesis.paused
}

export function isPaused(): boolean {
  if (!synthAvailable()) return false
  return speechSynthesis.paused
}

export function speak(text: string): void {
  if (!synthAvailable()) return
  stopSpeaking()
  ensureVoicesLoaded()

  utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'tr-TR'
  utterance.rate = 0.95
  const voice = pickTurkishVoice()
  if (voice) utterance.voice = voice

  utterance.onend = () => {
    paused = false
    utterance = null
  }
  utterance.onerror = () => {
    paused = false
    utterance = null
  }

  paused = false
  speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (!synthAvailable()) return
  speechSynthesis.cancel()
  paused = false
  utterance = null
}

export function pauseSpeaking(): void {
  if (!synthAvailable()) return
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause()
    paused = true
  }
}

export function resumeSpeaking(): void {
  if (!synthAvailable()) return
  if (speechSynthesis.paused) {
    speechSynthesis.resume()
    paused = false
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
  return paused
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  speechSynthesis.onvoiceschanged = () => {
    pickTurkishVoice()
  }
}
