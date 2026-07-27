"use client";

import { useState, useRef, useEffect } from "react";
import { BOT_NAME, WELCOME_MESSAGE } from "../lib/guidelines";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME_MESSAGE, image: null },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("chat"); // "chat" | "image"
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text, image: null };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      if (mode === "image") {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: text, image: data.image },
        ]);
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages
              .filter((m) => !m.image)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply, image: null },
        ]);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `[ERROR] ${err.message}`, image: null },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="wrap">
      <header className="header">
        <div className="tag mono">SYS // 01</div>
        <h1 className="mono">{BOT_NAME}</h1>
        <div className="tag mono">STATUS: ONLINE</div>
      </header>

      <div className="modeRow mono">
        <button
          className={mode === "chat" ? "modeBtn active" : "modeBtn"}
          onClick={() => setMode("chat")}
        >
          [ CHAT ]
        </button>
        <button
          className={mode === "image" ? "modeBtn active" : "modeBtn"}
          onClick={() => setMode("image")}
        >
          [ DRAW ]
        </button>
      </div>

      <div className="panel">
        {messages.map((m, i) => (
          <div key={i} className={`bubbleRow ${m.role}`}>
            <div className="bracket left mono">{m.role === "user" ? "YOU" : "01"}</div>
            <div className="bubble">
              <p>{m.content}</p>
              {m.image && <img src={m.image} alt="generated" className="genImage" />}
            </div>
            <div className="bracket right mono">{m.role === "user" ? "//" : "//"}</div>
          </div>
        ))}
        {loading && (
          <div className="bubbleRow assistant">
            <div className="bracket left mono">01</div>
            <div className="bubble">
              <p className="mono">
                {mode === "image" ? "rendering..." : "thinking..."}
              </p>
            </div>
            <div className="bracket right mono">//</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="inputRow">
        <textarea
          className="mono"
          rows={1}
          placeholder={
            mode === "image" ? "Describe an image to draw..." : "Type a message..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="sendBtn mono" onClick={handleSend} disabled={loading}>
          SEND
        </button>
      </div>

      <style jsx>{`
        .wrap {
          max-width: 780px;
          margin: 0 auto;
          padding: 24px 16px 32px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--grid-line);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .header h1 {
          font-size: 18px;
          letter-spacing: 0.08em;
          color: var(--paper);
          margin: 0;
          font-weight: 800;
        }
        .tag {
          font-size: 11px;
          color: var(--ink-dim);
          letter-spacing: 0.05em;
        }
        .modeRow {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .modeBtn {
          background: transparent;
          border: 1px solid var(--blueprint-mid);
          color: var(--ink-dim);
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          border-radius: 2px;
          letter-spacing: 0.05em;
        }
        .modeBtn.active {
          color: var(--amber);
          border-color: var(--amber);
        }
        .panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          padding: 8px 2px 16px;
        }
        .bubbleRow {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .bubbleRow.user {
          flex-direction: row-reverse;
        }
        .bracket {
          font-size: 10px;
          color: var(--ink-dim);
          padding-top: 10px;
          user-select: none;
        }
        .bubble {
          background: rgba(19, 64, 116, 0.35);
          border: 1px solid var(--blueprint-mid);
          border-radius: 2px;
          padding: 10px 14px;
          max-width: 78%;
        }
        .bubbleRow.user .bubble {
          border-color: var(--amber);
          background: rgba(244, 163, 0, 0.08);
        }
        .bubble p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .genImage {
          margin-top: 10px;
          max-width: 100%;
          border: 1px solid var(--grid-line);
          border-radius: 2px;
        }
        .inputRow {
          display: flex;
          gap: 8px;
          border-top: 1px solid var(--grid-line);
          padding-top: 14px;
        }
        textarea {
          flex: 1;
          resize: none;
          background: rgba(11, 37, 69, 0.6);
          border: 1px solid var(--blueprint-mid);
          border-radius: 2px;
          color: var(--paper);
          padding: 10px 12px;
          font-size: 14px;
        }
        textarea:focus {
          outline: 2px solid var(--amber);
          outline-offset: 1px;
        }
        .sendBtn {
          background: var(--amber);
          color: var(--blueprint-deep);
          border: none;
          padding: 0 20px;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.05em;
          border-radius: 2px;
          cursor: pointer;
        }
        .sendBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
