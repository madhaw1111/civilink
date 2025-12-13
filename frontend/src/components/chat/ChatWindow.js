import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./chat.css";

function ChatWindow() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState(null);

  const user = JSON.parse(localStorage.getItem("civilink_user"));

  /* Fetch messages */
  useEffect(() => {
    fetch(`http://localhost:5000/api/chat/messages/${conversationId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.messages);
        }
      });
  }, [conversationId]);

  /* Scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Fetch conversation to get other user */
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/chat/conversations/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const conv = data.conversations.find(
            c => c._id === conversationId
          );
          if (conv) {
            const other = conv.participants.find(
              p => p._id !== user._id
            );
            setOtherUser(other);
          }
        }
      });
  }, [conversationId, user]);

  /* Send message */
  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("http://localhost:5000/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        senderId: user._id,
        receiverId: otherUser?._id,
        text
      })
    });

    setMessages(prev => [
      ...prev,
      {
        senderId: user._id,
        text,
        createdAt: new Date()
      }
    ]);

    setText("");
  };

  return (
    <div className="chat-window-page">
      {/* Header */}
      <div className="chat-window-header">
        <button
          className="chat-back-btn"
          onClick={() => navigate("/messages")}
        >
          ←
        </button>

        <div className="chat-header-info">
          <div className="chat-header-avatar">
            {otherUser?.name?.charAt(0)}
          </div>
          <div>
            <div className="chat-header-name">
              {otherUser?.name || "User"}
            </div>
            <div className="chat-header-role">
              {otherUser?.role || ""}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.senderId === user._id
                ? "chat-bubble sent"
                : "chat-bubble received"
            }
          >
            <div className="chat-text">{msg.text}</div>
            <div className="chat-time">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <input
          type="text"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
