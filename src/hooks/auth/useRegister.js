import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "../../utils/api";

export function useRegister() {
  return useMutation({
    mutationFn: (payload) => AuthAPI.register(payload),
  });
}