import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedPosts.css";


export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/saved-posts",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to load saved posts", err);
    }
  };

return (
  <div className="saved-page">
    <h3 className="saved-title">⭐ Saved Posts</h3>

    {posts.length === 0 && (
      <p className="saved-empty">No saved posts yet</p>
    )}

    <div className="saved-grid">
      {posts.map((post) => (
        <div key={post._id} className="saved-card">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt="saved"
              className="saved-image"
            />
          ) : (
            <div className="saved-text">
              {post.text?.slice(0, 80)}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

}
