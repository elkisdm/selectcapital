import { type FC, type ReactNode } from 'react';

const cn = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

type BadgeTone = 'jade' | 'cobre' | 'neutral';
type ActionVariant = 'primary' | 'ghost';

export interface ProjectBadge {
  label: string;
  icon?: ReactNode;
  tone?: BadgeTone;
}

export interface ProjectKPI {
  label: string;
  value: string;
  helper?: string;
  trend?: 'up' | 'down';
}

export interface ProjectCardAction {
  label: string;
  href?: string;
  icon?: ReactNode;
  variant?: ActionVariant;
  external?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface ProjectCardProps {
  title: string;
  location: string;
  priceUF: string;
  pieLabel?: string;
  rentNetLabel?: string;
  deliveryLabel?: string;
  highlight?: string;
  cover?: { src: string; alt: string };
  badges?: ProjectBadge[];
  kpis?: ProjectKPI[];
  actions?: ProjectCardAction[];
  className?: string;
}

const BADGE_STYLES: Record<BadgeTone, string> = {
  jade: 'bg-[#35E1A6]/15 text-[#35E1A6] border-[#35E1A6]/30',
  cobre: 'bg-[#CBA07A]/15 text-[#CBA07A] border-[#CBA07A]/30',
  neutral: 'bg-white/5 text-white/70 border-white/10',
};

const ACTION_STYLES: Record<ActionVariant, string> = {
  primary:
    'bg-[#35E1A6] text-[#0B0E12] hover:brightness-105 focus-visible:ring-[#35E1A6]/40 shadow-[0_8px_24px_rgba(53,225,166,.35)]',
  ghost: 'text-white hover:text-white/80 border border-white/15 hover:bg-white/5',
};

export const ProjectCard: FC<ProjectCardProps> = ({
  title,
  location,
  priceUF,
  pieLabel,
  rentNetLabel,
  deliveryLabel,
  highlight,
  cover,
  badges = [],
  kpis = [],
  actions = [],
  className,
}) => (
  <article
    className={cn(
      'relative flex flex-col gap-5 rounded-[28px] border border-white/10 bg-[#0E141B] p-6 text-white shadow-[0_20px_60px_rgba(2,6,23,.65)]',
      className
    )}
  >
    {highlight && (
      <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
        <span className="h-1.5 w-1.5 rounded-full bg-[#35E1A6]" aria-hidden="true" />
        <span>{highlight}</span>
      </div>
    )}

    <div className="space-y-3 pr-28">
      <p className="text-sm uppercase tracking-[0.4em] text-white/50">{location}</p>
      <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
      <div className="flex flex-wrap gap-3 text-sm text-white/75">
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 font-semibold">
          Desde <span className="ml-2 text-[#35E1A6]">{priceUF} UF</span>
        </span>
        {pieLabel && (
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em]">
            {pieLabel}
          </span>
        )}
        {deliveryLabel && (
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em]">
            {deliveryLabel}
          </span>
        )}
      </div>
      {rentNetLabel && <p className="text-sm text-white/70">Rentabilidad estimada: {rentNetLabel}</p>}
    </div>

    {cover && (
      <div className="overflow-hidden rounded-[22px] border border-white/10">
        <img src={cover.src} alt={cover.alt} className="h-52 w-full object-cover" loading="lazy" />
      </div>
    )}

    {badges.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {badges.map(({ label, icon, tone = 'neutral' }, idx) => (
          <span
            key={`${label}-${idx}`}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm',
              BADGE_STYLES[tone]
            )}
          >
            {icon && <span aria-hidden="true">{icon}</span>}
            {label}
          </span>
        ))}
      </div>
    )}

    {kpis.length > 0 && (
      <dl className="grid gap-4 sm:grid-cols-2">
        {kpis.map(({ label, value, helper, trend }, idx) => (
          <div key={`${label}-${idx}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-[0.35em] text-white/55">{label}</dt>
            <dd className="mt-1 flex items-baseline gap-2 text-2xl font-semibold">
              {value}
              {trend && (
                <span className={cn('text-xs font-medium', trend === 'up' ? 'text-[#35E1A6]' : 'text-[#F87171]')}>
                  {trend === 'up' ? '\u25B2' : '\u25BC'}
                </span>
              )}
            </dd>
            {helper && <p className="text-xs text-white/60">{helper}</p>}
          </div>
        ))}
      </dl>
    )}

    {rentNetLabel && (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
        <p className="font-semibold text-white">Flujo neto estimado</p>
        <p className="text-2xl font-semibold text-[#35E1A6]">{rentNetLabel}</p>
        <p className="text-xs text-white/60">Incluye dividendos, arriendo proyectado y gastos comunes</p>
      </div>
    )}

    {actions.length > 0 && (
      <div className="flex flex-wrap gap-3">
        {actions.map(({ href, label, icon, variant = 'primary', external, onClick, className }, idx) => {
          const baseClasses = cn(
            'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
            ACTION_STYLES[variant],
            className
          );
          if (href) {
            const rel = external ? 'noopener noreferrer' : undefined;
            const target = external ? '_blank' : undefined;
            return (
              <a key={`${label}-${idx}`} href={href} className={baseClasses} rel={rel} target={target}>
                {icon && <span aria-hidden="true">{icon}</span>}
                {label}
              </a>
            );
          }
          return (
            <button
              key={`${label}-${idx}`}
              type="button"
              className={baseClasses}
              onClick={onClick}
            >
              {icon && <span aria-hidden="true">{icon}</span>}
              {label}
            </button>
          );
        })}
      </div>
    )}
  </article>
);
