import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "../../utils/api";

export function useAdminMemberActions(
  activeChurchId,
  showToast
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

  const suspendMutation = useMutation({
    mutationFn: ({ memberId, reason }) =>
      AdminAPI.suspendMember({ memberId, reason }),

    onSuccess: () => {
      showToast("Member suspended", "success");
      refreshMembers();
    },

    onError: () => {
      showToast("Failed to suspend member", "error");
    },
  });

  const unsuspendMutation = useMutation({
    mutationFn: ({ memberId }) =>
      AdminAPI.unsuspendMember({ memberId }),

    onSuccess: () => {
      showToast("Member unsuspended", "success");
      refreshMembers();
    },

    onError: () => {
      showToast("Action failed", "error");
    },
  });

  const activateMutation = useMutation({
    mutationFn: ({ memberId }) =>
      AdminAPI.activateMember({ memberId }),

    onSuccess: () => {
      showToast("Member activated", "success");
      refreshMembers();
    },

    onError: () => {
      showToast("Action failed", "error");
    },
  });

  const updateRolesMutation = useMutation({
    mutationFn: ({ memberId, roles }) =>
      AdminAPI.updateMemberRoles({
        memberId,
        roles,
      }),

    onSuccess: () => {
      showToast("Roles updated", "success");
      refreshMembers();
    },

    onError: () => {
      showToast(
        "Failed to update roles",
        "error"
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