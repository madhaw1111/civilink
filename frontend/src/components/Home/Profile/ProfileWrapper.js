// src/components/Home/Profile/ProfileWrapper.js
import React, { useEffect, useState } from "react";
import ProfileNormal from "./ProfileNormal";
import ProfileProfessional from "./ProfileProfessional";
import ProfileEditModal from "./ProfileEditModal";
import "./profile.full.css";

export default function ProfileWrapper() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("civilink_user");
      const savedPosts = JSON.parse(localStorage.getItem("civilink_posts") || "[]");
      setUser(raw ? JSON.parse(raw) : null);
      setPosts(Array.isArray(savedPosts) ? savedPosts : []);
    } catch {
      setUser(null);
      setPosts([]);
    }
  }, []);

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem("civilink_user", JSON.stringify(u));
  };

  const addPost = (p) => {
    const next = [{ id: Date.now(), ...p }, ...posts];
    setPosts(next);
    localStorage.setItem("civilink_posts", JSON.stringify(next));
  };

  if (!user) return <div className="profile-empty">No user — please login</div>;

  const isProfessional = !!user.profession && user.profession !== "Member";

  return (
    <div className="profile-root">
      <div className="profile-toolbar">
        <div className="logo">Civilink</div>
        <div className="toolbar-actions">
          <button className="btn subtle" onClick={() => setShowEdit(true)}>Edit Profile</button>
          <button className="btn primary" onClick={() => addPost({ image: "", text: "Test post from UI" })}>Add Demo Post</button>
        </div>
      </div>

      {isProfessional ? (
        <ProfileProfessional user={user} posts={posts} onSaveUser={saveUser} onAddPost={addPost} />
      ) : (
        <ProfileNormal user={user} posts={posts} onSaveUser={saveUser} onAddPost={addPost} />
      )}

      {showEdit && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={(u) => { saveUser(u); setShowEdit(false); }}
        />
      )}
    </div>
  );
}
