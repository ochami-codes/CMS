import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "../../utils/api";

export function useResetPassword() {
  return useMutation({
    mutationFn: (email) => AuthAPI.resetPassword(email.trim()),
  });
}