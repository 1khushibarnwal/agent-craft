import { useState } from "react";
import axios from "axios";

export default function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:3000/chat", {
      message,
      userId: "khushi",
    });

    setChat([...chat, { user: message, bot: res.data.reply }]);
    setMessage("");
  };

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: theme === "dark" ? "#080c16" : "#f9fafb",
        color: theme === "dark" ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: theme === "dark" ? "white" : "black" }}>AI Agent</h2>
      <button onClick={toggleTheme}>
        Switch to {theme === "dark" ? "light" : "dark"} mode
      </button>

      {chat.map((c, i) => (
        <div key={i}>
          <b>You:</b> {c.user} <br />
          <b>Bot:</b> {c.bot}
          <hr />
        </div>
      ))}

      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
