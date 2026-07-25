import { Router } from "express";
import { getHistory, addMessage } from "../memory.js";
import { getWeather } from "../services/weather.js";
import { getCryptoPrice, resolveCoin, resolveCurrency } from "../services/crypto.js";
import { webSearch } from "../services/search.js";
import { getAIReply } from "../services/groq.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { message, userId = "default" } = req.body;
    console.log("🔥 Incoming message:", message);

    addMessage(userId, "user", message);
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

      addMessage(userId, "assistant", reply);
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
      const coin = resolveCoin(lowerMsg);
      const currency = resolveCurrency(lowerMsg);
      const price = await getCryptoPrice(coin, currency);

      const reply = price
        ? `${coin} price is ${price} ${currency}`
        : `Couldn't fetch price for ${coin}`;

      addMessage(userId, "assistant", reply);
      return res.json({ reply });
    }

    // 🌐 Web Search (FORCED)
    if (
      lowerMsg.includes("latest") ||
      lowerMsg.includes("news") ||
      lowerMsg.includes("who is") ||
      lowerMsg.includes("what is")
    ) {
      const reply = await webSearch(message);
      addMessage(userId, "assistant", reply);
      return res.json({ reply });
    }

    // ===============================
    // STEP 2: AI (ONLY CHAT)
    // ===============================

    const reply = await getAIReply(getHistory(userId));
    addMessage(userId, "assistant", reply);
    return res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

export default router;
