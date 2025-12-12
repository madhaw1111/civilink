// src/components/Home/Profile/ProfileProfessional.js
import React from "react";

export default function ProfileProfessional({ user, posts = [], onAddPost }) {
  return (
    <div className="profile-pro">
      <div className="pro-header">
        <div className="pro-left">
          <div className="pro-avatar">{user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : "U")}</div>
        </div>

        <div className="pro-center">
          <h1>{user.name || "Civilink Professional"}</h1>
          <div className="headline">{user.profession || "Civil Engineer" } • {user.role || "Member"}</div>
          <div className="location">Chennai, Tamil Nadu • {user.experienceYears || "5"} yrs</div>

          <div className="pro-actions">
            <button className="btn primary">Consult</button>
            <button className="btn outline">Connect</button>
            <button className="btn subtle">Share</button>
          </div>
        </div>

        <div className="pro-right">
          <div className="stat">
            <div className="num">{posts.length}</div>
            <div className="lbl">Projects</div>
          </div>

          <div className="stat">
            <div className="num">92</div>
            <div className="lbl">Recommendations</div>
          </div>
        </div>
      </div>

      <div className="pro-body">
        <div className="pro-left-col">
          <section className="card">
            <h3>About</h3>
            <p>{user.bio || "Experienced Site Engineer — specialized in structural and project management."}</p>
          </section>

          <section className="card">
            <h3>Skills</h3>
            <div className="tags">
              {(user.skills || ["Construction","AutoCAD","Estimation","Project mgmt"]).map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          </section>

          <section className="card">
            <h3>Experience</h3>
            <div className="exp">
              <div className="exp-item">
                <div className="exp-role">Site Engineer</div>
                <div className="exp-org">ACME Builders • 2019 - Present</div>
                <div className="exp-desc">Managed site teams, MEP coordination and schedule delivery.</div>
              </div>
            </div>
          </section>

        </div>

        <div className="pro-right-col">
          <section className="card">
            <h3>Portfolio</h3>
            <div className="portfolio-grid">
              {posts.length ? posts.slice(0,6).map(p => (
                <div key={p.id} className="port-item">
                  {p.image ? <img src={p.image} alt="project" /> : <div className="placeholder-sm">{p.text || "Project"}</div>}
                </div>
              )) : <div className="empty-small">No projects yet</div>}
            </div>
          </section>

          <section className="card">
            <h3>Contact</h3>
            <div className="contact-row">
              <a href={`mailto:${user.email || "civilink.admin@gmail.com"}`} className="btn outline">Email</a>
              <a href={`tel:${user.phone || "+91XXXXXXXXXX"}`} className="btn primary">Call</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
