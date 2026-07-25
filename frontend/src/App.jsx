import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { useChat } from "./hooks/useChat";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const {
    chats,
    currentChat,
    currentChatId,
    setCurrentChatId,
    sendMessage,
    newChat,
    loading,
  } = useChat();

  return (
    <div className={`app-shell theme-${theme}`}>
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
      />

      <div className="chat-panel">
        <ChatHeader
          theme={theme}
          onToggleTheme={() =>
            setTheme((t) => (t === "dark" ? "light" : "dark"))
          }
          onNewChat={newChat}
        />
        <ChatMessages messages={currentChat?.messages} />
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}
