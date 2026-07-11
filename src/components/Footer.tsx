import { useLanguage } from "../i18n/LanguageContext";
import { Logo } from "./Nav";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>{f.desc}</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>{f.linksTitle}</h4>
            <ul>
              {f.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>{f.legalTitle}</h4>
            <ul>
              {f.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>{f.companyTitle}</h4>
            <p className="footer-pending">{f.companyPending}</p>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Revju. {f.rights}
        </span>
        <span className="footer-made">{f.madeIn}</span>
      </div>
    </footer>
  );
}
