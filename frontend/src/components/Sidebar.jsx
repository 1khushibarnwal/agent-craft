export default function Sidebar({ chats, currentChatId, onSelectChat }) {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">History</h3>
      <div className="sidebar-list">
        {chats.length === 0 && <p className="sidebar-empty">No conversations yet</p>}
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`sidebar-item ${chat.id === currentChatId ? "active" : ""}`}
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.title || "New chat"}
          </button>
        ))}
      </div>
    </aside>
  );
}
