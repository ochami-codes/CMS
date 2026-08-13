import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Pencil,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import useProfile from "../../../hooks/profiles/useProfile";
import useChangePassword from "../../../hooks/profiles/useChangePassword";
import useMyGivingLedger from "../../../hooks/treasury/useMyGivingLedger";
import { useAuth } from "../../../context/AuthContext";

import ProfileForm from "./ProfileForm";
import Contributions from "./Contributions";
import ChangePassword from "./ChangePassword";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";
import ErrorState from "../../../components/ErrorState";

import styles from "../../../styles/profiles/ProfilePage.module.css";

function CollapseToggle({ open, onClick }) {
  return (
    <button
      type="button"
      className={styles.collapseToggle}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={open ? "Collapse section" : "Expand section"}
    >
      {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
  );
}

function Section({ title, open, onToggle, action, children }) {
  return (
    <Card
      title={title}
      action={
        action || <CollapseToggle open={open} onClick={onToggle} />
      }
    >
      {open && children}
    </Card>
  );
}

export default function ProfilePage() {
  const {
    profile,
    loading,
    updating,
    updateProfile,
    isError: profileError,
    refresh: refreshProfile,
  } = useProfile();

  const password = useChangePassword();
  const { user } = useAuth();

  const hasChurchMembership = user?.churches.some(
    (church) => church.status === "active"
  );

  const {
    summary,
    transactions,
    isError: ledgerError,
    refresh: refreshLedger,
  } = useMyGivingLedger({
    enabled: hasChurchMembership,
  });

  // Section toggles
  const [showAccount, setShowAccount] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showContributions, setShowContributions] = useState(false);

  if (loading) return <Loader />;

  if (profileError) {
    return (
      <ErrorState
        message="Failed to load your profile."
        onRetry={refreshProfile}
      />
    );
  }

  if (!profile) {
    return <ErrorState message="Profile not found." />;
  }

  const profileFields = [
    { label: "Full Name", value: profile.full_name, Icon: User },
    { label: "Email", value: profile.email, Icon: Mail },
    { label: "Phone", value: profile.phone || "Not provided", Icon: Phone },
  ];

  return (
    <main className={styles.page}>
      {/* My Account */}
      <Section
        title="My Account"
        open={showAccount}
        onToggle={() => setShowAccount((prev) => !prev)}
        action={
          <div className={styles.sectionActions}>
            <button
              type="button"
              className={styles.editButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowEdit((prev) => !prev);
                setShowAccount(true);
              }}
              aria-label={showEdit ? "Close profile editor" : "Edit profile"}
            >
              <Pencil size={18} />
            </button>
            <CollapseToggle
              open={showAccount}
              onClick={() => setShowAccount((prev) => !prev)}
            />
          </div>
        }
      >
        {showEdit ? (
          <ProfileForm
            profile={profile}
            onUpdate={updateProfile}
            loading={updating}
          />
        ) : (
          <div className={styles.profileFields}>
            {profileFields.map(({ label, value, Icon }) => (
              <div key={label} className={styles.profileField}>
                <Icon size={18} />
                <div>
                  <span className={styles.fieldLabel}>{label}</span>
                  <span className={styles.fieldValue}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Account Security */}
      <Section
        title="Account Security"
        open={showSecurity}
        onToggle={() => setShowSecurity((prev) => !prev)}
      >
        <div className={styles.securitySection}>

          <div className={styles.divider} />

          {/* PASSWORD */}
          <div className={styles.securityItem}>
            <div className={styles.securityInfo}>
              <Lock size={18} />
              <div>
                <span className={styles.securityLabel}>Password</span>
                <span className={styles.securityValue}>••••••••••••</span>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowChangePassword((prev) => !prev)}
            >
              {showChangePassword ? "Cancel" : "Change Password"}
            </Button>
          </div>

          {showChangePassword && (
            <ChangePassword
              onSuccess={() => setShowChangePassword(false)}
              onCancel={() => setShowChangePassword(false)}
            />
          )}
        </div>
      </Section>

      {/* Contributions */}
      {hasChurchMembership && (
        <Section
          title="Contributions"
          open={showContributions}
          onToggle={() => setShowContributions((prev) => !prev)}
        >
          {ledgerError ? (
            <ErrorState
              message="Failed to load contributions."
              onRetry={refreshLedger}
            />
          ) : summary ? (
            <div className={styles.analytics}>
              <Contributions summary={summary} transactions={transactions} />
            </div>
          ) : (
            <Loader />
          )}
        </Section>
      )}
    </main>
  );
}
