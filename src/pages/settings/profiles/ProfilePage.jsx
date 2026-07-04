import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import useProfile from "../../../hooks/profiles/useProfile";
import useChangePassword from "../../../hooks/profiles/useChangePassword";
import useMyGivingLedger from "../../../hooks/treasury/useMyGivingLedger";

import ProfileForm from "./ProfileForm";
import Contributions from "./Contributions";

import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Loader from "../../../components/Loader";

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
    >
      {open ? (
        <ChevronUp size={18} />
      ) : (
        <ChevronDown size={18} />
      )}
    </button>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}) {
  return (
    <Card
      title={title}
      action={
        <CollapseToggle
          open={open}
          onClick={onToggle}
        />
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
  } = useProfile();

  const password = useChangePassword();

  const {
    summary,
    transactions,
  } = useMyGivingLedger();

  const [showAccount, setShowAccount] =
    useState(true);

  const [showEdit, setShowEdit] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showContributions,
    setShowContributions,
  ] = useState(false);

  if (loading) {
    return (
      <Loader message="Loading profile..." />
    );
  }

  if (!profile) {
    return (
      <main className={styles.page}>
        <Card>
          <p>Profile not found.</p>
        </Card>
      </main>
    );
  }

  const profileFields = [
    {
      label: "Full Name",
      value: profile.full_name,
      Icon: User,
    },
    {
      label: "Email",
      value: profile.email,
      Icon: Mail,
    },
    {
      label: "Phone",
      value:
        profile.phone || "Not provided",
      Icon: Phone,
    },
  ];

  return (
    <main className={styles.page}>
      <Section
        title="My Account"
        open={showAccount}
        onToggle={() =>
          setShowAccount((prev) => !prev)
        }
      >
        <div className={styles.profileGrid}>
          {profileFields.map(
            ({
              label,
              value,
              Icon,
            }) => (
              <div
                key={label}
                className={styles.profileItem}
              >
                <Icon
                  size={20}
                  className={styles.icon}
                />

                <div>
                  <p className={styles.label}>
                    {label}
                  </p>

                  <p className={styles.value}>
                    {value}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </Section>

      <Section
        title="Edit Profile"
        open={showEdit}
        onToggle={() =>
          setShowEdit((prev) => !prev)
        }
      >
        <ProfileForm
          profile={profile}
          onUpdate={updateProfile}
          loading={updating}
        />
      </Section>

      <Section
        title="Password"
        open={showPassword}
        onToggle={() =>
          setShowPassword((prev) => !prev)
        }
      >
        <div
          className={styles.passwordSection}
        >
          <Button
            variant="secondary"
            onClick={password.toggle}
          >
            <Lock size={18} />
            Change Password
          </Button>

          {password.show && (
            <form
              onSubmit={
                password.changePassword
              }
              className={
                styles.passwordForm
              }
            >
              <Input
                label="New Password"
                type="password"
                value={
                  password.newPassword
                }
                onChange={(e) =>
                  password.setNewPassword(
                    e.target.value
                  )
                }
              />

              <Input
                label="Confirm Password"
                type="password"
                value={
                  password.confirmPassword
                }
                onChange={(e) =>
                  password.setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <Button
                type="submit"
                loading={password.loading}
              >
                Update Password
              </Button>
            </form>
          )}
        </div>
      </Section>

      {summary && (
        <Section
          title="Contributions"
          open={showContributions}
          onToggle={() =>
            setShowContributions(
              (prev) => !prev
            )
          }
        >
          <div className={styles.analytics}>
            <Contributions
              summary={summary}
              transactions={transactions}
            />
          </div>
        </Section>
      )}
    </main>
  );
}

