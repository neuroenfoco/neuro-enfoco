"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import type { ReactNode } from "react";

type AuthRootProviderProps = {
  children: ReactNode;
};

export function AuthRootProvider({ children }: AuthRootProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
