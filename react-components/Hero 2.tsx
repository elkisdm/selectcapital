import { type FC, type ReactNode } from 'react';

const cn = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

type HeroCTAVariant = 'primary' | 'secondary' | 'ghost';

export interface HeroCTA {
  label: string;
  href?: string;
  variant?: HeroCTAVariant;
  icon?: ReactNode;
  external?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface HeroMetric {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
}

export interface HeroHighlight {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface HeroMedia {
  type?: 'image' | 'video';
  src: string;
  alt: string;
  poster?: string;
  ratio?: string;
}

export interface HeroEventDetail {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface HeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  pill?: string;
  ctas: HeroCTA[];
  metrics?: HeroMetric[];
  highlights?: HeroHighlight[];
  eventDetails?: HeroEventDetail[];
  media?: HeroMedia;
  className?: string;
}

const CTA_STYLES: Record<HeroCTAVariant, string> = {
  primary:
    'bg-[#35E1A6] text-[#0B0E12] hover:brightness-105 focus-visible:ring-[#35E1A6]/40 shadow-[0_10px_30px_rgba(53,225,166,.35)]',
  secondary:
    'border border-white/20 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-white/30',
  ghost: 'text-white/80 hover:text-white border border-transparent',
};

const renderCTA = (cta: HeroCTA, idx: number) => {
  const { href, variant = 'primary', external, onClick, icon, label, className } = cta;
  const content = (
    <span className="inline-flex items-center gap-2">
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </span>
  );
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-[999px] px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
    CTA_STYLES[variant],
    className
  );
  if (href) {
    const rel = external ? 'noopener noreferrer' : undefined;
    const target = external ? '_blank' : undefined;
    return (
      <a key={`${label}-${idx}`} href={href} className={baseClasses} rel={rel} target={target}>
        {content}
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
      {content}
    </button>
  );
};

export const Hero: FC<HeroProps> = ({
  eyebrow,
  title,
  description,
  pill,
  ctas,
  metrics = [],
  highlights = [],
  eventDetails = [],
  media,
  className,
}) => (
  <section
    className={cn(
      'relative isolate overflow-hidden rounded-[32px] border border-white/12 bg-[#0B0E12] px-6 py-8 text-white shadow-[0_30px_90px_rgba(2,6,23,.65)] sm:px-10',
      className
    )}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(53,225,166,.18),transparent_55%)]" aria-hidden="true" />
    <div className="absolute inset-0 backdrop-blur-[18px]" aria-hidden="true" />
    <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        {pill && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#35E1A6]" aria-hidden="true" />
            <span>{pill}</span>
          </div>
        )}
        {eyebrow && <p className="text-sm uppercase tracking-[0.4em] text-white/60">{eyebrow}</p>}
        <div>
          <h1 className="text-3xl font-semibold leading-tight md:text-[44px]">{title}</h1>
          <p className="mt-3 text-base text-white/80 md:text-lg">{description}</p>
        </div>

        {metrics.length > 0 && (
          <dl className="grid gap-4 sm:grid-cols-2">
            {metrics.map(({ label, value, helper, icon }, index) => (
              <div
                key={`${label}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg"
              >
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  {icon && <span aria-hidden="true">{icon}</span>}
                  <span>{label}</span>
                </dt>
                <dd className="mt-1 text-2xl font-semibold">{value}</dd>
                {helper && <p className="text-xs text-white/60">{helper}</p>}
              </div>
            ))}
          </dl>
        )}

        {highlights.length > 0 && (
          <ul className="space-y-3 text-sm text-white/80">
            {highlights.map(({ title: highlightTitle, description: highlightDesc, icon }, idx) => (
              <li key={`${highlightTitle}-${idx}`} className="flex gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  {icon ?? <span className="text-[#35E1A6]">{'\u2713'}</span>}
                </span>
                <div>
                  <p className="font-semibold text-white">{highlightTitle}</p>
                  <p>{highlightDesc}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {eventDetails.length > 0 && (
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
            {eventDetails.map(({ label, value, icon }, idx) => (
              <div key={`${label}-${idx}`} className="flex gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 text-xl">
                  <span className="flex h-full w-full items-center justify-center" aria-hidden="true">
                    {icon ?? '\u2022'}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
                  <p className="text-base font-medium text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {ctas.map((cta, idx) => renderCTA(cta, idx))}
        </div>
      </div>

      {media && (
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-1 shadow-[0_20px_60px_rgba(2,6,23,.65)]">
          <div className="overflow-hidden rounded-[24px]">
            {media.type === 'video' ? (
              <video
                className="h-full w-full"
                poster={media.poster}
                autoPlay
                muted
                loop
                playsInline
                aria-label={media.alt}
              >
                <source src={media.src} />
              </video>
            ) : (
              <img
                src={media.src}
                alt={media.alt}
                className={cn('h-full w-full object-cover', media.ratio ?? 'aspect-video')}
                loading="lazy"
              />
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" aria-hidden="true" />
        </div>
      )}
    </div>
  </section>
);
