import Link from 'next/link';
import { Icons } from '@/lib/icons';
import { plantas, tiendas, zonas, plantasEspeciales } from '@/data';

export default function HomePage() {
  return (
    <div>
      {/* ══════════════════════════════════════════════════
          HERO — luxury editorial masthead
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl bg-[var(--color-green-deep)] px-8 py-14 sm:px-14 sm:py-20 lg:px-20 lg:py-28 mb-24">
        {/* Decorative concentric rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full border border-[var(--color-cream)]/[0.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-10 h-[320px] w-[320px] rounded-full border border-[var(--color-cream)]/[0.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-8 top-20 h-[160px] w-[160px] rounded-full bg-[var(--color-terracotta)]/[0.07]"
        />

        {/* Eyebrow */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px w-12 bg-[var(--color-cream)]/20" />
          <span
            className="font-semibold text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'rgba(245,241,232,0.4)' }}
          >
            Easy Chile · Manual operativo
          </span>
        </div>

        {/* Display headline — editorial scale */}
        <h1 className="display">
          <span
            className="block leading-[0.88] text-[var(--color-cream)]"
            style={{ fontSize: 'clamp(52px, 9vw, 96px)' }}
          >
            Plantas
          </span>
          <span
            className="block leading-[0.88] text-[var(--color-terracotta)]"
            style={{ fontSize: 'clamp(52px, 9vw, 96px)' }}
          >
            Vivas,
          </span>
          <span
            className="block leading-[0.88]"
            style={{
              fontSize: 'clamp(52px, 9vw, 96px)',
              color: 'rgba(245,241,232,0.45)',
            }}
          >
            bien cuidadas.
          </span>
        </h1>

        {/* Body */}
        <p
          className="mt-10 max-w-[46ch] leading-relaxed"
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'rgba(245,241,232,0.65)',
          }}
        >
          Tu guía operativa para el área de plantas. Busca tu tienda, conoce
          tu zona climática y aprende los cuidados de cada especie.
        </p>

        {/* Stats strip */}
        <div
          className="mt-12 grid grid-cols-3 border-t pt-8"
          style={{ borderColor: 'rgba(245,241,232,0.12)' }}
        >
          <HeroStat value={plantas.length} label="Plantas" />
          <HeroStat value={tiendas.length} label="Tiendas" separator />
          <HeroStat value={zonas.length} label="Zonas climáticas" separator />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ACCESO RÁPIDO
      ══════════════════════════════════════════════════ */}
      <LuxSection eyebrow="Navegación" title="¿Qué necesitas ahora?">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <QuickLink href="/mi-tienda" iconKey="store" label="Mi tienda" hint="Riego por zona" />
          <QuickLink href="/plantas" iconKey="sprout" label="Plantas" hint="572 fichas de cuidado" />
          <QuickLink href="/alertas" iconKey="alert" label="Alertas" hint="Diagnóstico rápido" />
          <QuickLink href="/liquidacion" iconKey="tag" label="Liquidación" hint="Proceso completo" />
        </div>
      </LuxSection>

      {/* ══════════════════════════════════════════════════
          3 REGLAS DE ORO
      ══════════════════════════════════════════════════ */}
      <LuxSection eyebrow="Lo esencial" title="Las 3 reglas de oro">
        <div className="grid gap-5 md:grid-cols-3">
          <ReglaCard
            numero="01"
            iconKey="drop"
            titulo="No todas las plantas necesitan el mismo riego"
            cuerpo="Como regla general: en verano, plantas de interior una vez por semana. En invierno, cada dos semanas."
            tip="Truco: usa fieltro en las mesas. Humedécelo y las plantas toman agua por capilaridad según su necesidad."
            ctaHref="/mi-tienda"
            ctaLabel="Ver frecuencia exacta de mi tienda"
          />
          <ReglaCard
            numero="02"
            iconKey="sun"
            titulo="Ubica cada planta según su luz"
            cuerpo="Las plantas de interior no toleran sol directo, salvo el de la mañana. Las de exterior necesitan al menos unas horas de sol directo."
            tip="Sol directo fuerte sobre interior → hojas quemadas. Sin sol sobre exterior → la planta se debilita."
            ctaHref="/plantas"
            ctaLabel="Ver fichas de plantas"
          />
          <ReglaCard
            numero="03"
            iconKey="eye"
            titulo="Revisar cada día: 10 minutos salvan plantas"
            cuerpo="Una planta enferma detectada a tiempo se puede salvar. Una abandonada se pierde. Revisa mañana, mediodía y al cierre."
            tip="Mete el dedo 2 cm en la tierra. Húmedo → no riegues. Seco → riega. Más preciso que cualquier calendario."
            ctaHref="/rutina"
            ctaLabel="Ver checklist diario"
          />
        </div>
      </LuxSection>

      {/* ══════════════════════════════════════════════════
          PLANTAS ESPECIALES
      ══════════════════════════════════════════════════ */}
      <LuxSection eyebrow="Atención extra" title="Plantas con cuidados específicos">
        <div className="grid gap-5 md:grid-cols-2">
          {plantasEspeciales.map((p) => (
            <EspecialCard key={p.id} planta={p} />
          ))}
        </div>
      </LuxSection>
    </div>
  );
}

