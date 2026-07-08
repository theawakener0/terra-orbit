import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect } from "react";
import Header from "./src/Header";
import ChatMessages from "./src/ChatMessages";
import InputBar from "./src/InputBar";

export default function App() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="app">
      <Header status={status} />
      <ChatMessages messages={messages} streaming={isLoading} error={error} />
      <div ref={messagesEndRef} />
      <InputBar
        onSend={(text) => sendMessage({ text })}
        onStop={stop}
        disabled={isLoading}
        streaming={isLoading}
      />
    </div>
  );
}
