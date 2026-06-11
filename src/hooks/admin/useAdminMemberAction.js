import { useState } from "react";
import { AdminAPI } from "../../utils/api";

export function useAdminMemberActions(reload, showToast) {
  const [processingId, setProcessingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const suspendMember = async (id, reason) => {
    try {
      await AdminAPI.suspendMember(id, { reason });
      showToast("Member suspended", "success");
      await reload();
    } catch {
      showToast("Failed to suspend member", "error");
    }
  };

  const unsuspendMember = async (id) => {
    try {
      await AdminAPI.unsuspendMember(id);
      showToast("Member unsuspended", "success");
      await reload();
    } catch {
      showToast("Action failed", "error");
    }
  };

  const activateMember = async (id) => {
    try {
      await AdminAPI.activateMember(id);
      showToast("Member activated", "success");
      await reload();
    } catch {
      showToast("Action failed", "error");
    }
  };

  const updateRoles = async (id, roles) => {
    try {
      setSaving(true);
      await AdminAPI.updateMemberRoles(id, { roles });
      showToast("Roles updated", "success");
      await reload();
    } catch {
      showToast("Failed to update roles", "error");
    } finally {
      setSaving(false);
    }
  };

  return {
    processingId,
    setProcessingId,
    saving,
    suspendMember,
    unsuspendMember,
    activateMember,
    updateRoles,
  };
}