// src/hooks/useRole.js
import { useMemo } from "react";
import useAuth from "./useAuth";
import { roles as roleConstants } from "../utils/roles";

export default function useRole() {
  const { user } = useAuth();

  // Assuming your user object has a role property: user.role
  const role = useMemo(() => user?.role || null, [user]);

  const isAdmin = role === roleConstants.ADMIN;
  const isPastor = role === roleConstants.PASTOR;
  const isTreasury = role === roleConstants.TREASURY;
  const isYouth = role === roleConstants.YOUTH;
  const isChildren = role === roleConstants.CHILDREN;
  const isComms = role === roleConstants.COMMS;

  return { role, isAdmin, isPastor, isTreasury, isYouth, isChildren, isComms };
}