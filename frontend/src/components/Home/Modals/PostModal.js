import React, { useState } from "react";
import "./postModal.css";

export default function PostModal({ onClose, addToFeed }) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login");
    if (!text.trim()) return alert("Post content required");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      formData.append("type", "post");

      if (imageFile) {
        formData.append("image", imageFile); // ✅ MUST BE "image"
      }

      const res = await fetch("http://localhost:5000/api/post/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (data.success) {
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
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

        {preview && (
          <img src={preview} alt="preview" className="post-preview" />
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
