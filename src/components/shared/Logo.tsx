import { Link } from "react-router-dom";
import { BRAND } from "../../data/config";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="logo" style={light ? { color: "var(--cream)" } : undefined}>
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#FF7A5C" />
        <rect x="18" y="14" width="30" height="36" rx="3" fill="#FFF8F0" />
        <rect x="14" y="14" width="6" height="36" rx="2" fill="#FFC857" />
        <line x1="26" y1="24" x2="42" y2="24" stroke="#FF7A5C" strokeWidth="3" strokeLinecap="round" />
        <line x1="26" y1="32" x2="42" y2="32" stroke="#FFC857" strokeWidth="3" strokeLinecap="round" />
        <line x1="26" y1="40" x2="36" y2="40" stroke="#7FB29A" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span>{BRAND.name}</span>
    </Link>
  );
}
