import { useState, useRef, useCallback, type FormEvent, type KeyboardEvent } from "react";

export default function InputBar({
  onSend,
  onStop,
  disabled,
  streaming,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  disabled: boolean;
  streaming: boolean;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || disabled) return;
    onSend(text);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          resize();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ask TerraOrbit about NASA data..."
        disabled={disabled}
        autoFocus
        rows={1}
      />
      {streaming ? (
        <button type="button" onClick={onStop}>
          ■
        </button>
      ) : (
        <button type="submit" disabled={disabled || !input.trim()}>
          →
        </button>
      )}
    </form>
  );
}
