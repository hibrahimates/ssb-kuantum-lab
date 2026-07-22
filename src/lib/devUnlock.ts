import { notifyProgressChange } from './progress'

/** Klavyeyle yazınca tüm modül kilitlerini aç/kapa (ilerlemeyi değiştirmez). */
export const DEV_UNLOCK_PASSWORD = 'Ankara'

const SESSION_KEY = 'kuantum-lab-dev-unlock'

let unlockAll = readSession()
let buffer = ''

function readSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function writeSession(active: boolean): void {
  try {
    if (active) sessionStorage.setItem(SESSION_KEY, '1')
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore quota / private mode */
  }
}

export function isDevUnlockActive(): boolean {
  return unlockAll
}

export function setDevUnlockActive(active: boolean): void {
  if (unlockAll === active) return
  unlockAll = active
  writeSession(active)
  notifyProgressChange()
  window.dispatchEvent(
    new CustomEvent('kuantum-lab-dev-unlock', { detail: { active } }),
  )
}

export function toggleDevUnlock(): boolean {
  setDevUnlockActive(!unlockAll)
  return unlockAll
}

function isTypingInField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return Boolean(target.closest('[contenteditable="true"]'))
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.metaKey || event.ctrlKey || event.altKey) return
  if (isTypingInField(event.target)) {
    buffer = ''
    return
  }

  if (event.key === 'Backspace') {
    buffer = buffer.slice(0, -1)
    return
  }

  if (event.key.length !== 1) return

  buffer = (buffer + event.key).slice(-DEV_UNLOCK_PASSWORD.length)
  if (buffer === DEV_UNLOCK_PASSWORD) {
    buffer = ''
    toggleDevUnlock()
  }
}

let listening = false

/** Uygulama genelinde bir kez dinleyici kur. */
export function installDevUnlockListener(): () => void {
  if (listening) return () => undefined
  listening = true
  unlockAll = readSession()
  window.addEventListener('keydown', onKeyDown)
  return () => {
    window.removeEventListener('keydown', onKeyDown)
    listening = false
  }
}
