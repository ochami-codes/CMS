import { useMemo } from "react";

import useDepartments from "../useDepartment";

export default function useDepartmentId(code) {
  console.log("useDepartmentId rendered");
  const {
    departments,
    loading,
    error,
    refresh,
  } = useDepartments();
console.log("departments:", departments);
  const departmentId = useMemo(
    () =>
      departments.find(
        (department) =>
          department.code === code
      )?.id ?? null,
    [departments, code]
  );

  return {
    departmentId,
    loading,
    error,
    refresh,
  };
}