import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DepartmentsAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

const DEPARTMENTS_QUERY_KEY = ["departments"];

export default function useDepartmentActions() {
  const [activatingId, setActivatingId] = useState(null);
  const [deactivatingId, setDeactivatingId] = useState(null);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const invalidateDepartments = () =>
    queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: DepartmentsAPI.create,
    onSuccess: async () => {
      await invalidateDepartments();
      showToast("Department created successfully!", { type: "success" });
    },
    onError: (error) => {
      showToast(error?.message || "Unable to create department.", { type: "error" });
    },
  });

  const activateMutation = useMutation({
    mutationFn: DepartmentsAPI.activate,
    onMutate: (departmentId) => setActivatingId(departmentId),
    onSuccess: async () => {
      await invalidateDepartments();
      showToast("Department activated.", { type: "success" });
    },
    onError: (error) => {
      showToast(error?.message || "Unable to activate department.", { type: "error" });
    },
    onSettled: () => setActivatingId(null),
  });

  const deactivateMutation = useMutation({
    mutationFn: DepartmentsAPI.deactivate,
    onMutate: (departmentId) => setDeactivatingId(departmentId),
    onSuccess: async () => {
      await invalidateDepartments();
      showToast("Department deactivated.", { type: "success" });
    },
    onError: (error) => {
      showToast(error?.message || "Unable to deactivate department.", { type: "error" });
    },
    onSettled: () => setDeactivatingId(null),
  });

  return {
    // CREATE
    createDepartment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    // ACTIVATE
    activateDepartment: activateMutation.mutateAsync,
    isActivating: activateMutation.isPending,
    activatingId,

    // DEACTIVATE
    deactivateDepartment: deactivateMutation.mutateAsync,
    isDeactivating: deactivateMutation.isPending,
    deactivatingId,
  };
}
