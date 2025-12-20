import React, { useState } from "react";
import "./LocationModal.css";

export default function LocationModal({ onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [manualLocation, setManualLocation] = useState("");

  /* ================= CURRENT LOCATION ================= */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Reverse geocode using Google
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
        );
        const data = await res.json();

        const address = data.results[0]?.address_components || [];
        const city =
          address.find(a => a.types.includes("locality"))?.long_name ||
          "Unknown";
        const state =
          address.find(a => a.types.includes("administrative_area_level_1"))?.long_name ||
          "";

        onSave({
          type: "current",
          city,
          state,
          lat: latitude,
          lng: longitude
        });

        setLoading(false);
        onClose();
      },
      () => {
        alert("Unable to fetch location");
        setLoading(false);
      }
    );
  };

  /* ================= MANUAL LOCATION ================= */
  const saveManualLocation = () => {
    if (!manualLocation.trim()) return;

    onSave({
      type: "manual",
      city: manualLocation,
      lat: null,
      lng: null
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="location-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Choose Location</h3>

        <button
          className="btn primary full"
          onClick={useCurrentLocation}
          disabled={loading}
        >
          📍 Use Current Location
        </button>

        <div className="divider">OR</div>

        <input
          placeholder="Enter city or area"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
        />

        <button
          className="btn outline full"
          onClick={saveManualLocation}
        >
          📌 Set Location
        </button>

        <button className="btn subtle full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
