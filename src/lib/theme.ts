export type ThemeId = 'midnight' | 'soft' | 'paper'

export interface ThemeOption {
  id: ThemeId
  label: string
  description: string
}

export const THEMES: ThemeOption[] = [
  {
    id: 'midnight',
    label: 'Gece',
    description: 'Lacivert + cyan — mevcut sahne',
  },
  {
    id: 'soft',
    label: 'Yumuşak',
    description: 'Göz yormayan düşük kontrast koyu',
  },
  {
    id: 'paper',
    label: 'Kağıt',
    description: 'Açık, sıcak okuma yüzeyi',
  },
]

const STORAGE_KEY = 'kuantum-lab-theme'

export function getStoredTheme(): ThemeId {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'midnight' || v === 'soft' || v === 'paper') return v
  } catch {
    /* ignore */
  }
  return 'midnight'
}

export function applyTheme(theme: ThemeId): void {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}

export function initTheme(): ThemeId {
  const theme = getStoredTheme()
  applyTheme(theme)
  return theme
}
