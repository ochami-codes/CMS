// src/profiles/ChangePassword.jsx

import { useEffect, useState } from "react";

import Input from "../../../components/Input";
import Button from "../../../components/Button";

import useChangePassword from "../../../hooks/profiles/useChangePassword";
import { isStrongPassword } from "../../../utils/validators/validators";

import styles from "../../../styles/profiles/ChangePassword.module.css";

export default function ChangePassword({
  onSuccess,
  onCancel,
}) {
  const password = useChangePassword();

  const [passwordStrength, setPasswordStrength] =
    useState("");

  /* ---------------------------------------------------------
     PASSWORD STRENGTH
     --------------------------------------------------------- */

  useEffect(() => {
    if (!password.newPassword) {
      setPasswordStrength("");
      return;
    }

    if (isStrongPassword(password.newPassword)) {
      setPasswordStrength("Strong password");
    } else if (password.newPassword.length >= 6) {
      setPasswordStrength(
        "Weak: include letters and numbers"
      );
    } else {
      setPasswordStrength("Too short");
    }
  }, [password.newPassword]);

  /* ---------------------------------------------------------
     SUBMIT
     --------------------------------------------------------- */
const handleSubmit = async (e) => {
  const success = await password.changePassword(e);

  if (success) {
    onSuccess?.();
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <Input
        label="New password"
        type="password"
        value={password.newPassword}
        onChange={(e) =>
          password.setNewPassword(e.target.value)
        }
        placeholder="At least 6 characters"
        required
        disabled={password.loading}
        autoComplete="new-password"
      />

      {passwordStrength && (
        <p
          className={`${styles.helper} ${
            passwordStrength === "Strong password"
              ? styles.success
              : styles.warning
          }`}
        >
          {passwordStrength}
        </p>
      )}

      <Input
        label="Confirm new password"
        type="password"
        value={password.confirmPassword}
        onChange={(e) =>
          password.setConfirmPassword(e.target.value)
        }
        placeholder="Repeat new password"
        required
        disabled={password.loading}
        autoComplete="new-password"
      />

      <div className={styles.actions}>
        <Button
          type="submit"
          loading={password.loading}
          disabled={password.loading}
        >
          Update Password
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={password.loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}