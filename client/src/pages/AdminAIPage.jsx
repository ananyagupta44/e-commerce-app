import { useState } from "react";

import axios from "axios";

const AdminAIPage = () => {
  const [message, setMessage] =
    useState("");

  const [chat, setChat] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setChat((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {
      const { data } =
        await axios.post(
          "http://localhost:5000/api/ai/assistant",
          {
            message,
          },
        );

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply,
        },
      ]);

      setMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 40,
        minHeight: "100vh",
        background:
          "#020617",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          marginBottom: 30,
        }}
      >
        AI Admin Assistant
      </h1>

      <div
        style={{
          background:
            "#111827",

          borderRadius: 20,

          padding: 24,

          minHeight: 500,

          marginBottom: 20,

          overflowY: "auto",
        }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 20,

              display: "flex",

              justifyContent:
                msg.role === "user"
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",

                padding: 18,

                borderRadius: 18,

                background:
                  msg.role ===
                  "user"
                    ? "#6366f1"
                    : "#1e293b",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p>AI is thinking...</p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
        }}
      >
        <input
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value,
            )
          }
          placeholder="Ask AI anything..."
          style={{
            flex: 1,

            padding: 18,

            borderRadius: 16,

            border: "none",

            background:
              "#111827",

            color: "white",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding:
              "0 28px",

            border: "none",

            borderRadius: 16,

            background:
              "#6366f1",

            color: "white",

            fontWeight: 700,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminAIPage;