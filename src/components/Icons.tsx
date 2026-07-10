interface IconProps {
  className?: string;
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.06l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.2z" />
    </svg>
  );
}

export function GoogleGIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.45a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.58-5.15 3.58-8.71z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.86-3c-1.07.72-2.45 1.15-4.08 1.15-3.13 0-5.79-2.11-6.74-4.96H1.26v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.26 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.26a12 12 0 0 0 0 10.74l4-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.63l4 3.1C6.21 6.88 8.87 4.77 12 4.77z" />
    </svg>
  );
}

const paths: Record<string, JSX.Element> = {
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M20 14v.01M14 20h.01M17 17h.01M20 17v4M17 20h4" />
    </>
  ),
  chart: <path d="M3 3v18h18M8 15v3M13 10v8M18 6v12" />,
  reply: <path d="M9 17l-5-5 5-5M4 12h11a5 5 0 0 1 5 5v3" />,
  star: (
    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.36l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.5z" />
  ),
};

export function FeatureIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.star}
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
