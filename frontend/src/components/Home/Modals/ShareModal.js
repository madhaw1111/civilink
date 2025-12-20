// src/components/Home/Modals/ShareModal.js
function ShareModal({ post, onClose }) {
  if (!post) return null;

  const postUrl = `${window.location.origin}/post/${post._id}`;

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this post on Civilink:\n${postUrl}`
    );
    window.open(
      `https://wa.me/?text=${text}`,
      "_blank"
    );
    onClose();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      alert("Link copied!");
      onClose();
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Share Post</h3>

        <button
          className="btn primary"
          onClick={shareWhatsApp}
        >
          💬 Share on WhatsApp
        </button>

        <button
          className="btn outline"
          onClick={copyLink}
        >
          🔗 Copy Link
        </button>

        <button
          className="btn subtle"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ShareModal;
