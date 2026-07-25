import { SOURCE_LABELS } from "../utils/responseSource";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const badge = !isUser && message.source ? SOURCE_LABELS[message.source] : null;

  return (
    <div className={`bubble-row ${isUser ? "from-user" : "from-bot"}`}>
      <div
        className={`bubble ${isUser ? "bubble-user" : "bubble-bot"} ${
          message.error ? "bubble-error" : ""
        }`}
      >
        {badge && (
          <span className={`source-tag source-${message.source}`}>
            {badge.icon} {badge.label}
          </span>
        )}
        <p>{message.content || (message.pending ? "···" : "")}</p>
      </div>
    </div>
  );
}
