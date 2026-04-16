import { useState } from "react";
import axios from "axios";

export default function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(() =>
    Date.now().toString(),
  );
  const [theme, setTheme] = useState("dark");

  const [loading, setLoading] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const newChat = () => {
    setCurrentChatId(Date.now().toString());
  };

  // ✨ Typing effect
  const typeMessage = (text) => {
    let index = 0;
    let current = "";

    const interval = setInterval(() => {
      current += text[index];
      index++;

      setChats((prev) => {
        const updated = [...prev];
        const chat = updated.find((c) => c.id === currentChatId);

        if (!chat) return prev;

        // update last bot message
        chat.messages[chat.messages.length - 1].content = current;

        return [...updated];
      });

      if (index === text.length) clearInterval(interval);
    }, 20);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);

    const userMsg = message;
    setMessage("");

    // 🧠 Add user + empty bot message
    setChats((prev) => {
      const updated = [...prev];
      let chat = updated.find((c) => c.id === currentChatId);

      if (!chat) {
        chat = {
          id: currentChatId,
          title: userMsg.slice(0, 30),
          messages: [],
        };
        updated.push(chat);
      }

      chat.messages.push(
        { role: "user", content: userMsg },
        { role: "bot", content: "" }, // placeholder
      );

      return [...updated];
    });

    try {
      const res = await axios.post("http://localhost:3000/chat", {
        message: userMsg,
        userId: currentChatId,
      });

      const reply = res.data.reply;

      // ✨ animate response
      typeMessage(reply);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const currentChat = chats.find((c) => c.id === currentChatId);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#080c16" : "#f9fafb",
        color: theme === "dark" ? "white" : "black",
      }}
    >
      {/* 📚 Sidebar */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid gray",
          padding: 10,
        }}
      >
        <h3>Chats</h3>

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setCurrentChatId(chat.id)}
            style={{
              padding: "8px",
              cursor: "pointer",
              background:
                chat.id === currentChatId
                  ? theme === "dark"
                    ? "#1e293b"
                    : "#e5e7eb"
                  : "transparent",
            }}
          >
            {chat.title}
          </div>
        ))}
      </div>

      {/* 💬 Main */}
      <div style={{ flex: 1, padding: 20, position: "relative" }}>
        <h1 style={{ color: theme === "dark" ? "white" : "black" }}>
          AI Agent
        </h1>

        {/* 🌗 Theme */}
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

        {/* 🆕 New Chat */}
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

        {/* 💬 Messages */}
        <div style={{ marginTop: 40 }}>
          {currentChat?.messages.map((msg, i) => (
            <div key={i}>
              <b>{msg.role === "user" ? "You" : "Assistant"}:</b> {msg.content}
              <hr />
            </div>
          ))}
        </div>

        {/* 📝 Input */}
        <div style={{ marginTop: 20 }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            style={{
              width: "70%",
              padding: "10px",
              fontSize: "16px",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
            placeholder="Write your thoughts...💭"
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
