import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AdminAIPage.css";
import ReactMarkdown from "react-markdown";
import API_URL from "@/config/api";
import ParticleBackground from "@/components/ParticleBackground";

const suggestions = [
  { icon: "📦", text: "Which products are low in stock?" },
  { icon: "🚀", text: "Which products should I promote this week?" },
  { icon: "✍️", text: "Generate SEO description for luxury sneakers" },
  { icon: "📸", text: "Suggest Instagram marketing ideas" },
  { icon: "📊", text: "Analyze our inventory strategy" },
  { icon: "⭐", text: "Which products have highest ratings?" },
  { icon: "📧", text: "Generate email campaign ideas" },
  { icon: "💡", text: "How can I improve conversions?" },
  { icon: "🎁", text: "Suggest bundle offers for customers" },
  { icon: "💎", text: "Write a premium product description" },
];

const AdminAIPage = () => {
  const [message, setMessage] = useState("");
  const chatBoxRef = useRef(null);
  const textareaRef = useRef(null);

  const [chat, setChat] = useState(() => {
    const savedChat = localStorage.getItem("nova_ai_chat");
    return savedChat ? JSON.parse(savedChat) : [];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("nova_ai_chat", JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  // Auto-resize textarea
  const handleInput = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  const sendMessage = async (customMessage) => {
    const finalMessage = customMessage || message;
    if (!finalMessage.trim()) return;

    const userMessage = { role: "user", text: finalMessage };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const { data } = await axios.post(`${API_URL}/api/ai/assistant`, {
        message: finalMessage,
      });
      setChat((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "AI is temporarily unavailable." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <ParticleBackground />
      <div className="ai-page">
        {/* SIDEBAR */}
        <div className="ai-sidebar">
          <div className="ai-sidebar-top">
            <div className="ai-brand">
              <div className="ai-brand-icon">✦</div>
              <div>
                <p className="ai-brand-name">Nova AI</p>
                <p className="ai-brand-sub">Ecommerce Copilot</p>
              </div>
            </div>

            <p className="ai-sidebar-desc">
              Your intelligent admin assistant for analytics, products,
              marketing, and growth.
            </p>
          </div>

          <div className="ai-suggestions-wrap">
            <p className="suggestions-label">Quick prompts</p>
            <div className="ai-suggestions">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => sendMessage(item.text)}
                >
                  <span className="suggestion-icon">{item.icon}</span>
                  <span className="suggestion-text">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CHAT */}
        <div className="ai-chat-area">
          {/* HEADER */}
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-header-avatar">✦</div>
              <div>
                <h1 className="ai-header-title">AI Assistant</h1>
                <p className="ai-header-sub">
                  <span className="ai-online-dot" />
                  Online · Ready to help
                </p>
              </div>
            </div>
            <button
              className="clear-chat-btn"
              onClick={() => {
                setChat([]);
                localStorage.removeItem("nova_ai_chat");
              }}
            >
              <span>↺</span> New Chat
            </button>
          </div>

          {/* MESSAGES */}
          <div className="ai-chat-box" ref={chatBoxRef}>
            {chat.length === 0 && (
              <div className="ai-empty">
                <div className="ai-empty-glyph">✦</div>
                <h2 className="ai-empty-title">How can I help you?</h2>
                <p className="ai-empty-sub">
                  Ask anything about your store — inventory, marketing,
                  products, strategy.
                </p>
                <div className="ai-empty-pills">
                  {suggestions.slice(0, 3).map((s, i) => (
                    <button
                      key={i}
                      className="empty-pill"
                      onClick={() => sendMessage(s.text)}
                    >
                      {s.icon} {s.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chat.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.role === "user" ? "user-message" : "ai-message"}`}
              >
                {msg.role === "ai" && (
                  <div className="chat-avatar ai-avatar">✦</div>
                )}
                <div className="chat-bubble">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                {msg.role === "user" && (
                  <div className="chat-avatar user-avatar">U</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-message ai-message">
                <div className="chat-avatar ai-avatar">✦</div>
                <div className="typing-loader">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="ai-input-container">
            <div className="ai-input-box">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your store… (Enter to send)"
                className="ai-input"
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                className="ai-send-btn"
                disabled={!message.trim() || loading}
              >
                <span className="send-arrow">↑</span>
              </button>
            </div>
            <p className="ai-input-hint">Shift + Enter for new line</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAIPage;
