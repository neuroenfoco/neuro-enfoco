import {
  BrainIcon,
  CalendarIcon,
  ChartIcon,
  LayoutDashboardIcon,
  TargetIcon,
  UsersIcon,
  type NavIconComponent,
} from "@/components/layout/nav-icons";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getAppNavItems,
  type AppNavId,
  type AppNavItem,
} from "@/lib/copy/navigation";
import Link from "next/link";

const NAV_ICONS: Record<AppNavId, NavIconComponent> = {
  dashboard: LayoutDashboardIcon,
  estudiantes: UsersIcon,
  intervenciones: CalendarIcon,
  objetivos: TargetIcon,
  reportes: ChartIcon,
};

type AppShellProps = {
  activeNav: AppNavId;
  children: React.ReactNode;
  /** Texto del recuadro «Enfoque»; por defecto el del sidebar principal. */
  focusText?: string;
};

export function AppShell({ activeNav, children, focusText }: AppShellProps) {
  const navItems = getAppNavItems(activeNav);
  const focus = focusText ?? GLOSSARY.app.focusSidebar;

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-teal-900/5 bg-white">
        <div className="flex h-[4.25rem] items-center gap-2.5 border-b border-teal-900/5 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 shadow-sm shadow-teal-600/20">
            <BrainIcon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
              {GLOSSARY.app.name}
            </p>
            <p className="truncate text-[11px] font-medium text-teal-700/80">
              {GLOSSARY.app.tagline}
            </p>
          </div>
        </div>

        <div className="mx-3 mt-4 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-emerald-50/50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700/70">
            Enfoque
          </p>
          <p className="mt-0.5 text-xs leading-snug text-slate-600">{focus}</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => (
            <AppNavLink key={item.id} item={item} icon={NAV_ICONS[item.id]} />
          ))}
        </nav>

        <div className="border-t border-teal-900/5 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800">
              NE
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {GLOSSARY.app.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {GLOSSARY.app.institucionNeutra}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-64">{children}</div>
    </div>
  );
}

function AppNavLink({
  item,
  icon: Icon,
}: {
  item: AppNavItem;
  icon: NavIconComponent;
}) {
  const className = `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    item.active
      ? "bg-teal-50 text-teal-900"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;

  const iconClassName = `h-[18px] w-[18px] shrink-0 ${
    item.active
      ? "text-teal-700"
      : "text-slate-400 group-hover:text-teal-600/80"
  }`;

  const content = (
    <>
      <Icon className={iconClassName} />
      {item.label}
    </>
  );

  if (item.href === "#") {
    return (
      <span
        className={`${className} cursor-default`}
        aria-current={item.active ? "page" : undefined}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      aria-current={item.active ? "page" : undefined}
    >
      {content}
    </Link>
  );
}
