import type { AuthService } from "@/lib/auth/auth-service";
import { LocalAuthService } from "@/lib/auth/local-auth-service";
import { SupabaseAuthService } from "@/lib/auth/supabase-auth-service";
import { APP_CONFIG } from "@/lib/config/app-config";

let authServiceInstance: AuthService | null = null;

export function getAuthService(): AuthService {
  if (authServiceInstance) {
    return authServiceInstance;
  }

  switch (APP_CONFIG.authProvider) {
    case "local":
      authServiceInstance = new LocalAuthService();
      return authServiceInstance;
    case "supabase":
      authServiceInstance = new SupabaseAuthService();
      return authServiceInstance;
    case "azure":
    case "google":
      throw new Error(
        `Auth provider "${APP_CONFIG.authProvider}" is not implemented yet`,
      );
    default: {
      const provider: never = APP_CONFIG.authProvider;
      throw new Error(`Unknown auth provider: ${provider}`);
    }
  }
}
