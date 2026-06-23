const ITEMS = [
  "Next.js 15",
  "Supabase",
  "Claude · Anthropic",
  "Vercel",
  "Stripe",
  "Cal.com",
  "n8n",
  "WAHA · WhatsApp API",
  "Tailwind",
  "TypeScript",
  "Cloudinary",
  "Wisp CMS",
];

export function Marquee() {
  // Duplicated track for a seamless loop.
  const track = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {track.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <span className="marquee-item">{item}</span>
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
