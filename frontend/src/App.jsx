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
    const res = await axios.post("http://localhost:3000/chat", {
      message,
      userId,
    });

    setChat([...chat, { user: message, bot: res.data.reply }]);
    setMessage("");
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
      <button onClick={toggleTheme}>
        Switch to {theme === "dark" ? "light" : "dark"} mode
      </button>

      {chat.map((c, i) => (
        <div key={i}>
          <b>You:</b> {c.user} <br />
          <b>Assistant:</b> {c.bot}
          <hr />
        </div>
      ))}

      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>

      <button
        onClick={newChat}
        style={{
          position: "absolute",
          top: 20,
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
