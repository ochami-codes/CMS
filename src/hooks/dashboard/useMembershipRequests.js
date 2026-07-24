import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MembershipAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const MEMBERSHIP_QUERY_KEY = ["user", "membership"];

export function useMembershipRequest() {
  const queryClient = useQueryClient();
  const { refetchUser } = useAuth();

  const requestMutation = useMutation({
    mutationFn: async () => {
      return MembershipAPI.submit({});
    },
    onSuccess: async () => {
      await refetchUser();
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_QUERY_KEY });
      toast.success("Membership request submitted 🙏");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Request failed");
    },
  });

  return {
    requestMembership: requestMutation.mutateAsync,
    isRequesting: requestMutation.isPending,
  };
}

