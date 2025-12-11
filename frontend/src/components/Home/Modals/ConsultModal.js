function ConsultModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="vendor-modal-overlay">
      <div className="vendor-modal">
        <h3>Consult</h3>

        <p><strong>{user.user || "Civilink Member"}</strong></p>
        <p>{user.role || "Service Provider"}</p>

        <a
          href={`tel:${user.phone || "+919XXXXXXXXX"}`}
          className="btn-primary"
          style={{ display: "block", marginTop: "12px" }}
        >
          📞 Call Now
        </a>

        <a
          href={`https://wa.me/${(user.phone || "919XXXXXXXXX").replace("+", "")}`}
          target="_blank"
          className="btn-primary"
          style={{
            display: "block",
            marginTop: "10px",
            background: "#25D366",
          }}
        >
          💬 WhatsApp
        </a>

        <a
          href={`mailto:${user.email || "civilink.admin@gmail.com"}`}
          className="btn-outline"
          style={{ display: "block", marginTop: "10px" }}
        >
          ✉️ Email
        </a>

        <button className="btn-outline" onClick={onClose} style={{ width: "100%", marginTop: "12px" }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ConsultModal;
