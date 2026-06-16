import type { AuthProvider } from "@/lib/config/app-config";

export type MigrationComplexity = "low" | "medium" | "high";

export type AuthMigrationBlocker = {
  id: string;
  description: string;
  severity: "critical" | "major" | "minor";
};

export type AuthMigrationAudit = {
  currentState: {
    provider: AuthProvider;
    runtime: "LocalAuthService (demo administrador)";
    sessionPersistence: false;
    loginUi: false;
  };
  targetState: {
    provider: "supabase";
    runtime: "SupabaseAuthService with @supabase/supabase-js";
    sessionPersistence: true;
    loginUi: true;
  };
  requiredWork: string[];
  blockers: AuthMigrationBlocker[];
  complexity: MigrationComplexity;
};

export const AUTH_MIGRATION_AUDIT: AuthMigrationAudit = {
  currentState: {
    provider: "local",
    runtime: "LocalAuthService (demo administrador)",
    sessionPersistence: false,
    loginUi: false,
  },
  targetState: {
    provider: "supabase",
    runtime: "SupabaseAuthService with @supabase/supabase-js",
    sessionPersistence: true,
    loginUi: true,
  },
  requiredWork: [
    "Install @supabase/supabase-js and configure environment variables",
    "Implement SupabaseAuthService using AuthService interface",
    "Implement mapSupabaseUserToAuthUser and mapSupabaseSessionToAuthSession",
    "Add Supabase client singleton (browser + server)",
    "Build login screen and sign-out flow",
    "Add session persistence and auth state listener",
    "Migrate guards.ts and server modules to context-aware auth",
    "Switch APP_CONFIG.authProvider from local to supabase",
  ],
  blockers: [
    {
      id: "no-supabase-sdk",
      description: "@supabase/supabase-js not installed (deferred to A17)",
      severity: "critical",
    },
    {
      id: "no-env-vars",
      description: "SUPABASE_URL and SUPABASE_ANON_KEY not configured",
      severity: "critical",
    },
    {
      id: "no-login-ui",
      description: "No login screen or sign-out flow exists",
      severity: "major",
    },
    {
      id: "no-session-persistence",
      description: "Sessions do not survive page reload",
      severity: "major",
    },
    {
      id: "server-auth-guards",
      description: "Server-side guards still assume local demo user",
      severity: "major",
    },
    {
      id: "role-metadata-contract",
      description: "Supabase user_metadata role mapping not validated against production data",
      severity: "minor",
    },
  ],
  complexity: "high",
};
