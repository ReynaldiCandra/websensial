export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Websensial logo" fill="none">
      <defs>
        <linearGradient id="ws-logo-g" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A58BFF" />
          <stop offset="0.5" stopColor="#6328F5" />
          <stop offset="1" stopColor="#4F6BFF" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="url(#ws-logo-g)" />
      <path
        d="M8.5 11.5l3 9 2.5-6 2.5 6 3-9"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="10" r="1.6" fill="#fff" opacity="0.9" />
    </svg>
  );
}
