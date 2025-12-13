import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.css";

function ChatInbox() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("civilink_user"));
    if (!user) return;

    fetch(`http://localhost:5000/api/chat/conversations/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConversations(data.conversations);
        }
        setLoading(false);
      });
  }, []);

  const getOtherUser = (participants) => {
    const user = JSON.parse(localStorage.getItem("civilink_user"));
    return participants.find(p => p._id !== user._id);
  };

  if (loading) {
    return <div className="chat-loading">Loading messages…</div>;
  }

  return (
    <div className="chat-inbox-page">
      <div className="chat-inbox-header">
        <h2>Messages</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="chat-empty">
          No conversations yet
        </div>
      ) : (
        <div className="chat-list">
          {conversations.map(conv => {
            const otherUser = getOtherUser(conv.participants);

            return (
              <div
                key={conv._id}
                className="chat-list-item"
                onClick={() => navigate(`/messages/${conv._id}`)}
              >
                <div className="chat-avatar">
                  {otherUser?.name?.charAt(0)}
                </div>

                <div className="chat-info">
                  <div className="chat-name">
                    {otherUser?.name || "User"}
                  </div>

                  <div className="chat-last-message">
                    {conv.lastMessage || "Start conversation"}
                  </div>
                </div>

                <div className="chat-time">
                  {conv.lastMessageAt
                    ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ChatInbox;
