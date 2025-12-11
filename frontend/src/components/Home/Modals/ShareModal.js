function ShareModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="vendor-modal-overlay">
      <div className="vendor-modal">
        <h3>Share Post</h3>

        <button
          className="btn-primary"
          onClick={() => {
            alert("WhatsApp share coming soon");
            onClose();
          }}
        >
          💬 WhatsApp
        </button>

        <button
          className="btn-outline"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
            onClose();
          }}
        >
          🔗 Copy Link
        </button>

        <button className="btn-outline" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ShareModal;
