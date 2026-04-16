import { useState } from "react";
import axios from "axios";

export default function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const [theme, setTheme] = useState("dark");

  const [userId, setUserId] = useState(() => Date.now().toString());

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const newChat = () => {
    setChat([]);
    setUserId(Date.now().toString()); // 🔥 new identity
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post("http://localhost:3000/chat", {
        message,
        userId,
      });

      setChat((prev) => [...prev, { user: message, bot: res.data.reply }]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        padding: 20,
        backgroundColor: theme === "dark" ? "#080c16" : "#f9fafb",
        color: theme === "dark" ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: theme === "dark" ? "white" : "black" }}>AI Agent</h1>
      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      {chat.map((c, i) => (
        <div key={i}>
          <b>You:</b> {c.user} <br />
          <b>Assistant:</b> {c.bot}
          <hr />
        </div>
      ))}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "70%",
          marginBottom: "10px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "20px",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />
      &nbsp;&nbsp;
      <button
        onClick={sendMessage}
        style={{
          marginBottom: "10px",
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
      <button
        onClick={newChat}
        style={{
          position: "absolute",
          top: 60,
          right: 20,
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        New Chat
      </button>
    </div>
  );
}
