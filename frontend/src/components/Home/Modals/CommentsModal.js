function CommentsModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="vendor-modal-overlay">
      <div className="vendor-modal">
        <h3>Comments</h3>

        <div className="comment">
          <strong>Raj (Worker):</strong> Interested 👍
        </div>
        <div className="comment">
          <strong>Siva (Customer):</strong> Please share details
        </div>

        <input placeholder="Write a comment..." />

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary">Post</button>
        </div>
      </div>
    </div>
  );
}

export default CommentsModal;
