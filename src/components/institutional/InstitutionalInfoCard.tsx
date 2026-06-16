"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import Link from "next/link";

export type InstitutionalInfoCardVariant =
  | "info"
  | "orientacion"
  | "recomendacion";

type InstitutionalInfoCardProps = {
  variant: InstitutionalInfoCardVariant;
  title?: string;
  body: string;
  detail?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
};

const VARIANT_STYLES: Record<
  InstitutionalInfoCardVariant,
  { container: string; title: string }
> = {
  info: {
    container:
      "border-indigo-200/60 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/20",
    title: "text-indigo-800",
  },
  orientacion: {
    container: "border-slate-200/80 bg-slate-50/80",
    title: "text-slate-700",
  },
  recomendacion: {
    container:
      "border-amber-200/70 bg-gradient-to-br from-amber-50/60 via-white to-violet-50/20",
    title: "text-amber-900",
  },
};

export function InstitutionalInfoCard({
  variant,
  title,
  body,
  detail,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className = "",
}: InstitutionalInfoCardProps) {
  const copy = GLOSSARY.institutionalGuidance.cardTitles;
  const styles = VARIANT_STYLES[variant];
  const resolvedTitle = title ?? copy[variant];

  const ctaContent =
    ctaLabel && ctaHref ? (
      <Link
        href={ctaHref}
        className="mt-3 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-900"
      >
        {ctaLabel}
      </Link>
    ) : ctaLabel && onCtaClick ? (
      <button
        type="button"
        onClick={onCtaClick}
        className="mt-3 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-900"
      >
        {ctaLabel}
      </button>
    ) : null;

  return (
    <aside
      className={`rounded-2xl border p-5 shadow-[0_1px_3px_rgba(15,60,50,0.04)] sm:p-6 ${styles.container} ${className}`}
      role="note"
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wide ${styles.title}`}
      >
        {resolvedTitle}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{body}</p>
      {detail ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{detail}</p>
      ) : null}
      {ctaContent}
    </aside>
  );
}
