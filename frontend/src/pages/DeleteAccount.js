export default function DeleteAccount() {
  return (
    <div style={{maxWidth: "800px", margin: "40px auto", fontFamily: "Arial"}}>
      
      <h1>Civilink Account Deletion</h1>

      <p>
        Users can delete their Civilink account directly from the app settings.
      </p>

      <h3>Steps to delete your account</h3>

      <ol>
        <li>Open the Civilink app</li>
        <li>Go to <strong>Settings</strong></li>
        <li>Select <strong>Account</strong></li>
        <li>Click <strong>Delete Account</strong></li>
        <li>Confirm the deletion request</li>
      </ol>

      <h3>Data that will be deleted</h3>

      <ul>
        <li>User profile information</li>
        <li>Posts and project uploads</li>
        <li>Property listings</li>
        <li>Messages and activity history</li>
      </ul>

      <h3>Data retention</h3>

      <p>
        Some information may be retained for up to <strong>30 days</strong> for
        legal, security, and fraud prevention purposes before permanent deletion.
      </p>

      <p>
        For assistance contact: <strong>civilink.official@gmail.com</strong>
      </p>

    </div>
  );
}