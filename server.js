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

If the user asks about crypto prices:
- Extract BOTH coin and currency (usd, inr, eur, etc)

Respond ONLY in JSON:

{"action":"get_crypto_price","coin":"ethereum","currency":"inr"}

If no currency mentioned, default to usd.

Otherwise:
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
    if (decision.action === "get_crypto_price") {
      const price = await getCryptoPrice(
        decision.coin,
        decision.currency || "usd",
      );

      return res.json({
        reply: `${decision.coin} price is ${price} ${decision.currency || "usd"}`,
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
