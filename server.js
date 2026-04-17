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

    // 🧠 Init memory
    if (!memory[userId]) memory[userId] = [];

    // ➕ Add user message
    memory[userId].push({ role: "user", content: message });

    // 🧠 Ask AI what to do
    const aiResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant.

You can either:
- Call a tool using JSON
- OR reply normally in plain text

IMPORTANT RULES:
- Use JSON ONLY when calling a tool
- For normal conversation, reply in plain English
- Never wrap normal replies in JSON

Available actions:
1. get_crypto_price
2. get_weather
3. web_search

Examples:
Tool:
{"action":"get_weather","city":"Kolkata"}

Normal:
The weather in Kolkata is currently warm and humid.

When the user asks about crypto prices, ALWAYS extract:
- coin (like btc, eth, bitcoin, ethereum)
- currency (like usd, inr)

Examples:

User: btc to usd
→ {"action":"get_crypto_price","coin":"btc","currency":"usd"}

User: eth price in inr
→ {"action":"get_crypto_price","coin":"eth","currency":"inr"}

User: bitcoin price
→ {"action":"get_crypto_price","coin":"bitcoin","currency":"usd"}

IMPORTANT:
- Never leave coin or currency undefined
- Default currency = usd if not provided.
          `,
        },
        ...memory[userId],
      ],
    });

    const content = aiResponse.choices[0].message.content;

    let decision;
    try {
      decision = JSON.parse(content);
    } catch {
      memory[userId].push({ role: "assistant", content });
      return res.json({ reply: content });
    }

    // 🧠 Always sanitize output
    if (!decision || typeof decision !== "object") {
      return res.json({ reply: content });
    }

    let reply;

    // 🪙 Crypto
    if (decision.action === "get_crypto_price") {
      const price = await getCryptoPrice(decision.coin, decision.currency);

      reply = price
        ? `${decision.coin} price is ${price} ${decision.currency}`
        : `Couldn't fetch price for ${decision.coin}`;
    }

    // 🌦 Weather
    else if (decision.action === "get_weather") {
      decision.city = decision.city.trim();
      if (!decision.city) {
        return res.json({
          reply: "Please specify a city for weather.",
        });
      }

      const temp = await getWeather(decision.city);

      reply = temp
        ? `Temperature in ${decision.city} is ${temp}°C`
        : `Couldn't fetch weather for ${decision.city}`;
    }

    // 🌐 Web Search
    else if (decision.action === "web_search") {
      const result = await webSearch(decision.query);
      reply = result;
    }

    // 🤖 Normal reply
    else {
      reply = decision.message || content;
    }

    // 🧠 Save AI response
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
