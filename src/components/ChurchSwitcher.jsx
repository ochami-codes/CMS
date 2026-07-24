import {
  useState,
  useRef,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Loader2,
  Check,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import styles from "../styles/components/ChurchSwitcher.module.css";

export default function ChurchSwitcher() {
  const {
    user,
    switchChurch,
    activeChurchId,
    activeChurchName,
  } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] =
    useState(false);

  const [
    switchingChurchId,
    setSwitchingChurchId,
  ] = useState(null);

  const dropdownRef =
    useRef(null);

  /* -------------------------
     User Churches
  ------------------------- */

  const churches =
    user?.churches ?? [];

  /* -------------------------
     Close on Outside Click
  ------------------------- */

  useEffect(() => {
    const handleClickOutside = (e) => {
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
     Switch Church
  ------------------------- */

  const handleSwitch = async (
    churchId
  ) => {
    // Already active
    if (
      churchId === activeChurchId
    ) {
      setOpen(false);
      return;
    }

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
     Navigation
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
    <div
      className={styles.wrapper}
      ref={dropdownRef}
    >
      {/* -------------------------
          Trigger
      ------------------------- */}

      <button
        className={styles.trigger}
        onClick={() =>
          setOpen(
            (prev) => !prev
          )
        }
      >
        <span
          className={styles.name}
        >
          {activeChurchName ??
            "Select Church"}
        </span>

        <span
          className={styles.arrow}
        >
          ▾
        </span>
      </button>

      {/* -------------------------
          Dropdown
      ------------------------- */}

      {open && (
        <div
          className={
            styles.dropdown
          }
        >
          <div
            className={
              styles.sectionTitle
            }
          >
            Your Churches
          </div>

          {churches.length > 0 ? (
            churches.map(
              (church) => {
                const isActive =
                  church.id ===
                  activeChurchId;

                const isSwitching =
                  switchingChurchId ===
                  church.id;

                return (
                  <button
                    key={church.id}
                    className={`${
                      styles.item
                    } ${
                      isActive
                        ? styles.active
                        : ""
                    }`}
                    disabled={
                      isSwitching
                    }
                    onClick={() =>
                      handleSwitch(
                        church.id
                      )
                    }
                  >
                    <div>
                      <div
                        className={
                          styles.itemName
                        }
                      >
                        {church.name ??
                          "Unnamed Church"}
                      </div>

                      <div
                        className={
                          styles.itemStatus
                        }
                      >
                        {church.status ??
                          "unknown"}
                      </div>
                    </div>

                    <div
                      className={
                        styles.icon
                      }
                    >
                      {isSwitching ? (
                        <Loader2
                          size={16}
                          className={
                            styles.spin
                          }
                        />
                      ) : isActive ? (
                        <Check
                          size={16}
                        />
                      ) : null}
                    </div>
                  </button>
                );
              }
            )
          ) : (
            <div
              className={
                styles.empty
              }
            >
              No churches yet
            </div>
          )}

          <div
            className={
              styles.divider
            }
          />

          <button
            className={
              styles.action
            }
            onClick={goJoin}
          >
            ➕ Join Church
          </button>

          <button
            className={
              styles.action
            }
            onClick={goCreate}
          >
            🏗 Create Church
          </button>
        </div>
      )}
    </div>
  );
}
