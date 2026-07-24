import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "../../utils/api";

export function useChangePassword() {
  return useMutation({
    mutationFn: (newPassword) => AuthAPI.changePassword(newPassword),
  });
}