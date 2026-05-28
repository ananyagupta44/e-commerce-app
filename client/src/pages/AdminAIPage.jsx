import { useState } from "react";
import axios from "axios";
import "../css/AdminAIPage.css";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";

const suggestions = [
  "Which products are low in stock?",
  "Which products should I promote this week?",
  "Generate SEO description for luxury sneakers",
  "Suggest Instagram marketing ideas",
  "Analyze our inventory strategy",
  "Which products have highest ratings?",
  "Generate email campaign ideas",
  "How can I improve conversions?",
  "Suggest bundle offers for customers",
  "Write a premium product description",
];

const AdminAIPage = () => {
  const [message, setMessage] = useState("");

  const chatBoxRef = useRef(null);

  const [chat, setChat] = useState(() => {
    const savedChat = localStorage.getItem("nova_ai_chat");

    return savedChat ? JSON.parse(savedChat) : [];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "nova_ai_chat",

      JSON.stringify(chat),
    );
  }, [chat]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = async (customMessage) => {
    const finalMessage = customMessage || message;

    if (!finalMessage.trim()) return;

    const userMessage = {
      role: "user",
      text: finalMessage,
    };

    setChat((prev) => [...prev, userMessage]);

    setLoading(true);

    setMessage("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/ai/assistant",
        {
          message: finalMessage,
        },
      );

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "AI is temporarily unavailable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      {/* SIDEBAR */}

      <div className="ai-sidebar">
        <div>
          <p className="ai-logo">✨ NOVA AI</p>

          <h2>Ecommerce Assistant</h2>

          <p className="ai-sidebar-text">
            Your intelligent admin copilot for analytics, products, marketing,
            and growth.
          </p>
        </div>

        <div className="ai-suggestions">
          <p className="suggestions-title">Suggestions</p>

          {suggestions.map((item, index) => (
            <button key={index} onClick={() => sendMessage(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}

      <div className="ai-chat-area">
        {/* HEADER */}

        <div className="ai-chat-header">
          <div>
            <h1>AI Assistant</h1>

            <p>Powered by AI</p>
          </div>

          <div className="ai-status">● Online</div>
          <button
            onClick={() => {
              setChat([]);

              localStorage.removeItem("nova_ai_chat");
            }}
            className="clear-chat-btn"
          >
            New Chat
          </button>
        </div>

        {/* CHAT */}

        <div className="ai-chat-box" ref={chatBoxRef}>
          {chat.length === 0 && (
            <div className="ai-empty">
              <div className="ai-empty-icon">✨</div>

              <h2>How can I help you today?</h2>

              <p>Ask anything about your ecommerce business.</p>
            </div>
          )}

          {chat.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.role === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div className="chat-avatar">
                {msg.role === "user" ? "👤" : "✨"}
              </div>

              <div className="chat-content">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message ai-message">
              <div className="chat-avatar">✨</div>

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
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AI anything..."
            className="ai-input"
          />

          <button onClick={() => sendMessage()} className="ai-send-btn">
            Send →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAIPage;
