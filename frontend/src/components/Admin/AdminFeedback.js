import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadFeedbacks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/feedback/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/feedback/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // remove from UI immediately
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete feedback");
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  if (loading) return <p>Loading feedback...</p>;

  return (
    <section className="admin-card">
      <h2>Feedback</h2>

      {feedbacks.length === 0 && <p>No feedback yet</p>}

      {feedbacks.map((fb) => (
        <div key={fb._id} className="feedback-item">
          <div>
            <strong>{fb.user?.name || "Guest"}</strong>
            <p>{fb.message}</p>
            <small>
              {new Date(fb.createdAt).toLocaleString()}
            </small>
          </div>

          <button
            className="btn-danger"
            onClick={() => deleteFeedback(fb._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </section>
  );
}
