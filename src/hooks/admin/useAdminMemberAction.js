import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
export function useAdminMemberActions(
  activeChurchId,
) {
  const queryClient = useQueryClient();

  const membersQueryKey = [
    "admin",
    "members",
    activeChurchId,
  ];

  const refreshMembers = () => {
    queryClient.invalidateQueries({
      queryKey: membersQueryKey,
    });
  };
  const { showToast } = useToast();
  const suspendMutation = useMutation({
    mutationFn: ({ memberId, reason }) =>
      AdminAPI.suspendMember({ memberId, reason }),

    onSuccess: () => {
      showToast("Member suspended");
      refreshMembers();
    },

    onError: () => {
      showToast("Failed to suspend member", {type: "error"});
    },
  });

  const unsuspendMutation = useMutation({
    mutationFn: ({ memberId }) =>
      AdminAPI.unsuspendMember({ memberId }),

    onSuccess: () => {
      showToast("Member unsuspended");
      refreshMembers();
    },

    onError: () => {
      showToast("Action failed", {type: "error"});
    },
  });

  const activateMutation = useMutation({
    mutationFn: ({ memberId }) =>
      AdminAPI.activateMember({ memberId }),

    onSuccess: () => {
      showToast("Member activated");
      refreshMembers();
    },

    onError: () => {
      showToast("Action failed", {type:"error"});
    },
  });

  const updateRolesMutation = useMutation({
    mutationFn: ({ memberId, roles }) =>
      AdminAPI.updateMemberRoles({
        memberId,
        roles,
      }),

    onSuccess: () => {
      showToast("Roles updated");
      refreshMembers();
    },

    onError: () => {
      showToast(
        "Failed to update roles",
        {type: "error"}
      );
    },
  });

  const processingId =
    suspendMutation.isPending
      ? suspendMutation.variables?.memberId
      : unsuspendMutation.isPending
      ? unsuspendMutation.variables?.memberId
      : activateMutation.isPending
      ? activateMutation.variables?.memberId
      : null;

  return {
    suspendMember: suspendMutation.mutateAsync,
    unsuspendMember: unsuspendMutation.mutateAsync,
    activateMember: activateMutation.mutateAsync,
    updateRoles: updateRolesMutation.mutateAsync,

    processingId,

    saving: updateRolesMutation.isPending,

    processing:
      suspendMutation.isPending ||
      unsuspendMutation.isPending ||
      activateMutation.isPending,

    suspendError: suspendMutation.error,
    unsuspendError: unsuspendMutation.error,
    activateError: activateMutation.error,
    updateRolesError: updateRolesMutation.error,
  };
}