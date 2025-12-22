import React from "react";
import { useNavigate } from "react-router-dom";
import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import LanguageSettings from "./LanguageSettings";
import FeedbackSettings from "./FeedbackSettings";
import "./settings.css";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-page">
      <div className="settings-container">
        <header className="settings-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          <div>
            <h1>Settings</h1>
            <p className="subtitle">
              Manage your Civilink account preferences
            </p>
          </div>
        </header>

        <AccountSettings />
        <AppearanceSettings />
        <LanguageSettings />
        <FeedbackSettings />
      </div>
    </div>
  );
}
