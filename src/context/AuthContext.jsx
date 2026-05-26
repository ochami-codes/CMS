import { createContext, useContext, useMemo } from "react";

import { useAuthCore } from "./useAuthCore";
import { useAuthRoles } from "./useAuthRoles";
import { useAuthMembership } from "./useAuthMembership";
import { useChurchSwitch } from "./useChurchSwitch";
import { useAuthRealtime } from "./useAuthRealtime";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const core = useAuthCore();
  const roles = useAuthRoles(core.user);
  const membership = useAuthMembership(core.user);
  const church = useChurchSwitch(core.fetchMe);

  useAuthRealtime(core.profileId, core.fetchMe, core.authReady);

  const value = useMemo(
    () => ({
      ...core,
      ...roles,
      ...membership,
      ...church,
    }),
    [core, roles, membership, church]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
