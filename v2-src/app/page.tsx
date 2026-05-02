import Link from 'next/link';
import { Icons } from '@/lib/icons';
import { plantas, tiendas, zonas, plantasEspeciales, catalog } from '@/data';

export default function HomePage() {
  return (
    <div>

      {/* ══════════════════════════════════════════════════
          HERO — editorial split layout
          Left: dark ink panel / Right: video portrait frame
      ══════════════════════════════════════════════════ */}
      <section
        className="overflow-hidden"
        style={{
          marginTop: '-2rem',
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >

        {/* ── Desktop split ─────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-[1fr_min(38vw,520px)]" style={{ minHeight: '92vh' }}>

          {/* Left: dark ink panel */}
          <div
            className="relative flex flex-col justify-between px-10 lg:px-16 xl:px-20 py-16 xl:py-20"
            style={{ background: 'var(--color-ink)' }}
          >
            {/* Top: eyebrow + brand */}
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-white/20" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: 'rgba(245,241,232,0.35)' }}>
                Plantas vivas · Manual operativo
              </span>
            </div>

            {/* Center: headline */}
            <div>
              <h1 className="display">
                <span className="block text-white"
                  style={{ fontSize: 'clamp(64px,7vw,112px)', lineHeight: 0.87, letterSpacing: '-0.04em' }}>
                  Plantas
                </span>
                <span className="block" style={{ fontSize: 'clamp(64px,7vw,112px)', lineHeight: 0.87, letterSpacing: '-0.04em', color: 'var(--color-terracotta)' }}>
                  Vivas,
                </span>
                <span className="block" style={{ fontSize: 'clamp(64px,7vw,112px)', lineHeight: 0.87, letterSpacing: '-0.04em', color: 'rgba(245,241,232,0.28)' }}>
                  bien cuidadas.
                </span>
              </h1>
              <p className="mt-8 leading-relaxed max-w-[40ch]"
                style={{ fontSize: 'clamp(15px,1.4vw,18px)', color: 'rgba(245,241,232,0.50)' }}>
                Tu guía operativa para el área de plantas. Tienda, zona climática y cuidados de cada especie.
              </p>
              <div className="mt-10 flex items-center gap-5">
                <Link href="/plantas"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold transition-all hover:opacity-90"
                  style={{ background: 'var(--color-terracotta)', color: '#fff' }}>
                  Ver catálogo
                  <Icons.arrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />
                </Link>
                <Link href="/mi-tienda"
                  className="text-[13px] font-semibold transition-opacity hover:opacity-80"
                  style={{ color: 'rgba(245,241,232,0.55)' }}>
                  Mi tienda →
                </Link>
              </div>
            </div>

            {/* Bottom: stats */}
            <div className="grid grid-cols-3 border-t pt-8" style={{ borderColor: 'rgba(245,241,232,0.08)' }}>
              <HeroStat value={plantas.length} label="Plantas" />
              <HeroStat value={tiendas.length} label="Tiendas" separator />
              <HeroStat value={zonas.length} label="Zonas climáticas" separator />
            </div>
          </div>

          {/* Right: cream panel with portrait video */}
          <div
            className="relative flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'var(--color-surface-2)' }}
          >
            {/* Video fills the panel, letterboxed vertically */}
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 h-full w-full object-cover"
              poster="/MPV/v2/videos/hero-poster.jpg"
            >
              <source src="/MPV/v2/videos/hero-loop.mp4" type="video/mp4" />
            </video>
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(24,32,26,0.55) 0%, rgba(24,32,26,0.10) 50%, transparent 100%)' }} />
            {/* Easy logo bottom-center */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <img
                src="/MPV/v2/easy-logo.png"
                alt="Easy Cencosud"
                className="w-24 drop-shadow-lg"
                style={{ opacity: 0.92 }}
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* ── Mobile: full-bleed ───────────────────────── */}
        <div
          className="relative flex flex-col justify-end overflow-hidden md:hidden"
          style={{ minHeight: '88vh' }}
        >
          <video autoPlay muted loop playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 20%' }}
            poster="/MPV/v2/videos/hero-poster.jpg">
            <source src="/MPV/v2/videos/hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,14,11,0.96) 0%, rgba(10,14,11,0.50) 50%, transparent 100%)' }} />
          <div className="relative z-10 px-5 pb-14">
            <h1 className="display">
              <span className="block text-white" style={{ fontSize: 'clamp(52px,12vw,80px)', lineHeight: 0.87, letterSpacing: '-0.04em' }}>Plantas</span>
              <span className="block" style={{ fontSize: 'clamp(52px,12vw,80px)', lineHeight: 0.87, letterSpacing: '-0.04em', color: 'var(--color-terracotta)' }}>Vivas,</span>
              <span className="block" style={{ fontSize: 'clamp(52px,12vw,80px)', lineHeight: 0.87, letterSpacing: '-0.04em', color: 'rgba(245,241,232,0.30)' }}>bien cuidadas.</span>
            </h1>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/plantas"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold"
                style={{ background: 'var(--color-terracotta)', color: '#fff' }}>
                Ver catálogo <Icons.arrowRight aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 border-t pt-6" style={{ borderColor: 'rgba(245,241,232,0.08)' }}>
              <HeroStat value={plantas.length} label="Plantas" />
              <HeroStat value={tiendas.length} label="Tiendas" separator />
              <HeroStat value={zonas.length} label="Zonas" separator />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          QUICK NAVIGATION
      ══════════════════════════════════════════════════ */}
      <section className="pt-20 pb-4">
        <p className="eyebrow mb-3">Navegación rápida</p>
        <h2 className="serif mb-8" style={{ fontSize: 'clamp(26px,3vw,40px)', letterSpacing: '-0.03em' }}>
          ¿Qué necesitas ahora?
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <QuickLink href="/mi-tienda" iconKey="store" label="Mi tienda" hint="Riego por zona" />
          <QuickLink href="/plantas" iconKey="sprout" label="Plantas" hint={`${catalog.length} especies`} />
          <QuickLink href="/alertas" iconKey="alert" label="Alertas" hint="Diagnóstico rápido" />
          <QuickLink href="/liquidacion" iconKey="tag" label="Liquidación" hint="Proceso completo" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3 REGLAS DE ORO
      ══════════════════════════════════════════════════ */}
      <section className="pt-20 pb-4">
        <p className="eyebrow mb-3">Lo esencial</p>
        <h2 className="serif mb-8" style={{ fontSize: 'clamp(26px,3vw,40px)', letterSpacing: '-0.03em' }}>
          Las 3 reglas de oro
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          <ReglaCard numero="01" iconKey="drop"
            titulo="No todas las plantas necesitan el mismo riego"
            cuerpo="Como regla general: en verano, plantas de interior una vez por semana. En invierno, cada dos semanas."
            tip="Truco: usa fieltro en las mesas. Humedécelo y las plantas toman agua por capilaridad según su necesidad."
            ctaHref="/mi-tienda" ctaLabel="Ver frecuencia exacta de mi tienda" />
          <ReglaCard numero="02" iconKey="sun"
            titulo="Ubica cada planta según su luz"
            cuerpo="Las plantas de interior no toleran sol directo, salvo el de la mañana. Las de exterior necesitan al menos unas horas de sol directo."
            tip="Sol directo fuerte sobre interior → hojas quemadas. Sin sol sobre exterior → la planta se debilita."
            ctaHref="/plantas" ctaLabel="Ver fichas de plantas" />
          <ReglaCard numero="03" iconKey="eye"
            titulo="Revisar cada día: 10 minutos salvan plantas"
            cuerpo="Una planta enferma detectada a tiempo se puede salvar. Una abandonada se pierde. Revisa mañana, mediodía y al cierre."
            tip="Mete el dedo 2 cm en la tierra. Húmedo → no riegues. Seco → riega. Más preciso que cualquier calendario."
            ctaHref="/rutina" ctaLabel="Ver checklist diario" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PLANTAS ESPECIALES
      ══════════════════════════════════════════════════ */}
      <section className="pt-20 pb-4">
        <p className="eyebrow mb-3">Atención extra</p>
        <h2 className="serif mb-8" style={{ fontSize: 'clamp(26px,3vw,40px)', letterSpacing: '-0.03em' }}>
          Plantas con cuidados específicos
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {plantasEspeciales.map((p) => (
            <EspecialCard key={p.id} planta={p} />
          ))}
        </div>
      </section>

    </div>
  );
}

