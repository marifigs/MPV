import Link from 'next/link';
import { Icons } from '@/lib/icons';
import { plantas, tiendas, zonas, plantasEspeciales, catalog } from '@/data';

export default function HomePage() {
  return (
    <div>

      {/* ══════════════════════════════════════════════════
          HERO — editorial split layout
          Left: deep forest panel / Right: video portrait
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
        <div className="hidden md:grid md:grid-cols-[1fr_min(40vw,560px)]" style={{ minHeight: '95vh' }}>

          {/* Left: forest panel */}
          <div
            className="relative flex flex-col justify-between px-12 lg:px-18 xl:px-24 py-18 xl:py-22"
            style={{ background: 'var(--color-forest)' }}
          >
            {/* Top eyebrow */}
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/15" />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.5rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.30em',
                color: 'rgba(245,241,232,0.30)',
              }}>
                Plantas vivas · Manual operativo
              </span>
            </div>

            {/* Center: display headline */}
            <div>
              <h1 className="display" style={{ overflow: 'visible' }}>
                <span
                  className="block animate-reveal text-white"
                  style={{ fontSize: 'clamp(76px, 9.5vw, 148px)', opacity: 0 }}
                >
                  Plantas
                </span>
                <span
                  className="block animate-reveal delay-100"
                  style={{
                    fontSize: 'clamp(76px, 9.5vw, 148px)',
                    color: 'var(--color-terracotta)',
                    opacity: 0,
                  }}
                >
                  Vivas,
                </span>
                <span
                  className="block animate-reveal delay-200"
                  style={{
                    fontSize: 'clamp(76px, 9.5vw, 148px)',
                    color: 'rgba(245,241,232,0.18)',
                    opacity: 0,
                  }}
                >
                  bien cuidadas.
                </span>
              </h1>
              <p
                className="mt-10 leading-relaxed max-w-[38ch] animate-fade-up delay-400"
                style={{
                  fontSize: 'clamp(15px, 1.3vw, 18px)',
                  color: 'rgba(245,241,232,0.42)',
                  opacity: 0,
                }}
              >
                Tu guía operativa para el área de plantas. Tienda, zona climática y cuidados de cada especie.
              </p>
              <div className="mt-12 flex items-center gap-6 animate-fade-up delay-500" style={{ opacity: 0 }}>
                <Link href="/plantas"
                  className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[13px] font-semibold transition-all hover:opacity-90 hover:scale-[0.98]"
                  style={{
                    background: 'var(--color-terracotta)',
                    color: '#fff',
                    transition: 'opacity 0.3s, transform 0.3s var(--ease-luxury)',
                  }}>
                  Ver catálogo
                  <Icons.arrowRight aria-hidden className="h-3.5 w-3.5" strokeWidth={2.5} />
                </Link>
                <Link href="/mi-tienda"
                  className="text-[13px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(245,241,232,0.45)' }}>
                  Mi tienda →
                </Link>
              </div>
            </div>

            {/* Bottom: stats */}
            <div className="grid grid-cols-3 pt-10" style={{ borderTop: '0.5px solid rgba(245,241,232,0.08)' }}>
              <HeroStat value={plantas.length} label="Plantas" />
              <HeroStat value={tiendas.length} label="Tiendas" separator />
              <HeroStat value={zonas.length} label="Zonas climáticas" separator />
            </div>
          </div>

          {/* Right: video panel — full bleed */}
          <div
            className="relative overflow-hidden grain"
            style={{ background: 'var(--color-surface-3)' }}
          >
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 h-full w-full object-cover"
              poster="/MPV/v2/videos/hero-poster.jpg"
            >
              <source src="/MPV/v2/videos/hero-loop.mp4" type="video/mp4" />
            </video>
            {/* Deep vignette */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(15,26,18,0.70) 0%, rgba(15,26,18,0.08) 50%, transparent 100%)',
              }} />
            {/* Easy logo */}
            <div className="absolute bottom-9 left-0 right-0 flex justify-center">
              <img
                src="/MPV/v2/easy-logo.png"
                alt="Easy Cencosud"
                className="w-24 drop-shadow-lg"
                style={{ opacity: 0.88 }}
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* ── Mobile: full-bleed ───────────────────────── */}
        <div
          className="relative flex flex-col justify-end overflow-hidden grain md:hidden"
          style={{ minHeight: '92vh' }}
        >
          <video autoPlay muted loop playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 20%' }}
            poster="/MPV/v2/videos/hero-poster.jpg">
            <source src="/MPV/v2/videos/hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,14,11,0.97) 0%, rgba(10,14,11,0.50) 55%, transparent 100%)' }} />
          <div className="relative z-10 px-6 pb-16">
            <h1 className="display">
              <span className="block text-white" style={{ fontSize: 'clamp(56px, 14vw, 88px)' }}>Plantas</span>
              <span className="block" style={{ fontSize: 'clamp(56px, 14vw, 88px)', color: 'var(--color-terracotta)' }}>Vivas,</span>
              <span className="block" style={{ fontSize: 'clamp(56px, 14vw, 88px)', color: 'rgba(245,241,232,0.22)' }}>bien cuidadas.</span>
            </h1>
            <div className="mt-10 flex items-center gap-4">
              <Link href="/plantas"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold"
                style={{ background: 'var(--color-terracotta)', color: '#fff' }}>
                Ver catálogo <Icons.arrowRight aria-hidden className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 pt-7" style={{ borderTop: '0.5px solid rgba(245,241,232,0.10)' }}>
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
      <section className="pt-32 pb-0">
        <p className="eyebrow mb-5" style={{ color: 'var(--color-green-soft)' }}>Navegación rápida</p>
        <h2 className="serif mb-12" style={{ fontSize: 'clamp(30px, 3.5vw, 52px)', letterSpacing: '-0.03em' }}>
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
          3 REGLAS DE ORO — dark stripe
      ══════════════════════════════════════════════════ */}
      <section
        className="pt-32 pb-0"
        style={{
          marginTop: '7rem',
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div
          className="surface-forest px-5 sm:px-8 py-20 sm:py-24"
          style={{ width: '100%' }}
        >
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-5" style={{ color: 'rgba(245,241,232,0.30)' }}>Lo esencial</p>
            <h2 className="serif mb-14" style={{
              fontSize: 'clamp(30px, 3.5vw, 52px)',
              letterSpacing: '-0.03em',
              color: 'var(--color-cream)',
            }}>
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
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PLANTAS ESPECIALES
      ══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-0">
        <p className="eyebrow mb-5" style={{ color: 'var(--color-green-soft)' }}>Atención extra</p>
        <h2 className="serif mb-12" style={{ fontSize: 'clamp(30px, 3.5vw, 52px)', letterSpacing: '-0.03em' }}>
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
    <div
      className="flex flex-col pl-8 first:pl-0"
      style={separator ? { borderLeft: '0.5px solid rgba(245,241,232,0.10)' } : undefined}
    >
      <span
        className="display text-white"
        style={{ fontSize: 'clamp(32px, 3.5vw, 52px)' }}
      >
        {value}
      </span>
      <span style={{
        marginTop: '0.4rem',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.5rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.22em',
        color: 'rgba(245,241,232,0.28)',
      }}>
        {label}
      </span>
    </div>
  );
}

