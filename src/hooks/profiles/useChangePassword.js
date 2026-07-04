import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { AuthAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useChangePassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] =
    useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const mutation = useMutation({
    mutationFn: async (password) => {
      return await AuthAPI.changePassword({
        newPassword: password,
      });
    },

    onSuccess: () => {
      showToast(
        "Password updated successfully.",
        "success"
      );

      navigate(
        "/profile/change-password-success",
        {
          state: {
            fromProfile: true,
          },
        }
      );
    },

    onError: (err) => {
      showToast(
        err?.message ??
          "Failed to update password.",
        "error"
      );
    },
  });

  const changePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showToast(
        "Both password fields are required.",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(
        "Passwords do not match.",
        "error"
      );
      return;
    }

    if (newPassword.length < 6) {
      showToast(
        "Password must be at least 6 characters.",
        "error"
      );
      return;
    }

    await mutation.mutateAsync(newPassword);
  };

  return {
    show,
    toggle: () => setShow((v) => !v),

    newPassword,
    setNewPassword,

    confirmPassword,
    setConfirmPassword,

    changePassword,

    loading: mutation.isPending,
  };
}