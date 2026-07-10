import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Lang, Translation, translations } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "revju-lang";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "sl";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "sl" || stored === "en") return stored;
  // This is a Slovenian business, so Slovenian is the default. English
  // visitors can switch with one click and the choice is remembered.
  return "sl";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang].meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", translations[lang].meta.description);
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
