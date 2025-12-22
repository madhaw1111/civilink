export default function AccountSettings() {
  const deleteAccount = async () => {
    const confirm = window.confirm(
      "This will permanently delete your Civilink account. This cannot be undone. Continue?"
    );

    if (!confirm) return;

    const token = localStorage.getItem("civilink_token");

    try {
      await fetch("http://localhost:5000/api/users/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.clear();
      window.location.href = "/login";
    } catch {
      alert("Failed to delete account");
    }
  };

  return (
    <section className="settings-card danger">
      <h3>Account</h3>

      <button className="btn danger" onClick={deleteAccount}>
        Delete Account
      </button>
    </section>
  );
}
