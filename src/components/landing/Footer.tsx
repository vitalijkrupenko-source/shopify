import Logo from "../shared/Logo";
import { BRAND } from "../../data/config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div style={{ maxWidth: 280 }}>
            <Logo light />
            <p style={{ marginTop: 14, color: "#cfc9c0" }}>{BRAND.tagline}</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#how">How it works</a>
              <a href="#designs">Designs</a>
              <a href="#pricing">Pricing</a>
              <a href="/create">Make a book</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About us</a>
              <a href="#">Reviews</a>
              <a href="#">Gift cards</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-col">
              <h4>Help</h4>
              <a href="#faq">FAQ</a>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {BRAND.name}. Made with love for families. · Privacy · Terms
        </div>
      </div>
    </footer>
  );
}
