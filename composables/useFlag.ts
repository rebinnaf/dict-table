export function useFlag() {
  const flags: Record<string, string> = {
    en: '🇬🇧',
    nl: '🇳🇱',
    fr: '🇫🇷',
    es: '🇪🇸',
    de: '🇩🇪',
    it: '🇮🇹',
    sv: '🇸🇪',
  }

  const getFlag = (langCode: string): string => {
    const code = langCode.toLowerCase().split('-')[0]
    return flags[code] ?? '🏳️'
  }

  const availableLanguages = Object.keys(flags)

  return { getFlag, availableLanguages }
}
