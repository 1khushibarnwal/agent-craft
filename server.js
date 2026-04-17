import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const memory = {};

async function webSearch(query) {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${query}&format=json`,
    );
    const data = await res.json();
    return data.Abstract || data.Heading || "No result found";
  } catch {
    return "Search failed";
  }
}

const coinMap = {
  btc: "bitcoin",
  eth: "ethereum",
};

async function getCryptoPrice(coin, currency = "usd") {
  try {
    coin = coin.toLowerCase();
    currency = currency.toLowerCase();

    const normalizedCoin = coinMap[coin] || coin;

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${normalizedCoin}&vs_currencies=${currency}`,
    );

    const data = await res.json();
    return data[normalizedCoin]?.[currency];
  } catch {
    return null;
  }
}

async function getWeather(city) {
  const res = await fetch(`https://wttr.in/${city}?format=j1`);
  const data = await res.json();
  return data.current_condition[0].temp_C;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message, userId = "default" } = req.body;
    console.log("🔥 Incoming message:", message);

    if (!memory[userId]) memory[userId] = [];

    memory[userId].push({ role: "user", content: message });

    const lowerMsg = message.toLowerCase();

    // ===============================
    // STEP 1: HARD ROUTING (NO AI)
    // ===============================

    // 🌦 Weather (FORCED)
    if (lowerMsg.includes("temp") || lowerMsg.includes("weather")) {
      const cityMatch = message.match(/in ([a-zA-Z\s]+)/i);
      const city = cityMatch ? cityMatch[1].trim() : "Kolkata";

      const temp = await getWeather(city);

      const reply = temp
        ? `Temperature in ${city} is ${temp}°C`
        : `Couldn't fetch weather for ${city}`;

      memory[userId].push({ role: "assistant", content: reply });
      console.log("✅ WEATHER ROUTE TRIGGERED");
      return res.json({ reply });
    }

    // 🪙 Crypto (FORCED)
    if (
      lowerMsg.includes("btc") ||
      lowerMsg.includes("bitcoin") ||
      lowerMsg.includes("eth") ||
      lowerMsg.includes("ethereum")
    ) {
      let coin = "bitcoin";
      if (lowerMsg.includes("eth")) coin = "ethereum";

      let currency = "usd";
      if (lowerMsg.includes("inr")) currency = "inr";

      const price = await getCryptoPrice(coin, currency);

      const reply = price
        ? `${coin} price is ${price} ${currency}`
        : `Couldn't fetch price for ${coin}`;

      memory[userId].push({ role: "assistant", content: reply });
      return res.json({ reply });
    }

    // 🌐 Web Search (FORCED)
    if (
      lowerMsg.includes("latest") ||
      lowerMsg.includes("news") ||
      lowerMsg.includes("who is") ||
      lowerMsg.includes("what is")
    ) {
      const result = await webSearch(message);

      memory[userId].push({ role: "assistant", content: result });
      return res.json({ reply: result });
    }

    // ===============================
    // STEP 2: AI (ONLY CHAT)
    // ===============================

    const aiResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful conversational assistant.",
        },
        ...memory[userId],
      ],
    });

    const reply = aiResponse.choices[0].message.content;

    memory[userId].push({ role: "assistant", content: reply });

    return res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
