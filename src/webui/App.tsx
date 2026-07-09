import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect } from "react";
import Header from "./src/Header";
import ChatMessages from "./src/ChatMessages";
import InputBar from "./src/InputBar";
import ErrorBoundary from "./src/ErrorBoundary";

export default function App() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";
  const prevLoadingRef = useRef(isLoading);

  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    prevLoadingRef.current = isLoading;
    const behavior = wasLoading && !isLoading ? "smooth" : "auto";
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, [messages, isLoading]);

  return (
    <div className="app">
      <Header status={status} />
      <ErrorBoundary>
        <ChatMessages messages={messages} streaming={isLoading} error={error} />
      </ErrorBoundary>
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
