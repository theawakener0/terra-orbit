import type { UIMessage } from "ai";
import ChatMessage from "./ChatMessage";

export default function ChatMessages({
  messages,
  streaming,
  error,
}: {
  messages: UIMessage[];
  streaming: boolean;
  error?: Error | null;
}) {
  if (messages.length === 0 && !error) {
    return (
      <div className="messages">
        <div className="messages-empty">
          <span>
            Ask TerraOrbit about NASA data
            <br />
            solar flares, asteroids, imagery, and more
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="messages" role="log" aria-live="polite" aria-label="Chat messages">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {error && (
        <div className="chat-error">
          {error.message || "An error occurred"}
        </div>
      )}
    </div>
  );
}
