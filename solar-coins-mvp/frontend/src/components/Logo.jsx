export default function Logo({ size = 40, showText = true, textSize = "md" }) {
  const textSizes = {
    sm: { main: "0.85rem", sub: "0.55rem" },
    md: { main: "1rem",    sub: "0.62rem" },
    lg: { main: "1.3rem",  sub: "0.75rem" },
    xl: { main: "1.8rem",  sub: "0.9rem"  },
  };
  const ts = textSizes[textSize] || textSizes.md;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.18 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <radialGradient id="soleil" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
          <linearGradient id="chemin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + Math.cos(rad) * 29;
          const y1 = 50 + Math.sin(rad) * 29;
          const x2 = 50 + Math.cos(rad) * 38;
          const y2 = 50 + Math.sin(rad) * 38;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />;
        })}
        <circle cx="50" cy="50" r="22" fill="url(#soleil)" />
        <path d="M 57 57 Q 72 64 78 78" stroke="url(#chemin)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
        <circle cx="78" cy="78" r="5.5" fill="#06B6D4" />
        <circle cx="78" cy="78" r="9" fill="#06B6D4" fillOpacity="0.25" />
      </svg>
      {showText && (
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: "bold", letterSpacing: "1.5px" }}>
            <span style={{ color: "#7C3AED", fontSize: ts.main }}>SOL</span>
            <span style={{ color: "#F59E0B", fontSize: ts.main }}>PATH</span>
          </div>
          <div style={{ fontSize: ts.sub, letterSpacing: "2.5px", color: "#475569" }}>
            by NEXCID
          </div>
        </div>
      )}
    </div>
  );
}