import { ref } from 'vue'

const STORAGE_KEY = 'bookiosk-theme'
const savedTheme = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
const isDark = ref(savedTheme ? savedTheme === 'dark' : Boolean(prefersDark))

function applyTheme() {
  if (typeof document === 'undefined') return
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  window.localStorage.setItem(STORAGE_KEY, theme)
}

export function initializeTheme() {
  applyTheme()
}

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
  }
  return { isDark, toggleTheme }
}
