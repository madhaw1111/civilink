import React, { useState } from "react";
import "./postModal.css";

export default function PostModal({ onClose, addToFeed }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    const user = JSON.parse(localStorage.getItem("civilink_user"));
    const token = localStorage.getItem("civilink_token");

    if (!user) return alert("Please login");
    if (!text.trim()) return alert("Post content required");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text,
          image,
          type: "post"
        })
      });

      const data = await res.json();

      if (data.success) {
        // add to home feed immediately
        addToFeed(data.post);
        onClose();
      } else {
        alert("Failed to post");
      }
    } catch (err) {
      console.error("POST ERROR", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-modal-overlay">
      <div className="post-modal-card">

        <h3>Create Post</h3>

        <textarea
          placeholder="Share something with the Civilink community…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        {image && (
          <img src={image} alt="preview" className="post-preview" />
        )}

        <div className="post-actions">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handlePost}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

      </div>
    </div>
  );
}
