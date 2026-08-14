import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MembershipAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

const MEMBERSHIP_QUERY_KEY = ["user", "membership"];

export function useMembershipRequest() {
  const {showToast} = useToast();
  const queryClient = useQueryClient();
  const { refetchUser } = useAuth();

  const requestMutation = useMutation({
    mutationFn: async () => {
      return MembershipAPI.submit({});
    },
    onSuccess: async () => {
      await refetchUser();
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_QUERY_KEY });
      showToast("Membership request submitted 🙏");
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || "Request failed", {type:"error"});
    },
  });

  return {
    requestMembership: requestMutation.mutateAsync,
    isRequesting: requestMutation.isPending,
  };
}

