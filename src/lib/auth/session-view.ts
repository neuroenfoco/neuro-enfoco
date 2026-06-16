import type { AuthUser } from "@/lib/auth/auth-types";
import { getCurrentUser, isAuthenticated } from "@/lib/auth/current-user";
import {
  getPermissionsForRole,
  type Permission,
} from "@/lib/auth/permissions";

export type SessionView = {
  user: AuthUser;
  authenticated: boolean;
  permissions: Permission[];
};

export function getCurrentSessionView(): SessionView {
  const user = getCurrentUser();

  return {
    user,
    authenticated: isAuthenticated(),
    permissions: getPermissionsForRole(user.rol),
  };
}
