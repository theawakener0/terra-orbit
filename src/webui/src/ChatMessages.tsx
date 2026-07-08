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
    <div className="messages">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {error && (
        <div
          style={{
            color: "var(--error)",
            fontSize: 12,
            padding: "8px 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          {error.message || "An error occurred"}
        </div>
      )}
    </div>
  );
}
