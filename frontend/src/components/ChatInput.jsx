import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="chat-input-bar">
      <textarea
        className="chat-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Write your thoughts..."
        rows={1}
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={loading}
        aria-label="Send message"
      >
        {loading ? <span className="spinner" /> : "↑"}
      </button>
    </div>
  );
}