/* ── Subcomponents ────────────────────────────────── */

function HeroStat({ value, label, separator }: { value: number; label: string; separator?: boolean }) {
  return (
    <div className="flex flex-col pl-6 first:pl-0"
      style={separator ? { borderLeft: '1px solid rgba(245,241,232,0.08)' } : undefined}>
      <span className="serif leading-none font-semibold text-white"
        style={{ fontSize: 'clamp(28px,3vw,44px)' }}>{value}</span>
      <span className="mt-2 font-semibold text-[10px] uppercase tracking-[0.14em]"
        style={{ color: 'rgba(245,241,232,0.35)' }}>{label}</span>
    </div>
  );
}

function ReglaCard({ numero, iconKey, titulo, cuerpo, tip, ctaHref, ctaLabel }: {
  numero: string; iconKey: 'drop' | 'sun' | 'eye';
  titulo: string; cuerpo: string; tip: string; ctaHref: string; ctaLabel: string;
}) {
  const Icon = Icons[iconKey];
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-7 sm:p-8 hover:shadow-[var(--shadow-card)] transition-shadow">
      <div className="flex items-start justify-between">
        <span className="serif select-none leading-none font-semibold tabular-nums"
          style={{ fontSize: '84px', color: 'var(--color-rule)', lineHeight: 1 }} aria-hidden>{numero}</span>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-green-deep)] text-[var(--color-cream)]">
          <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>
      <h3 className="serif mt-4 text-[20px] sm:text-[22px] leading-snug">{titulo}</h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{cuerpo}</p>
      <div className="mt-6 border-l-[3px] border-[var(--color-green-soft)] bg-[var(--color-surface-2)] px-4 py-3.5 rounded-r-xl">
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">{tip}</p>
      </div>
      <Link href={ctaHref}
        className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-green-deep)] hover:gap-2 transition-all">
        {ctaLabel}
        <Icons.arrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />
      </Link>
    </div>
  );
}

