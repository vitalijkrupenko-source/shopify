import { Link } from "react-router-dom";
import Logo from "../shared/Logo";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Logo />
        <div className="nav-links">
          <a href="#how" className="nav-link">How it works</a>
          <a href="#designs" className="nav-link">Designs</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <Link to="/create" className="btn btn-primary">
            Make your book
          </Link>
        </div>
      </div>
    </nav>
  );
}
