import type { AuthSession } from "@/lib/auth/auth-provider-types";

/**
 * Minimal shape of a Supabase Auth session record.
 * Mirrors @supabase/supabase-js Session fields needed for mapping — no SDK import.
 */
export type SupabaseAuthSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  };
};

/**
 * Contract for mapping a Supabase session into the app's AuthSession model.
 * Implementation deferred to A16.1.
 */
export type SessionMappingContract = {
  mapSupabaseSessionToAuthSession(session: SupabaseAuthSession): AuthSession;
};
