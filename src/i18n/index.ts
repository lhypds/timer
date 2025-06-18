import i18n from 'i18next';
import { DEFAULT_LOCALE, LOCALE_LIST } from '@/constants/locale';
import { initReactI18next } from 'react-i18next';
import enText from './lang/en';
import jaText from './lang/ja';
import koText from './lang/ko';
import zhText from './lang/zh';
import ztText from './lang/zt';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

export const resources = {
  en: {
    translation: {
      ...enText
    }
  },
  ja: {
    translation: {
      ...jaText
    }
  },
  ko: {
    translation: {
      ...koText
    }
  },
  zh: {
    translation: {
      ...zhText
    }
  },
  zt: {
    translation: {
      ...ztText
    }
  }
} as const;

void i18n.use(initReactI18next).init({
  lng: DEFAULT_LOCALE,
  returnNull: false,
  resources
});

export function setLocale(locale: string): string {
  void i18n.changeLanguage(locale);
  document.documentElement.setAttribute('lang', locale);
  localStorage.setItem('locale', locale);
  return locale;
}

function getLocaleParams() {
  const searchParams = new URLSearchParams(location.search);
  const lang = searchParams.get('lang') || '';
  if (LOCALE_LIST.includes(lang)) {
    return lang;
  }
}

(() => {
  const defaultLocale =
    getLocaleParams() || localStorage.getItem('locale') || DEFAULT_LOCALE;
  setLocale(defaultLocale);
})();

export default i18n;
