import { useState } from "react";
import axios from "axios";

export default function FeedbackSettings() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!message.trim()) {
      alert("Please enter your feedback");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "/api/feedback",
        { message },
        {
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined
          }
        }
      );

      alert("Feedback submitted successfully");
      setMessage("");
    } catch (err) {
      console.error("Feedback error:", err);
      alert("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="settings-card">
      <div className="card-header">
        <h3>Feedback</h3>
        <p>Help us improve Civilink</p>
      </div>

      <textarea
        className="textarea"
        placeholder="Share your feedback or suggestions…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
      />

      <div className="align-right">
        <button
          className="btn-primary"
          onClick={submitFeedback}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send feedback"}
        </button>
      </div>
    </section>
  );
}
