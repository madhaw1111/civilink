export default function FeedbackSettings() {
  return (
    <section className="settings-card">
      <div className="card-header">
        <h3>Feedback</h3>
        <p>Help us improve Civilink</p>
      </div>

      <textarea
        className="textarea"
        placeholder="Share your feedback or suggestions…"
      />

      <div className="align-right">
        <button className="btn-primary">
          Send feedback
        </button>
      </div>
    </section>
  );
}
