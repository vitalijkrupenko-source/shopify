import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { Lang } from "../i18n/translations";
import { StarIcon } from "./Icons";

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Revju">
      <span className="logo-mark">
        <StarIcon className="logo-star" />
      </span>
      <span className="logo-word">
        Rev<span className="logo-word-accent">ju</span>
      </span>
    </a>
  );
}

function LangSwitch() {
  const { lang, setLang } = useLanguage();
  const options: { code: Lang; label: string }[] = [
    { code: "sl", label: "SL" },
    { code: "en", label: "EN" },
  ];
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {options.map((o) => (
        <button
          key={o.code}
          className={"lang-btn" + (lang === o.code ? " is-active" : "")}
          onClick={() => setLang(o.code)}
          aria-pressed={lang === o.code}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#how", label: t.nav.howItWorks },
    { href: "#features", label: t.nav.features },
    { href: "#results", label: t.nav.results },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#faq", label: t.nav.faq },
  ];

  return (
    <header className={"nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="nav-inner">
        <Logo />
        <nav className="nav-links" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <LangSwitch />
          <a href="#" className="nav-login">
            {t.nav.login}
          </a>
          <a href="#pricing" className="btn btn-primary btn-sm">
            {t.nav.cta}
          </a>
          <button
            className="nav-toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {open && (
        <div className="nav-mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="#pricing"
            className="btn btn-primary"
            onClick={() => setOpen(false)}
          >
            {t.nav.cta}
          </a>
        </div>
      )}
    </header>
  );
}
