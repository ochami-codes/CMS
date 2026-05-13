// src/components/ChurchSwitcher.jsx

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Loader2,
  Check,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "../styles/church-switcher.css";

export default function ChurchSwitcher() {
  const {
    user,
    switchChurch,

    activeChurchId,
    activeMembership,
  } = useAuth();

  const navigate =
    useNavigate();

  const [open, setOpen] =
    useState(false);

  const [
    switchingChurchId,
    setSwitchingChurchId,
  ] = useState(null);

  const dropdownRef =
    useRef(null);

  const memberships =
    user?.memberships || [];

  /* -------------------------
     Close on outside click
  ------------------------- */

  useEffect(() => {
    const handleClickOutside =
      (e) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            e.target
          )
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  /* -------------------------
     Switch church
  ------------------------- */

  const handleSwitch =
    async (churchId) => {
      try {
        setSwitchingChurchId(
          churchId
        );

        await switchChurch(
          churchId
        );

        setOpen(false);
      } catch (err) {
        console.error(
          "Switch failed:",
          err
        );
      } finally {
        setSwitchingChurchId(
          null
        );
      }
    };

  /* -------------------------
     Navigation shortcuts
  ------------------------- */

  const goJoin = () => {
    setOpen(false);

    navigate(
      "/join-church"
    );
  };

  const goCreate = () => {
    setOpen(false);

    navigate(
      "/create-church"
    );
  };

  return (
    <div
      className="church-switcher"
      ref={dropdownRef}
    >
      {/* Trigger */}

      <button
        className="church-switcher-btn"
        onClick={() =>
          setOpen(!open)
        }
      >
        <span className="church-name">
          {activeMembership
            ?.churches?.name ||
            "Select Church"}
        </span>

        <span className="arrow">
          ▾
        </span>
      </button>

      {/* Dropdown */}

      {open && (
        <div className="church-dropdown">

          <div className="dropdown-section-title">
            Your Churches
          </div>

          {memberships.length >
          0 ? (
            memberships.map(
              (m) => {
                const isActive =
                  m.church_id ===
                  activeChurchId;

                const isSwitching =
                  switchingChurchId ===
                  m.church_id;

                return (
                  <button
                    key={
                      m.church_id
                    }
                    className={`church-item ${
                      isActive
                        ? "active"
                        : ""
                    }`}
                    disabled={
                      isSwitching
                    }
                    onClick={() =>
                      handleSwitch(
                        m.church_id
                      )
                    }
                  >
                    <div className="church-item-content">

                      <div className="church-item-name">
                        {m
                          ?.churches
                          ?.name ||
                          "Unnamed Church"}
                      </div>

                      <div className="church-item-status">
                        {
                          m.status
                        }
                      </div>
                    </div>

                    <div className="church-item-icon">
                      {isSwitching ? (
                        <Loader2
                          size={
                            16
                          }
                          className="spin"
                        />
                      ) : isActive ? (
                        <Check
                          size={
                            16
                          }
                        />
                      ) : null}
                    </div>
                  </button>
                );
              }
            )
          ) : (
            <div className="empty-text">
              No churches yet
            </div>
          )}

          {/* Divider */}

          <div className="divider" />

          {/* Actions */}

          <button
            className="dropdown-action"
            onClick={goJoin}
          >
            ➕ Join Church
          </button>

          <button
            className="dropdown-action"
            onClick={goCreate}
          >
            🏗 Create Church
          </button>
        </div>
      )}
    </div>
  );
}
