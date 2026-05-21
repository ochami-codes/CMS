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
    activeMembership,
  } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [switchingChurchId, setSwitchingChurchId] = useState(null);

  const dropdownRef = useRef(null);

  const memberships = user?.memberships || [];

  /* close on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = async (churchId) => {
    try {
      setSwitchingChurchId(churchId);

      await switchChurch(churchId);

      setOpen(false);
    } catch (err) {
      console.error("Switch failed:", err);
    } finally {
      setSwitchingChurchId(null);
    }
  };

  const goJoin = () => {
    setOpen(false);
    navigate("/join-church");
  };

  const goCreate = () => {
    setOpen(false);
    navigate("/create-church");
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>

      {/* TRIGGER */}
      <button
        className={styles.trigger}
        onClick={() => setOpen(prev => !prev)}
      >
        <span className={styles.name}>
          {activeMembership?.churches?.name || "Select Church"}
        </span>

        <span className={styles.arrow}>
          ▾
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className={styles.dropdown}>

          <div className={styles.sectionTitle}>
            Your Churches
          </div>

          {memberships.length > 0 ? (
            memberships.map((m) => {
              const isActive = m.church_id === activeChurchId;
              const isSwitching = switchingChurchId === m.church_id;

              return (
                <button
                  key={m.church_id}
                  className={`${styles.item} ${
                    isActive ? styles.active : ""
                  }`}
                  disabled={isSwitching}
                  onClick={() => handleSwitch(m.church_id)}
                >

                  <div>
                    <div className={styles.itemName}>
                      {m?.churches?.name || "Unnamed Church"}
                    </div>

                    <div className={styles.itemStatus}>
                      {m.status}
                    </div>
                  </div>

                  <div className={styles.icon}>
                    {isSwitching ? (
                      <Loader2 size={16} className={styles.spin} />
                    ) : isActive ? (
                      <Check size={16} />
                    ) : null}
                  </div>

                </button>
              );
            })
          ) : (
            <div className={styles.empty}>
              No churches yet
            </div>
          )}

          <div className={styles.divider} />

          <button className={styles.action} onClick={goJoin}>
            ➕ Join Church
          </button>

          <button className={styles.action} onClick={goCreate}>
            🏗 Create Church
          </button>

        </div>
      )}

    </div>
  );
}
