import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

async function getCryptoPrice(coin, currency = "usd") {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`,
    );
    const data = await res.json();
    return data[coin]?.[currency];
  } catch (err) {
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

const tools = [
  {
    type: "function",
    function: {
      name: "get_crypto_price",
      description: "Get the current price of a cryptocurrency",
      parameters: {
        type: "object",
        properties: {
          coin: {
            type: "string",
            description: "Name of the coin (bitcoin, ethereum, etc)",
          },
        },
        required: ["coin"],
      },
    },
  },
];

// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const lowerMsg = message.toLowerCase();

//     if (
//       lowerMsg.includes("bitcoin") ||
//       lowerMsg.includes("eth") ||
//       lowerMsg.includes("ethereum")
//     ) {
//       const response = await fetch(
//         "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr",
//       );
//       const data = await response.json();

//       return res.json({
//         reply: `1 ETH = ₹${data.ethereum.inr} (live price)`,
//       });
//     }

//     // 🤖 Otherwise use AI
//     const response = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful assistant.",
//         },
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//       model: "llama-3.1-8b-instant",
//     });

//     res.json({
//       reply: response.choices[0].message.content,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error");
//   }
// });

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // 🧠 Step 1: Ask AI WHAT to do (structured output)
    const aiResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an AI agent.

Available actions:
1. get_crypto_price → for crypto queries
2. get_weather → for weather queries
3. reply → for normal conversation

Respond ONLY in JSON:

Examples:
{"action":"get_crypto_price","coin":"ethereum","currency":"usd"}
{"action":"get_weather","city":"kolkata"}
{"action":"reply","message":"your answer"}
          `,
        },
        { role: "user", content: message },
      ],
    });

    const content = aiResponse.choices[0].message.content;

    // 🧠 Step 2: Parse AI decision
    let decision;
    try {
      decision = JSON.parse(content);
    } catch {
      return res.json({ reply: content }); // fallback
    }

    // 🛠️ Step 3: Execute tool
    // AI decides which tool to call based on user query
    if (decision.action === "get_crypto_price") {
      const price = await getCryptoPrice(decision.coin, decision.currency);
      return res.json({
        reply: `${decision.coin} price is ${price} ${decision.currency}`,
      });
    }

    if (decision.action === "get_weather") {
      const temp = await getWeather(decision.city);
      return res.json({
        reply: `Temperature in ${decision.city} is ${temp}°C`,
      });
    }

    // 🤖 Normal reply
    return res.json({
      reply: decision.message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
