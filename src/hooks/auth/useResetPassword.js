import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";

export function useResetPassword() {
  return useMutation({
    mutationFn: async (email) => {
      const { data, error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/auth/reset-password-confirm`,
          }
        );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}