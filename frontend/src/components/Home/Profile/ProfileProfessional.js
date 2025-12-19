// src/components/Home/Profile/ProfileProfessional.js
import React from "react";

export default function ProfileProfessional({ user, posts = [], onAddPost, onEditPost,
  onDeletePost }) {
  const loggedInUser = JSON.parse(localStorage.getItem("civilink_user"));
  const isOwnProfile = loggedInUser?._id === user?._id;

  /* ================= SHARE PROFILE ================= */
  const profileUrl = `${window.location.origin}/profile/${user._id}`;

  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name} | Civilink`,
          text: `View ${user.name}'s profile on Civilink`,
          url: profileUrl
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        alert("Profile link copied");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  /* ================= CONNECT USER ================= */
  const connectUser = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/users/${user._id}/connect`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("civilink_token")
          }
        }
      );
      alert("Connected");
    } catch (err) {
      console.error("Connect failed", err);
    }
  };

  return (
    <div className="profile-pro">
      {/* ================= HEADER ================= */}
      <div className="pro-header">
        <div className="pro-left">
          <div className="pro-avatar">
            {user.profilePhoto ||
              user.avatar ||
              (user.name ? user.name.charAt(0).toUpperCase() : "U")}
          </div>
        </div>

        <div className="pro-center">
          <h1>{user.name || "Civilink User"}</h1>

          {(user.profession || user.role) && (
            <div className="headline">
              {user.profession} {user.role && `• ${user.role}`}
            </div>
          )}

          {(user.location || user.experienceYears) && (
            <div className="location">
              {user.location}
              {user.experienceYears && ` • ${user.experienceYears} yrs`}
            </div>
          )}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="pro-actions">
            {/* OTHER USER → CONSULT & CONNECT */}
            {!isOwnProfile && (
              <>
                <button className="btn primary">
                  Consult
                </button>

                <button
                  className="btn outline"
                  onClick={connectUser}
                >
                  Connect
                </button>
              </>
            )}

            {/* OWN PROFILE → CONNECTIONS */}
            {isOwnProfile && (
              <button
                className="btn outline"
                onClick={() =>
                  window.location.href = `/profile/${user._id}/connections`
                }
              >
                Connections
              </button>
            )}

            {/* SHARE → ALWAYS */}
            <button
              className="btn subtle"
              onClick={shareProfile}
            >
              Share
            </button>
          </div>
        </div>

        <div className="pro-right">
          <div className="stat">
            <div className="num">{posts.length}</div>
            <div className="lbl">Projects</div>
          </div>

          {user.recommendationsCount !== undefined && (
            <div className="stat">
              <div className="num">{user.recommendationsCount}</div>
              <div className="lbl">Recommendations</div>
            </div>
          )}
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="pro-body">
        <div className="pro-left-col">
          {/* ABOUT */}
          {user.bio && (
            <section className="card">
              <h3>About</h3>
              <p>{user.bio}</p>
            </section>
          )}

          {/* SKILLS */}
          {Array.isArray(user.skills) && user.skills.length > 0 && (
            <section className="card">
              <h3>Skills</h3>
              <div className="tags">
                {user.skills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE */}
          {Array.isArray(user.experience) && user.experience.length > 0 && (
            <section className="card">
              <h3>Experience</h3>
              <div className="exp">
                {user.experience.map((exp, i) => (
                  <div key={i} className="exp-item">
                    <div className="exp-role">{exp.role}</div>
                    <div className="exp-org">
                      {exp.company} • {exp.duration}
                    </div>
                    {exp.description && (
                      <div className="exp-desc">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="pro-right-col">
          {/* PORTFOLIO */}
          <section className="card">
            <h3>Portfolio</h3>
            <div className="portfolio-grid">
  {posts.length ? (
    posts.slice(0, 6).map((p) => (
      <div key={p._id} className="port-item">
        {p.image ? (
          <img src={p.image} alt="project" />
        ) : (
          <div className="placeholder-sm">
            {p.text || "Project"}
          </div>
        )}

        {/* OWNER ACTIONS */}
        {isOwnProfile && (
          <div className="port-actions">
            <button
              className="btn xs outline"
              onClick={() => onEditPost(p)}
            >
              Edit
            </button>
            <button
              className="btn xs danger"
              onClick={() => onDeletePost(p._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))
  ) : (
    <div className="empty-small">No projects yet</div>
  )}
</div>

          </section>

          {/* CONTACT */}
          {(user.email || user.phone) && (
            <section className="card">
              <h3>Contact</h3>
              <div className="contact-row">
                {user.email && (
                  <a
                    href={`mailto:${user.email}`}
                    className="btn outline"
                  >
                    Email
                  </a>
                )}
                {user.phone && (
                  <a
                    href={`tel:${user.phone}`}
                    className="btn primary"
                  >
                    Call
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
