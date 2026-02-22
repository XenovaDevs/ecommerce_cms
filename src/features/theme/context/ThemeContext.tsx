/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  THEME_COOKIE_NAME,
  THEME_MEDIA_QUERY,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from '../constants'

const THEME_SET = new Set<ThemePreference>(THEME_PREFERENCES)
const CYCLE_ORDER: ThemePreference[] = ['system', 'dark', 'light']

const isThemePreference = (value: string | null): value is ThemePreference =>
  !!value && THEME_SET.has(value as ThemePreference)

const getCookiePreference = (): ThemePreference | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]*)`)
  )
  const rawValue = match?.[1] ? decodeURIComponent(match[1]) : null

  return isThemePreference(rawValue) ? rawValue : null
}

const getStoredPreference = (): ThemePreference => {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const fromStorage = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (isThemePreference(fromStorage)) {
    return fromStorage
  }

  const fromCookie = getCookiePreference()
  if (fromCookie) {
    return fromCookie
  }

  return 'system'
}

const getSystemResolvedTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

const resolveTheme = (
  preference: ThemePreference,
  systemTheme: ResolvedTheme
): ResolvedTheme => {
  if (preference === 'system') {
    return systemTheme
  }

  return preference
}

const applyThemeToDocument = (theme: ResolvedTheme) => {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

const persistThemePreference = (preference: ThemePreference) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  document.cookie = `${THEME_COOKIE_NAME}=${preference}; Path=/; Max-Age=31536000; SameSite=Lax`
}

export const initializeTheme = () => {
  const preference = getStoredPreference()
  const resolvedTheme = resolveTheme(preference, getSystemResolvedTheme())
  applyThemeToDocument(resolvedTheme)
}

interface ThemeContextValue {
  themePreference: ThemePreference
  resolvedTheme: ResolvedTheme
  setThemePreference: (value: ThemePreference) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() =>
    getStoredPreference()
  )
  const prefersDark = useMediaQuery(
    THEME_MEDIA_QUERY,
    getSystemResolvedTheme() === 'dark'
  )

  const systemTheme: ResolvedTheme = prefersDark ? 'dark' : 'light'

  const resolvedTheme = useMemo<ResolvedTheme>(
    () => resolveTheme(themePreference, systemTheme),
    [systemTheme, themePreference]
  )

  useEffect(() => {
    applyThemeToDocument(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    persistThemePreference(themePreference)
  }, [themePreference])

  const setThemePreference = useCallback((value: ThemePreference) => {
    setThemePreferenceState(value)
  }, [])

  const cycleTheme = useCallback(() => {
    setThemePreferenceState((current) => {
      const index = CYCLE_ORDER.indexOf(current)
      const nextTheme = CYCLE_ORDER[(index + 1) % CYCLE_ORDER.length]
      return nextTheme ?? 'system'
    })
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      themePreference,
      resolvedTheme,
      setThemePreference,
      cycleTheme,
    }),
    [cycleTheme, resolvedTheme, setThemePreference, themePreference]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
