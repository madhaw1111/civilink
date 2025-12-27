// src/components/Home/Profile/ProfileProfessional.js
import React from "react";
import AdvancedPortfolio from "./AdvancedPortfolio";


export default function ProfileProfessional({
  user,
  posts = [],
  loadingPosts = false,
  onAddPost = () => {},
  onEditPost = () => {},
  onDeletePost = () => {}
}) {
  /* ================= OWN PROFILE CHECK ================= */
  const loggedInUser = JSON.parse(
    localStorage.getItem("civilink_user")
  );
  const isOwnProfile =
    loggedInUser?._id && user?._id
      ? loggedInUser._id === user._id
      : false;

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
 const [connected, setConnected] = React.useState(false);

React.useEffect(() => {
  if (!loggedInUser || !user) return;
  setConnected(
    loggedInUser.connections?.includes(user._id)
  );
}, [user]);

const connectUser = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/connections/${user._id}/connect`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    if (res.ok) {
      setConnected(true);
    }
  } catch (err) {
    console.error(err);
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
              (user.name
                ? user.name.charAt(0).toUpperCase()
                : "U")}
          </div>
        </div>

        <div className="pro-center">
          <h1>{user.name || "Civilink User"}</h1>

          {(user.profession || user.role) && (
            <div className="headline">
              {user.profession}
              {user.role && ` • ${user.role}`}
            </div>
          )}

          {(user.location || user.experienceYears) && (
            <div className="location">
              {user.location}
              {user.experienceYears &&
                ` • ${user.experienceYears} yrs`}
            </div>
          )}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="pro-actions">
            {!isOwnProfile && (
              <>
                <button className="btn primary">
                  Consult
                </button>

                {!isOwnProfile && (
  <button
    className={`btn ${connected ? "outline" : "primary"}`}
    disabled={connected}
    onClick={connectUser}
  >
    {connected ? "Connected" : "Connect"}
  </button>
)}

              </>
            )}

            {isOwnProfile && (
              <button
                className="btn outline"
                onClick={() =>
                  (window.location.href = `/profile/${user._id}/connections`)
                }
              >
                Connections
              </button>
            )}

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
              <div className="num">
                {user.recommendationsCount}
              </div>
              <div className="lbl">
                Recommendations
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="pro-body">
        <div className="pro-left-col">
          {user.bio && (
            <section className="card">
              <h3>About</h3>
              <p>{user.bio}</p>
            </section>
          )}

          {Array.isArray(user.skills) &&
            user.skills.length > 0 && (
              <section className="card">
                <h3>Skills</h3>
                <div className="tags">
                  {user.skills.map((s) => (
                    <span
                      key={s}
                      className="tag"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

          {Array.isArray(user.experience) &&
            user.experience.length > 0 && (
              <section className="card">
                <h3>Experience</h3>
                {user.experience.map(
                  (exp, i) => (
                    <div
                      key={i}
                      className="exp-item"
                    >
                      <div className="exp-role">
                        {exp.role}
                      </div>
                      <div className="exp-org">
                        {exp.company} •{" "}
                        {exp.duration}
                      </div>
                      {exp.description && (
                        <div className="exp-desc">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  )
                )}
              </section>
            )}
        </div>

        <div className="pro-right-col">
          <section className="card">
  <AdvancedPortfolio
    posts={posts}
    isOwnProfile={isOwnProfile}
    onEditPost={onEditPost}
    onDeletePost={onDeletePost}
    loading={loadingPosts}
  />
</section>


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
