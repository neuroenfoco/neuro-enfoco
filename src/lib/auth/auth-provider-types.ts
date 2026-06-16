export type AuthProviderType = "local" | "supabase";

export type AuthSession = {
  userId: string;
  email: string;
  role: string;
};
