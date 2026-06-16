import type { AuthUser, UserRole, UserStatus } from "@/lib/auth/auth-types";

/**
 * Minimal shape of a Supabase Auth user record.
 * Mirrors @supabase/supabase-js User fields needed for mapping — no SDK import.
 */
export type SupabaseAuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

/**
 * Contract for mapping a Supabase user into the app's AuthUser model.
 * Implementation deferred to A16.1.
 */
export type UserMappingContract = {
  mapSupabaseUserToAuthUser(user: SupabaseAuthUser): AuthUser;
};

export type UserMappingDefaults = {
  defaultRole: UserRole;
  defaultStatus: UserStatus;
  metadataRoleKey: string;
  metadataNombreKey: string;
};

export const USER_MAPPING_DEFAULTS: UserMappingDefaults = {
  defaultRole: "docente",
  defaultStatus: "activo",
  metadataRoleKey: "rol",
  metadataNombreKey: "nombre",
};
