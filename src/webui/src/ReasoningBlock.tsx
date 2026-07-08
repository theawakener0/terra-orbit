import { useState } from "react";

export default function ReasoningBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="reasoning">
      <div className="reasoning-header" onClick={() => setOpen(!open)}>
        <span className={`reasoning-arrow ${open ? "open" : ""}`}>▶</span>
        reasoning
      </div>
      {open && <div className="reasoning-text">{text}</div>}
    </div>
  );
}
