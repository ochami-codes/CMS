// src/components/ChurchSwitcher.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChurchAPI } from "../utils/api";
import "../styles/church-switcher.css";

export default function ChurchSwitcher() {
  const { user, switchChurch, activeChurchId, activeChurch } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const memberships = user?.memberships || [];

  /* -------------------------
     Close on outside click
  ------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------------
     Switch church
  ------------------------- */
const handleSwitch = async (activeChurchId) => {
  try {
    await switchChurch(activeChurchId);
    setOpen(false);
  } catch (err) {
    console.error("Switch failed:", err);
  }
};

  /* -------------------------
     Navigation shortcuts
  ------------------------- */
  const goJoin = () => {
    setOpen(false);
    navigate("/join-church");
  };

  const goCreate = () => {
    setOpen(false);
    navigate("/create-church");
  };

  return (
    <div className="church-switcher" ref={dropdownRef}>
      {/* Trigger */}
      <button
        className="church-switcher-btn"
        onClick={() => setOpen(!open)}
      >

        <span className="church-name">
          {activeChurch?.name || "Select Church"}
        </span>

        <span className="arrow">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="church-dropdown">
          <div className="dropdown-section-title">
            Your Churches
          </div>

          {memberships.length > 0 ? (
            memberships.map((m) => (
              <button
                key={m.church_id}
                className={`church-item ${
                  m.church_id === activeChurchId ? "active" : ""
                }`}
                onClick={() => handleSwitch(m.church_id)}
              >
                <div className="church-item-name">
                  {m.church_name}
                </div>

                <div className="church-item-status">
                  {m.status}
                </div>
              </button>
            ))
          ) : (
            <div className="empty-text">
              No churches yet
            </div>
          )}

          {/* Divider */}
          <div className="divider" />

          {/* Actions */}
          <button className="dropdown-action" onClick={goJoin}>
            ➕ Join Church
          </button>

          <button className="dropdown-action" onClick={goCreate}>
            🏗 Create Church
          </button>
        </div>
      )}
    </div>
  );
}