/* ── Subcomponents ──────────────────────────────────── */

function LuxSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-24">
      <div className="mb-8 sm:mb-10">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2
          className="serif"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.03em' }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function HeroStat({
  value,
  label,
  separator,
}: {
  value: number;
  label: string;
  separator?: boolean;
}) {
  return (
    <div
      className="flex flex-col pl-6 first:pl-0"
      style={separator ? { borderLeft: '1px solid rgba(245,241,232,0.10)' } : undefined}
    >
      <span
        className="serif leading-none font-semibold text-[var(--color-cream)]"
        style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
      >
        {value}
      </span>
      <span
        className="mt-2 font-medium text-[10px] uppercase tracking-[0.12em]"
        style={{ color: 'rgba(245,241,232,0.4)' }}
      >
        {label}
      </span>
    </div>
  );
}

function ReglaCard({
  numero,
  iconKey,
  titulo,
  cuerpo,
  tip,
  ctaHref,
  ctaLabel,
}: {
  numero: string;
  iconKey: 'drop' | 'sun' | 'eye';
  titulo: string;
  cuerpo: string;
  tip: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const Icon = Icons[iconKey];
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-7 sm:p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-shadow">
      {/* Number + icon header */}
      <div className="flex items-start justify-between">
        <span
          className="serif select-none leading-none font-semibold tabular-nums"
          style={{ fontSize: '80px', color: 'var(--color-rule)', lineHeight: 1 }}
          aria-hidden
        >
          {numero}
        </span>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-green-deep)] text-[var(--color-cream)]">
          <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>

      <h3 className="serif mt-4 text-[20px] sm:text-[22px] leading-snug">{titulo}</h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
        {cuerpo}
      </p>

      {/* Tip — left border accent */}
      <div className="mt-6 border-l-2 border-[var(--color-green-soft)] bg-[var(--color-surface-2)] px-4 py-3.5 rounded-r-xl">
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">{tip}</p>
      </div>

      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-green-deep)] hover:gap-2 transition-all"
      >
        {ctaLabel}
        <Icons.arrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />
      </Link>
    </div>
  );
}

function QuickLink({
  href,
  iconKey,
  label,
  hint,
}: {
  href: string;
  iconKey: 'store' | 'sprout' | 'alert' | 'tag';
  label: string;
  hint: string;
}) {
  const Icon = Icons[iconKey];
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-5 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 sm:p-6 transition-all hover:border-[var(--color-green-deep)] hover:shadow-[var(--shadow-lift)] min-h-[148px] sm:min-h-[160px]"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--color-green-deep)] text-[var(--color-cream)] transition-transform group-hover:scale-[0.94]">
        <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="serif text-[18px] sm:text-[20px] leading-tight font-semibold">{label}</p>
        <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-soft)]">{hint}</p>
      </div>
      <Icons.arrowRight
        aria-hidden
        className="absolute right-5 bottom-5 h-4 w-4 opacity-25 transition-all group-hover:opacity-100 group-hover:text-[var(--color-green-deep)] group-hover:translate-x-0.5"
        strokeWidth={2}
      />
    </Link>
  );
}

function EspecialCard({
  planta,
}: {
  planta: (typeof plantasEspeciales)[number];
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-[var(--shadow-soft)]">
      {/* Plant identity */}
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-green-deep)] text-[var(--color-cream)]">
          <Icons.flower aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="serif text-[22px] sm:text-[24px] leading-tight">{planta.nombre}</h3>
          <p className="eyebrow mt-1 text-[var(--color-green-soft)]">Planta de temporada</p>
        </div>
      </div>

      {/* Cuidado especial highlight */}
      <div className="mt-5 rounded-xl bg-[var(--color-surface-2)] px-5 py-4">
        <p className="eyebrow mb-2 text-[var(--color-green-deep)]">Cuidado especial</p>
        <p className="text-[14px] leading-relaxed text-[var(--color-ink)]">{planta.especial}</p>
      </div>

      {/* Temp + Alerta */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-[13px]">
        <div>
          <p className="eyebrow mb-1.5">Temperatura</p>
          <p className="leading-snug text-[var(--color-ink-soft)]">{planta.temperatura}</p>
        </div>
        <div>
          <p className="eyebrow mb-1.5 text-[var(--color-terracotta)]">Atento a esto</p>
          <p className="leading-snug text-[var(--color-ink-soft)]">{planta.urgente}</p>
        </div>
      </div>
    </div>
  );
}
