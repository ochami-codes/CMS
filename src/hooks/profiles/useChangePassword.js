// src/hooks/profiles/useChangePassword.js

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { ProfileAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export default function useChangePassword() {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const mutation = useMutation({
    mutationFn: (password) =>
      ProfileAPI.changePassword({
        newPassword: password,
      }),

    onSuccess: async (data) => {
      setNewPassword("");
      setConfirmPassword("");

      showToast(
        data?.message ||
          "Password updated successfully. Please sign in again.",
        "success"
      );

      if (data?.logout) {
        await logout();
      }
    },

    onError: (err) => {
      showToast(
        err?.message ||
          "Failed to update password.",
        "error"
      );
    },
  });

  const changePassword = async (e) => {
    e.preventDefault();

    if (mutation.isPending) {
      return false;
    }

    if (!newPassword || !confirmPassword) {
      showToast(
        "Both password fields are required.",
        "error"
      );

      return false;
    }

    if (newPassword !== confirmPassword) {
      showToast(
        "Passwords do not match.",
        "error"
      );

      return false;
    }

    if (newPassword.length < 6) {
      showToast(
        "Password must be at least 6 characters.",
        "error"
      );

      return false;
    }

    await mutation.mutateAsync(newPassword);

    return true;
  };

  return {
    newPassword,
    setNewPassword,

    confirmPassword,
    setConfirmPassword,

    changePassword,

    loading: mutation.isPending,

    isError: mutation.isError,

    error: mutation.error,
  };
}