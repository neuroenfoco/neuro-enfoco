"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { AuthUser, UserRole } from "@/lib/auth/auth-types";
import { getAuthService } from "@/lib/auth/auth-service-factory";
import type { Permission } from "@/lib/auth/permissions";

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasPermission(permission: Permission): boolean;
  hasRole(role: UserRole): boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const value = useMemo<AuthContextValue>(() => {
    const authService = getAuthService();

    return {
      user: authService.getCurrentUser(),
      isAuthenticated: authService.isAuthenticated(),
      hasPermission: (permission) => authService.hasPermission(permission),
      hasRole: (role) => authService.hasRole(role),
    };
  }, []);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
