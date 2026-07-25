import axios from "axios";

// Falls back to localhost:3000 for local dev, but lets you override via
// a .env file (VITE_API_URL=https://your-deployed-backend.com)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function sendChatMessage(message, userId) {
  const res = await axios.post(`${API_URL}/chat`, { message, userId });
  return res.data.reply;
}
