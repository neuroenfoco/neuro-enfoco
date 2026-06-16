import type { AuthUser, UserRole } from "@/lib/auth/auth-types";
import type { AuthService } from "@/lib/auth/auth-service";
import type { Permission } from "@/lib/auth/permissions";

export class SupabaseAuthService implements AuthService {
  getCurrentUser(): AuthUser | null {
    throw new Error("SupabaseAuthService not implemented");
  }

  isAuthenticated(): boolean {
    throw new Error("SupabaseAuthService not implemented");
  }

  hasPermission(_permission: Permission): boolean {
    throw new Error("SupabaseAuthService not implemented");
  }

  hasRole(_role: UserRole): boolean {
    throw new Error("SupabaseAuthService not implemented");
  }
}
