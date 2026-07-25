export default function ChatHeader({ theme, onToggleTheme, onNewChat }) {
  return (
    <header className="chat-header">
      <div className="chat-header-title">
        <span className="chat-header-mark">◆</span>
        AgentCraft
      </div>
      <div className="chat-header-actions">
        <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <button className="btn-primary" onClick={onNewChat}>
          New chat
        </button>
      </div>
    </header>
  );
}
