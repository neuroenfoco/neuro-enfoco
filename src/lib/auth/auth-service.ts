import type { AuthUser, UserRole } from "@/lib/auth/auth-types";
import type { Permission } from "@/lib/auth/permissions";

export interface AuthService {
  getCurrentUser(): AuthUser | null;
  isAuthenticated(): boolean;
  hasPermission(permission: Permission): boolean;
  hasRole(role: UserRole): boolean;
}
