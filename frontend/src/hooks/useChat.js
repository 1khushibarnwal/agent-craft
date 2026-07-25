import { useState, useRef, useCallback } from "react";
import { sendChatMessage } from "../services/chatApi";
import { getResponseSource } from "../utils/responseSource";

export function useChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(() => Date.now().toString());
  const [loading, setLoading] = useState(false);
  const isSending = useRef(false);

  const newChat = useCallback(() => {
    setCurrentChatId(Date.now().toString());
  }, []);

  // Typewriter effect for the bot's reply
  const typeMessage = useCallback((text, chatId) => {
    let index = 0;
    let current = "";

    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        return;
      }
      current += text[index];
      index++;

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;
          const messages = [...chat.messages];
          const lastIndex = messages.length - 1;
          if (messages[lastIndex]?.role === "bot") {
            messages[lastIndex] = { ...messages[lastIndex], content: current, pending: false };
          }
          return { ...chat, messages };
        })
      );
    }, 20);
  }, []);

  const sendMessage = useCallback(
    async (rawMessage) => {
      const userMsg = rawMessage.trim();
      if (!userMsg || isSending.current) return;
      isSending.current = true;
      setLoading(true);

      const source = getResponseSource(userMsg);

      setChats((prev) => {
        const existing = prev.find((c) => c.id === currentChatId);
        const chat = existing || { id: currentChatId, title: userMsg.slice(0, 50), messages: [] };

        const messages = [...chat.messages, { role: "user", content: userMsg }];
        if (messages[messages.length - 1]?.role !== "bot") {
          messages.push({ role: "bot", content: "", source, pending: true });
        }
        const updatedChat = { ...chat, messages };

        return existing
          ? prev.map((c) => (c.id === currentChatId ? updatedChat : c))
          : [...prev, updatedChat];
      });

      try {
        const reply = await sendChatMessage(userMsg, currentChatId);
        typeMessage(reply, currentChatId);
      } catch (err) {
        // Unlike the original version, failures are now shown to the user
        // instead of only being logged to the console.
        const errorText = err.response
          ? `⚠️ Server error (${err.response.status}). Check your backend logs / GROQ_API_KEY.`
          : `⚠️ Couldn't reach the agent. Is the backend running on port 3000?`;

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== currentChatId) return chat;
            const messages = [...chat.messages];
            const lastIndex = messages.length - 1;
            if (messages[lastIndex]?.role === "bot") {
              messages[lastIndex] = { ...messages[lastIndex], content: errorText, error: true, pending: false };
            }
            return { ...chat, messages };
          })
        );
      } finally {
        setLoading(false);
        isSending.current = false;
      }
    },
    [currentChatId, typeMessage]
  );

  const currentChat = chats.find((c) => c.id === currentChatId);

  return {
    chats,
    currentChat,
    currentChatId,
    setCurrentChatId,
    sendMessage,
    newChat,
    loading,
  };
}
