// Mirrors the keyword rules in server.js (see the "Hard Routing" step)
// purely so the UI can label how a reply was produced. The backend has
// already made the real decision by the time this runs — this is cosmetic.
export function getResponseSource(message) {
  const m = message.toLowerCase();

  if (m.includes("temp") || m.includes("weather")) return "weather";
  if (
    m.includes("btc") ||
    m.includes("bitcoin") ||
    m.includes("eth") ||
    m.includes("ethereum")
  )
    return "crypto";
  if (
    m.includes("latest") ||
    m.includes("news") ||
    m.includes("who is") ||
    m.includes("what is")
  )
    return "search";

  return "ai";
}

export const SOURCE_LABELS = {
  weather: { label: "Weather", icon: "⚡" },
  crypto: { label: "Crypto", icon: "⚡" },
  search: { label: "Search", icon: "⚡" },
  ai: { label: "AI", icon: "✦" },
};
