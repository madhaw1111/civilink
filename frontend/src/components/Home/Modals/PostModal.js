import React from "react";

function PostModal({ onClose }) {
  return (
    <div className="vendor-modal-overlay">
      <div className="vendor-modal">
        <h3>Create Post</h3>

        <input type="file" />
        <textarea placeholder="Write something..." />

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              alert("Post uploaded (next step)");
              onClose();
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
