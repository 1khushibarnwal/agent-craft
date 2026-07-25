import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="chat-empty">
        <p className="chat-empty-mark">◆</p>
        <h2>Ask about the weather, a crypto price, the latest news — or anything else.</h2>
      </div>
    );
  }

  return (
    <div className="chat-messages">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
