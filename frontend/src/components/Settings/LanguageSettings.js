export default function LanguageSettings() {
  const token = localStorage.getItem("civilink_token");

  const changeLanguage = async (lang) => {
    // save locally
    localStorage.setItem("civilink_lang", lang);

    // persist backend
    if (token) {
      try {
        await fetch("http://localhost:5000/api/users/language", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ language: lang })
        });
      } catch {
        // silent fail
      }
    }

    // reload app
    window.location.reload();
  };

  return (
    <section className="settings-card">
      <div className="card-header">
        <h3>Language</h3>
        <p>Choose your preferred language</p>
      </div>

      <div className="option-row">
        <button onClick={() => changeLanguage("en")}>English</button>
        <button onClick={() => changeLanguage("ta")}>தமிழ்</button>
        <button onClick={() => changeLanguage("hi")}>हिंदी</button>
      </div>
    </section>
  );
}
