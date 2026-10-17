import { getContext, setContext } from 'svelte';

export type Language = 'en' | 'ar' | 'he';

export const languageOptions: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic (العربية)' },
  { value: 'he', label: 'Hebrew (עברית)' },
];

/** The language an RTL preview shows. Its language selector sets `current`. */
export class PreviewLanguage {
  current = $state<Language>('ar');

  constructor(language: Language) {
    this.current = language;
  }

  get dir() {
    return this.current === 'en' ? 'ltr' : 'rtl';
  }
}

const KEY = Symbol('preview-language');

/** Upstream's `LanguageProvider`: the RTL `ComponentPreview` shares one language with its example. */
export function setPreviewLanguage(language: Language = 'ar') {
  return setContext(KEY, new PreviewLanguage(language));
}

/** Upstream's `useTranslation`, without the lookup: the preview's language, or `defaultLanguage` outside a preview. */
export function useLanguage(defaultLanguage: Language = 'ar') {
  return getContext<PreviewLanguage | undefined>(KEY) ?? new PreviewLanguage(defaultLanguage);
}