function ReglaCard({ numero, iconKey, titulo, cuerpo, tip, ctaHref, ctaLabel }: {
  numero: string; iconKey: 'drop' | 'sun' | 'eye';
  titulo: string; cuerpo: string; tip: string; ctaHref: string; ctaLabel: string;
}) {
  const Icon = Icons[iconKey];
  return (
    <div
      className="flex flex-col rounded-2xl p-8 sm:p-9"
      style={{
        background: 'rgba(245,241,232,0.04)',
        border: '0.5px solid rgba(245,241,232,0.08)',
        transition: 'background 0.4s var(--ease-luxury)',
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="display select-none leading-none"
          style={{ fontSize: '100px', color: 'rgba(245,241,232,0.06)', lineHeight: 1 }}
          aria-hidden
        >
          {numero}
        </span>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
          style={{ background: 'rgba(245,241,232,0.08)' }}>
          <Icon aria-hidden className="h-5 w-5" strokeWidth={1.5} style={{ color: 'var(--color-cream)' }} />
        </span>
      </div>
      <h3
        className="serif mt-5 leading-snug"
        style={{ fontSize: 'clamp(18px, 1.6vw, 22px)', color: 'var(--color-cream)' }}
      >
        {titulo}
      </h3>
      <p className="mt-3 flex-1 leading-relaxed" style={{ fontSize: '14px', color: 'rgba(245,241,232,0.50)' }}>
        {cuerpo}
      </p>
      <div
        className="mt-7 px-5 py-4 rounded-r-xl"
        style={{
          borderLeft: '2px solid rgba(245,241,232,0.15)',
          background: 'rgba(245,241,232,0.04)',
        }}
      >
        <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(245,241,232,0.40)' }}>{tip}</p>
      </div>
      <Link href={ctaHref}
        className="mt-7 inline-flex items-center gap-1.5 font-medium transition-all hover:gap-2.5"
        style={{
          fontSize: '12px',
          color: 'rgba(245,241,232,0.45)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          transition: 'gap 0.3s var(--ease-luxury), color 0.3s',
        }}>
        {ctaLabel}
        <Icons.arrowRight aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
      </Link>
    </div>
  );
}

function QuickLink({ href, iconKey, label, hint }: { href: string; iconKey: 'store' | 'sprout' | 'alert' | 'tag'; label: string; hint: string }) {
  const Icon = Icons[iconKey];
  return (
    <Link href={href}
      className="group relative flex flex-col gap-7 rounded-2xl p-7 sm:p-8"
      style={{
        border: '0.5px solid var(--color-rule)',
        background: 'var(--color-surface)',
        minHeight: '180px',
        transition: 'border-color 0.4s var(--ease-luxury), box-shadow 0.4s var(--ease-luxury)',
      }}
    >
      <span
        className="grid h-12 w-12 place-items-center rounded-xl text-[var(--color-cream)]"
        style={{
          background: 'var(--color-green-deep)',
          transition: 'transform 0.4s var(--ease-luxury)',
        }}
      >
        <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="serif leading-tight" style={{ fontSize: 'clamp(19px, 2vw, 23px)' }}>{label}</p>
        <p className="mt-1.5" style={{ fontSize: '12px', color: 'var(--color-ink-soft)', opacity: 0.7 }}>{hint}</p>
      </div>
      <Icons.arrowRight aria-hidden
        className="absolute right-6 bottom-6 h-4 w-4 opacity-15 transition-all group-hover:opacity-80 group-hover:text-[var(--color-green-deep)] group-hover:translate-x-1"
        strokeWidth={2}
        style={{ transition: 'opacity 0.35s, transform 0.35s var(--ease-luxury), color 0.35s' }}
      />
    </Link>
  );
}

function EspecialCard({ planta }: { planta: (typeof plantasEspeciales)[number] }) {
  return (
    <div
      className="rounded-2xl p-7 sm:p-8"
      style={{
        border: '0.5px solid var(--color-rule)',
        background: 'var(--color-surface)',
      }}
    >
      <div className="flex items-start gap-5">
        <span className="grid h-13 w-13 shrink-0 place-items-center rounded-xl bg-[var(--color-green-deep)] text-[var(--color-cream)]">
          <Icons.flower aria-hidden className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="serif leading-tight" style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}>
            {planta.nombre}
          </h3>
          <p className="eyebrow mt-1.5" style={{ color: 'var(--color-green-soft)' }}>Planta de temporada</p>
        </div>
      </div>
      <div
        className="mt-6 rounded-xl px-6 py-5"
        style={{ background: 'var(--color-surface-2)' }}
      >
        <p className="eyebrow mb-2.5" style={{ color: 'var(--color-green-deep)' }}>Cuidado especial</p>
        <p className="leading-relaxed" style={{ fontSize: '14px' }}>{planta.especial}</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-5" style={{ fontSize: '13px' }}>
        <div>
          <p className="eyebrow mb-2">Temperatura</p>
          <p className="leading-snug" style={{ color: 'var(--color-ink-soft)' }}>{planta.temperatura}</p>
        </div>
        <div>
          <p className="eyebrow mb-2" style={{ color: 'var(--color-terracotta)' }}>Atento a esto</p>
          <p className="leading-snug" style={{ color: 'var(--color-ink-soft)' }}>{planta.urgente}</p>
        </div>
      </div>
    </div>
  );
}
