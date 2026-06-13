import type { ReactNode } from "react";

type FormBlockProps = {
  number: number;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function FormBlock({ number, title, subtitle, children }: FormBlockProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">
          {number}
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}
