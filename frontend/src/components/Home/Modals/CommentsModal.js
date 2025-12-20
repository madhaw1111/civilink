import React, { useState } from "react";

export default function CommentsModal({
  post,
  onClose,
  onAddComment
}) {
  const [text, setText] = useState("");

  if (!post) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Comments</h3>

        <div className="comments-list">
          {post.comments?.length ? (
            post.comments.map((c, i) => (
              <div key={i} className="comment-item">
                <strong>{c.user?.name || "User"}</strong>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <div className="empty-small">
              No comments yet
            </div>
          )}
        </div>

        <textarea
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="modal-actions">
          <button
            className="btn outline"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn primary"
            onClick={() => {
              if (!text.trim()) return;
              onAddComment(text);
              setText("");
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