function QuickLink({ href, iconKey, label, hint }: { href: string; iconKey: 'store' | 'sprout' | 'alert' | 'tag'; label: string; hint: string }) {
  const Icon = Icons[iconKey];
  return (
    <Link href={href}
      className="group relative flex flex-col gap-5 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 transition-all hover:border-[var(--color-green-deep)] hover:shadow-[var(--shadow-lift)] min-h-[156px]">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--color-green-deep)] text-[var(--color-cream)] transition-transform group-hover:scale-95">
        <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="serif text-[19px] sm:text-[21px] leading-tight font-semibold">{label}</p>
        <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-soft)]">{hint}</p>
      </div>
      <Icons.arrowRight aria-hidden
        className="absolute right-5 bottom-5 h-4 w-4 opacity-20 transition-all group-hover:opacity-100 group-hover:text-[var(--color-green-deep)] group-hover:translate-x-0.5"
        strokeWidth={2} />
    </Link>
  );
}

function EspecialCard({ planta }: { planta: (typeof plantasEspeciales)[number] }) {
  return (
    <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-green-deep)] text-[var(--color-cream)]">
          <Icons.flower aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="serif text-[22px] sm:text-[24px] leading-tight">{planta.nombre}</h3>
          <p className="eyebrow mt-1 text-[var(--color-green-soft)]">Planta de temporada</p>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-[var(--color-surface-2)] px-5 py-4">
        <p className="eyebrow mb-2 text-[var(--color-green-deep)]">Cuidado especial</p>
        <p className="text-[14px] leading-relaxed text-[var(--color-ink)]">{planta.especial}</p>
      </div>
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
