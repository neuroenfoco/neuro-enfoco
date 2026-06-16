/**
 * Auditoría de preparación de autenticación (PACI-A15.1).
 */

import { AUTH_READY_CHECKLIST } from "@/lib/auth/auth-audit";

export type AuthReadinessAudit = {
  localProviderReady: boolean;
  supabaseProviderReady: boolean;
  routeProtectionReady: boolean;
  serverAuthReady: boolean;
  checklistCompleted: number;
  checklistTotal: number;
  checklistScore: number;
  pendingItems: string[];
};

export function getAuthReadinessAudit(): AuthReadinessAudit {
  const completed = AUTH_READY_CHECKLIST.filter(
    (item) => item.status === "completed"
  );
  const pending = AUTH_READY_CHECKLIST.filter(
    (item) => item.status === "pending"
  );

  return {
    localProviderReady: completed.some((item) => item.id === "local-auth-service"),
    supabaseProviderReady: completed.some((item) => item.id === "supabase-provider"),
    routeProtectionReady: false,
    serverAuthReady: false,
    checklistCompleted: completed.length,
    checklistTotal: AUTH_READY_CHECKLIST.length,
    checklistScore: Math.round(
      (completed.length / AUTH_READY_CHECKLIST.length) * 100
    ),
    pendingItems: pending.map((item) => item.label),
  };
}

export function getAuthReadinessScore(): number {
  const audit = getAuthReadinessAudit();
  const flags = [
    audit.localProviderReady ? 100 : 0,
    audit.supabaseProviderReady ? 100 : 0,
    audit.routeProtectionReady ? 100 : 0,
    audit.serverAuthReady ? 100 : 0,
  ];
  const flagAverage =
    flags.reduce((sum, value) => sum + value, 0) / flags.length;
  return Math.round(flagAverage * 0.4 + audit.checklistScore * 0.6);
}
