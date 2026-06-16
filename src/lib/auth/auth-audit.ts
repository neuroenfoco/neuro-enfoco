export type AuthReadinessItem = {
  id: string;
  label: string;
  status: "completed" | "pending";
};

export const AUTH_READY_CHECKLIST: AuthReadinessItem[] = [
  {
    id: "auth-service-interface",
    label: "AuthService interface defined",
    status: "completed",
  },
  {
    id: "local-auth-service",
    label: "LocalAuthService with demo administrador",
    status: "completed",
  },
  {
    id: "auth-service-factory",
    label: "getAuthService() factory with provider switch",
    status: "completed",
  },
  {
    id: "app-config-auth-provider",
    label: "APP_CONFIG.authProvider configured",
    status: "completed",
  },
  {
    id: "current-user-adapter",
    label: "current-user.ts delegates to AuthService",
    status: "completed",
  },
  {
    id: "auth-context-provider",
    label: "AuthProvider and useAuth() React context",
    status: "completed",
  },
  {
    id: "layout-wrapped",
    label: "Root layout wrapped with AuthProvider",
    status: "completed",
  },
  {
    id: "user-badge-migrated",
    label: "UserBadge uses useAuth()",
    status: "completed",
  },
  {
    id: "app-shell-migrated",
    label: "AppShell uses useAuth() for nav role checks",
    status: "completed",
  },
  {
    id: "supabase-provider",
    label: "Supabase auth provider implementation",
    status: "pending",
  },
  {
    id: "azure-provider",
    label: "Azure AD auth provider implementation",
    status: "pending",
  },
  {
    id: "google-provider",
    label: "Google OAuth auth provider implementation",
    status: "pending",
  },
  {
    id: "login-screen",
    label: "Login screen and sign-out flow",
    status: "pending",
  },
  {
    id: "session-persistence",
    label: "Session persistence across reloads",
    status: "pending",
  },
  {
    id: "guards-migrated",
    label: "guards.ts and server modules use context-aware auth",
    status: "pending",
  },
  {
    id: "navigation-decoupled",
    label: "navigation.ts fully decoupled from auth",
    status: "completed",
  },
];
