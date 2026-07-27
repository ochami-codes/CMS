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

  const invalidateMembers = () => {
    return queryClient.invalidateQueries({
      queryKey: membersQueryKey,
    });
  };

  const suspendMutation = useMutation({
    mutationFn: ({ memberId, reason }) =>
      AdminAPI.suspendMember({memberId, reason}),

    onSuccess: async () => {
      showToast("Member suspended", "success");
      await invalidateMembers();
    },

    onError: () => {
      showToast(
        "Failed to suspend member",
        "error"
      );
    },
  });

  const unsuspendMutation = useMutation({
    mutationFn: ({memberId}) =>
      AdminAPI.unsuspendMember({memberId}),

    onSuccess: async () => {
      showToast("Member unsuspended", "success");
      await invalidateMembers();
    },

    onError: () => {
      showToast("Action failed", "error");
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id) =>
      AdminAPI.activateMember(id),

    onSuccess: async () => {
      showToast("Member activated", "success");
      await invalidateMembers();
    },

    onError: () => {
      showToast("Action failed", "error");
    },
  });

  const updateRolesMutation = useMutation({
    mutationFn: ({ memberId, roles }) =>
      AdminAPI.updateMemberRoles({memberId, roles}),

    onSuccess: async () => {
      showToast("Roles updated", "success");
      await invalidateMembers();
    },

    onError: () => {
      showToast(
        "Failed to update roles",
        "error"
      );
    },
  });

  return {
    suspendMember: suspendMutation.mutateAsync,
    unsuspendMember: unsuspendMutation.mutateAsync,
    activateMember: activateMutation.mutateAsync,
    updateRoles: updateRolesMutation.mutateAsync,

    processingId:
  suspendMutation.variables?.memberId ??
  unsuspendMutation.variables?.memberId ??
  activateMutation.variables ??
  null,

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