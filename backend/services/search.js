// Real, current web search via Tavily (built for LLM/agent use cases).
// Falls back to the old DuckDuckGo instant-answer lookup if no
// TAVILY_API_KEY is set, so the app still runs out of the box —
// though that fallback only works for topics with a Wikipedia-style
// infobox, not current-events questions.
export async function webSearch(query) {
  if (process.env.TAVILY_API_KEY) {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query,
          max_results: 1,
        }),
      });

      if (!res.ok) {
        console.error("Tavily search failed:", res.status, await res.text());
        return "Search failed";
      }

      const data = await res.json();
      return data.results?.[0]?.content || "No result found";
    } catch (err) {
      console.error("Tavily search error:", err);
      return "Search failed";
    }
  }

  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`,
    );
    const data = await res.json();
    return data.Abstract || data.Heading || "No result found";
  } catch {
    return "Search failed";
  }
}
