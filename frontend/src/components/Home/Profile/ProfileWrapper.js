import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfileNormal from "./ProfileNormal";
import ProfileProfessional from "./ProfileProfessional";
import ProfileEditModal from "./ProfileEditModal";

import "./profile.full.css";

export default function ProfileWrapper() {
  const { userId } = useParams(); // optional (other user's profile)

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(
    localStorage.getItem("civilink_user")
  );

  /* =====================================
     FETCH PROFILE (FIXED & SAFE)
  ===================================== */
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      // load demo posts (existing logic)
      try {
        const savedPosts = JSON.parse(
          localStorage.getItem("civilink_posts") || "[]"
        );
        setPosts(Array.isArray(savedPosts) ? savedPosts : []);
      } catch {
        setPosts([]);
      }

      try {
        const token = localStorage.getItem("civilink_token");

        // 🔑 decide API endpoint
        const url = userId
          ? `http://localhost:5000/api/users/${userId}` // other user
          : `http://localhost:5000/api/users/me`;       // own profile

        const res = await fetch(url, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        });

        if (!res.ok) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();

        // supports both formats: {user} or direct user
        setUser(data.user || data);
        setLoading(false);
      } catch {
        setUser(null);
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  /* =====================================
     HELPERS
  ===================================== */
  const saveUser = (updatedUser) => {
    setUser(updatedUser);

    // update localStorage only if editing own profile
    if (loggedInUser?._id === updatedUser._id) {
      localStorage.setItem(
        "civilink_user",
        JSON.stringify(updatedUser)
      );
    }
  };

  const addPost = (p) => {
    const next = [{ id: Date.now(), ...p }, ...posts];
    setPosts(next);
    localStorage.setItem("civilink_posts", JSON.stringify(next));
  };

  /* =====================================
     STATES
  ===================================== */
  if (loading) {
    return <div className="profile-empty">Loading profile…</div>;
  }

  if (!user) {
    return <div className="profile-empty">User not found</div>;
  }

  const isProfessional =
    !!user.profession && user.profession !== "Member";

  const isOwnProfile =
    loggedInUser?._id === user._id;

  /* =====================================
     RENDER
  ===================================== */
  return (
    <div className="profile-root">
      <div className="profile-toolbar">
        <div className="logo">Civilink</div>

        {isOwnProfile && (
          <div className="toolbar-actions">
            <button
              className="btn subtle"
              onClick={() => setShowEdit(true)}
            >
              Edit Profile
            </button>

            <button
              className="btn primary"
              onClick={() =>
                addPost({ image: "", text: "Test post from UI" })
              }
            >
              Add Post
            </button>
          </div>
        )}
      </div>

      {isProfessional ? (
        <ProfileProfessional
          user={user}
          posts={posts}
          isOwnProfile={isOwnProfile}
          onSaveUser={saveUser}
          onAddPost={addPost}
        />
      ) : (
        <ProfileNormal
          user={user}
          posts={posts}
          isOwnProfile={isOwnProfile}
          onSaveUser={saveUser}
          onAddPost={addPost}
        />
      )}

      {showEdit && isOwnProfile && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={(u) => {
            saveUser(u);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
}
