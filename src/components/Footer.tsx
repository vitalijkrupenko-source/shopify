import { useLanguage } from "../i18n/LanguageContext";
import { Logo } from "./Nav";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;
  const cols = [
    { title: f.productTitle, links: f.productLinks },
    { title: f.companyTitle, links: f.companyLinks },
    { title: f.legalTitle, links: f.legalLinks },
  ];
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>{f.tagline}</p>
        </div>
        <div className="footer-cols">
          {cols.map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Revju. {f.rights}
        </span>
        <span className="footer-made">Ljubljana · Slovenija</span>
      </div>
    </footer>
  );
}
