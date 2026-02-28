export default function AppearanceSettings() {
  const token = localStorage.getItem("token");

  const applyTheme = (theme) => {
    let finalTheme = theme;

    // 🔑 Handle system theme correctly
    if (theme === "system") {
      finalTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.documentElement.setAttribute("data-theme", finalTheme);
    localStorage.setItem("civilink_theme", theme);
  };

  const setTheme = async (theme) => {
    // 1️⃣ Apply immediately (UX first)
    applyTheme(theme);

    // 2️⃣ Persist to backend (silent)
    if (token) {
      try {
        await fetch("/api/users/theme", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ theme })
        });
      } catch {
        // silent fail
      }
    }
  };

  return (
    <section className="settings-card">
      <div className="card-header">
        <h3>Appearance</h3>
        <p>Choose how Civilink looks</p>
      </div>

      <div className="option-row">
        <button onClick={() => setTheme("light")}>
          Light
        </button>

        <button onClick={() => setTheme("dark")}>
          Dark
        </button>

        <button onClick={() => setTheme("system")}>
          System
        </button>
      </div>
    </section>
  );
}
