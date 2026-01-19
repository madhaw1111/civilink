// src/components/Home/Modals/PostView.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PostView() {
  const { id } = useParams(); // matches /post/:id
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/${id}`); // ✅ FIXED

        const data = await res.json();

        if (!data.success) {
          throw new Error("Post not found");
        }

        setPost(data.post); // ✅ FIXED
      } catch (err) {
        console.error("Post fetch failed:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading post…</div>;
  }

  if (!post) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Post not found</h3>
        <button onClick={() => navigate("/home")}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", padding: 16 }}>
      {/* USER */}
      <div style={{ marginBottom: 10 }}>
        <strong>{post.user?.name || "Civilink User"}</strong>
      </div>

      {/* IMAGE */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post"
          style={{
            width: "100%",
            borderRadius: 12,
            marginBottom: 12
          }}
        />
      )}

      {/* CONTENT */}
      {post.title && <h3>{post.title}</h3>}
      {post.text && <p>{post.text}</p>}

      {/* BACK */}
      <button
        style={{ marginTop: 20 }}
        onClick={() => navigate("/home")}
      >
        ← Back to Home
      </button>
    </div>
  );
}
