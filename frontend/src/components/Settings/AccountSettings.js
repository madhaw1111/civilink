export default function AccountSettings() {
  return (
    <section className="settings-card danger">
      <div className="card-header">
        <h3>Account</h3>
        <p>Manage your account status</p>
      </div>

      <div className="card-row">
        <div>
          <strong>Delete account</strong>
          <p className="muted">
            Permanently remove your Civilink account and all data
          </p>
        </div>

        <button className="btn-danger">
          Delete
        </button>
      </div>
    </section>
  );
}
