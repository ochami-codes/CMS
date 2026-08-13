import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (password) => {
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
