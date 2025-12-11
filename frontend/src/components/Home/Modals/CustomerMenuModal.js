function CustomerMenuModal({ onClose }) {
  return (
    <div className="vendor-modal-overlay">
      <div className="vendor-modal">
        <h3>What do you want to do?</h3>

        <button
          className="btn-primary"
          onClick={() => (window.location.href = "/build-house")}
        >
          🏗 Build a House
        </button>

        <button
          className="btn-primary"
          onClick={() => (window.location.href = "/buy-sell")}
        >
          🏠 Buy / Sell a House
        </button>

        <button
          className="btn-primary"
          onClick={() => (window.location.href = "/rent-house")}
        >
          🔑 Rent / To-Let
        </button>

        <button className="btn-outline" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default CustomerMenuModal;
