import type { AuthProviderType } from "@/lib/auth/auth-provider-types";

export type DataProvider = "local" | "supabase";

/** Active providers (local, supabase) plus future stubs (azure, google). */
export type AuthProvider = AuthProviderType | "azure" | "google";

export const APP_CONFIG = {
  dataProvider: "local" as DataProvider,
  estudiantesDataProvider: "local" as DataProvider,
  authProvider: "local" as AuthProvider,
};
