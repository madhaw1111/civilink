import React, { useState } from "react";

export default function PostModal({ onClose, addToFeed }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handlePost = () => {
    const newPost = {
      id: Date.now(),
      user: "You",
      role: "Member",
      text,
      image,
      location: "Tamil Nadu",
    };

    if (addToFeed) addToFeed(newPost);
    onClose();
  };


  return (
    <div className="vendor-modal-overlay">
      <div className="vendor-modal">
        <h3>Create Post</h3>

        <input
          type="file"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
        />

        <textarea
          placeholder="Write something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handlePost}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
