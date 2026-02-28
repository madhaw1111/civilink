import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./notifications.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        "/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markAsReadAndOpen = async (notif) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(
        `/api/notifications/${notif._id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // navigate to post
      if (notif.post) {
        navigate(`/post/${notif.post}`);
      }
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  return (
    <div className="notif-page">
      <h3 className="notif-title">🔔 Notifications</h3>

      {notifications.length === 0 && (
        <p className="notif-empty">No notifications yet</p>
      )}

      {notifications.map((n) => (
        <div
          key={n._id}
          className={`notif-item ${n.read ? "read" : "unread"}`}
          onClick={() => markAsReadAndOpen(n)}
        >
          <div className="notif-avatar">
            {n.fromUser?.profilePhoto ? (
              <img src={n.fromUser.profilePhoto} alt="" />
            ) : (
              <span>{n.fromUser?.name?.charAt(0)}</span>
            )}
          </div>

          <div className="notif-body">
            <p className="notif-message">{n.message}</p>
            <span className="notif-time">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
