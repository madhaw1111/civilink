import React from "react";


export default function BottomBar({ onAddPost, onCustomerMenu, onGotoVendor }) {
return (
<nav className="bottom-bar">
<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>🏠</button>
<button onClick={() => alert("Worker feature coming soon")}>👷</button>
<button className="add-post" onClick={onAddPost}>+</button>
<button onClick={onCustomerMenu}>🧭</button>
<button onClick={() => setShowCustomerMenu(true)}>🛒</button>
</nav>
);
}