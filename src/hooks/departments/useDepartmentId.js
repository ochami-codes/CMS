import { useMemo } from "react";

import useDepartments from "./useDepartment";

export default function useDepartmentId(code) {
  const {
    departments,
    loading,
    error,
    isError,
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
    isError,
    refresh,
  };
}