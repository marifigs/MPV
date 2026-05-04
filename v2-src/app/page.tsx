import Link from 'next/link';
import { Icons } from '@/lib/icons';
import { plantas, tiendas, zonas, plantasEspeciales, catalog } from '@/data';

export default function HomePage() {
  return (
    <div>

      {/* ══════════════════════════════════════════════════
          HERO — immersive full-bleed editorial
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          marginTop: '-3rem',
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          overflow: 'hidden',
        }}
      >
        {/* Desktop split */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: '1fr min(42vw,580px)', minHeight: '100vh' }}>

          {/* Left: deep forest */}
          <div
            className="relative flex flex-col justify-between"
            style={{
              background: 'var(--color-forest)',
              padding: 'clamp(56px,6vw,88px) clamp(48px,7vw,104px)',
            }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-4">
              <div style={{ height: '0.5px', width: '40px', background: 'rgba(245,241,232,0.18)' }} />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.32em',
                color: 'rgba(245,241,232,0.28)',
              }}>
                Plantas vivas · Manual operativo · Easy Chile
              </span>
            </div>

            {/* Headline */}
            <div style={{ margin: 'auto 0' }}>
              <h1
                className="display"
                style={{ overflow: 'visible', fontStyle: 'italic' }}
              >
                <span
                  className="block animate-reveal text-white"
                  style={{ fontSize: 'clamp(88px, 11vw, 172px)', opacity: 0 }}
                >
                  Plantas
                </span>
                <span
                  className="block animate-reveal delay-100"
                  style={{
                    fontSize: 'clamp(88px, 11vw, 172px)',
                    color: 'var(--color-terracotta)',
                    opacity: 0,
                  }}
                >
                  Vivas,
                </span>
                <span
                  className="block animate-reveal delay-200"
                  style={{
                    fontSize: 'clamp(88px, 11vw, 172px)',
                    color: 'rgba(245,241,232,0.12)',
                    opacity: 0,
                  }}
                >
                  bien cuidadas.
                </span>
              </h1>

              <p
                className="mt-10 animate-fade-up delay-400"
                style={{
                  maxWidth: '40ch',
                  fontSize: 'clamp(14px, 1.15vw, 17px)',
                  lineHeight: 1.7,
                  color: 'rgba(245,241,232,0.38)',
                  opacity: 0,
                }}
              >
                Guía operativa para cuidar las plantas vivas y reducir la merma. Cuidados por especie, frecuencia de riego por zona climática y alertas de riesgo por tienda.
              </p>

              <div className="mt-12 flex items-center gap-10 animate-fade-up delay-500" style={{ opacity: 0 }}>
                <Link
                  href="/plantas"
                  className="inline-flex items-center gap-2.5"
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'rgba(245,241,232,0.62)',
                    borderBottom: '0.5px solid rgba(245,241,232,0.22)',
                    paddingBottom: '4px',
                    transition: 'color 0.35s, border-color 0.35s',
                  }}
                >
                  Ver catálogo
                  <Icons.arrowRight aria-hidden className="h-3 w-3" strokeWidth={2} />
                </Link>
                <Link
                  href="/mi-tienda"
                  style={{
                    fontSize: '11px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: 'rgba(245,241,232,0.28)',
                    transition: 'color 0.3s',
                  }}
                >
                  Mi tienda
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3"
              style={{ borderTop: '0.5px solid rgba(245,241,232,0.07)', paddingTop: '2rem' }}
            >
              <HeroStat value={catalog.length} label="Especies" />
              <HeroStat value={tiendas.length} label="Tiendas" separator />
              <HeroStat value={zonas.length} label="Zonas climáticas" separator />
            </div>
          </div>

          {/* Right: video */}
          <div className="relative overflow-hidden grain" style={{ background: '#080d09' }}>
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: 0.88 }}
              poster="/MPV/v2/videos/hero-poster.jpg"
            >
              <source src="/MPV/v2/videos/hero-loop.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(8,13,9,0.7) 0%, rgba(8,13,9,0.05) 55%, transparent 100%)' }}
            />
            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
              <img
                src="/MPV/v2/easy-logo.png"
                alt="Easy Cencosud"
                style={{ height: '52px', width: 'auto', opacity: 0.85 }}
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* Mobile: full-bleed */}
        <div
          className="relative flex flex-col justify-end overflow-hidden grain md:hidden"
          style={{ minHeight: '95svh' }}
        >
          <video autoPlay muted loop playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 20%' }}
            poster="/MPV/v2/videos/hero-poster.jpg">
            <source src="/MPV/v2/videos/hero-loop.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(8,13,9,0.97) 0%, rgba(8,13,9,0.55) 50%, transparent 100%)' }}
          />
          <div className="relative z-10 px-6 pb-16">
            <h1 className="display" style={{ fontStyle: 'italic' }}>
              <span className="block text-white" style={{ fontSize: 'clamp(64px, 16vw, 96px)' }}>Plantas</span>
              <span className="block" style={{ fontSize: 'clamp(64px, 16vw, 96px)', color: 'var(--color-terracotta)' }}>Vivas,</span>
              <span className="block" style={{ fontSize: 'clamp(64px, 16vw, 96px)', color: 'rgba(245,241,232,0.16)' }}>bien cuidadas.</span>
            </h1>
            <p style={{ marginTop: '1.5rem', fontSize: '14px', lineHeight: 1.65, color: 'rgba(245,241,232,0.38)', maxWidth: '36ch' }}>
              Para cuidar las plantas y reducir la merma. Cuidados por especie, frecuencia de riego por zona y alertas de riesgo.
            </p>
            <div className="mt-8 flex items-center gap-8">
              <Link href="/plantas"
                className="inline-flex items-center gap-2"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'rgba(245,241,232,0.62)',
                  borderBottom: '0.5px solid rgba(245,241,232,0.22)',
                  paddingBottom: '4px',
                }}>
                Ver catálogo <Icons.arrowRight aria-hidden className="h-3 w-3" strokeWidth={2} />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3" style={{ borderTop: '0.5px solid rgba(245,241,232,0.10)', paddingTop: '1.5rem' }}>
              <HeroStat value={catalog.length} label="Especies" />
              <HeroStat value={tiendas.length} label="Tiendas" separator />
              <HeroStat value={zonas.length} label="Zonas" separator />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MARQUEE — luxury editorial ticker
      ══════════════════════════════════════════════════ */}
      <div
        style={{
          marginTop: '0',
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTop: '0.5px solid var(--color-rule)',
          borderBottom: '0.5px solid var(--color-rule)',
          background: 'var(--color-surface-2)',
          overflow: 'hidden',
          padding: '14px 0',
        }}
      >
        <div className="animate-marquee" aria-hidden>
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {[
                '279 Especies',
                '42 Tiendas Easy Chile',
                '6 Zonas Climáticas',
                'Cuidado de Plantas Vivas',
                'Merma Cero',
                'Riego por Zona',
                'Fichas de Cuidado',
                'Stock en Tiempo Real',
              ].map((text) => (
                <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--color-ink-soft)',
                    whiteSpace: 'nowrap',
                    padding: '0 2.5rem',
                  }}>
                    {text}
                  </span>
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--color-green-soft)',
                    opacity: 0.4,
                    flexShrink: 0,
                  }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MANIFESTO — editorial statement
      ══════════════════════════════════════════════════ */}
      <section
        className="pt-32 pb-0"
        style={{
          marginTop: '0',
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'var(--color-surface-2)',
            padding: 'clamp(64px,8vw,112px) clamp(24px,6vw,80px)',
            position: 'relative',
          }}
        >
          {/* Ghost number */}
          <span
            className="display select-none absolute"
            aria-hidden
            style={{
              fontSize: 'clamp(200px, 28vw, 400px)',
              color: 'var(--color-ink)',
              opacity: 0.028,
              lineHeight: 1,
              top: '-0.05em',
              right: '-0.02em',
              letterSpacing: '-0.06em',
              fontStyle: 'italic',
              pointerEvents: 'none',
            }}
          >
            279
          </span>

          <div className="mx-auto max-w-6xl relative">
            <div className="max-w-2xl">
              <p className="eyebrow mb-6" style={{ color: 'var(--color-green-soft)' }}>La plataforma</p>
              <h2
                className="display"
                style={{
                  fontSize: 'clamp(40px, 5.5vw, 88px)',
                  fontStyle: 'italic',
                  color: 'var(--color-ink)',
                  lineHeight: 0.9,
                  marginBottom: '2rem',
                }}
              >
                Cuidar bien,<br />
                <span style={{ color: 'var(--color-green-deep)' }}>evitar la merma.</span>
              </h2>
              <p style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', lineHeight: 1.75, color: 'var(--color-ink-soft)', maxWidth: '52ch' }}>
                279 especies con fichas de cuidado, frecuencias de riego por zona climática y alertas de riesgo por tienda. Una herramienta operativa para que cada vendedor del área de plantas vivas tenga la respuesta correcta en segundos.
              </p>
            </div>

            {/* Horizontal stat strip */}
            <div
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-0"
              style={{ borderTop: '0.5px solid var(--color-rule)' }}
            >
              {[
                { value: `${catalog.length}`, label: 'Especies en catálogo' },
                { value: `${tiendas.length}`, label: 'Tiendas Easy Chile' },
                { value: `${zonas.length}`, label: 'Zonas climáticas' },
                { value: '1', label: 'Plataforma integrada' },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: '2rem 0',
                    paddingRight: '2rem',
                    borderRight: i < 3 ? '0.5px solid var(--color-rule)' : 'none',
                    paddingLeft: i > 0 ? '2rem' : 0,
                  }}
                >
                  <p
                    className="display"
                    style={{ fontSize: 'clamp(36px, 4vw, 64px)', color: 'var(--color-ink)', fontStyle: 'italic' }}
                  >
                    {s.value}
                  </p>
                  <p style={{
                    marginTop: '0.5rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.24em',
                    color: 'var(--color-ink-soft)',
                    opacity: 0.6,
                  }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MÓDULOS — quick navigation, editorial grid
      ══════════════════════════════════════════════════ */}
      <section className="pt-28 pb-0 scroll-reveal">
        <p className="eyebrow mb-5" style={{ color: 'var(--color-green-soft)' }}>Acceso directo</p>
        <h2
          className="serif mb-14"
          style={{ fontSize: 'clamp(28px, 3.2vw, 50px)', letterSpacing: '-0.03em', maxWidth: '20ch' }}
        >
          ¿Qué necesitas ahora?
        </h2>
        {/* Aesop-style editorial list */}
        <div style={{ borderTop: '0.5px solid var(--color-rule)' }}>
          <QuickLink index={1} href="/mi-tienda"   label="Mi tienda"   hint="Riego por zona climática" />
          <QuickLink index={2} href="/plantas"     label="Catálogo"    hint={`${catalog.length} especies`} />
          <QuickLink index={3} href="/alertas"     label="Alertas"     hint="Diagnóstico en segundos" />
          <QuickLink index={4} href="/liquidacion" label="Liquidación" hint="Protocolo de merma" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3 REGLAS DE ORO — dark editorial stripe
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          marginTop: '8rem',
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="surface-forest" style={{ width: '100%' }}>
          <div
            className="mx-auto max-w-6xl"
            style={{ padding: 'clamp(72px,8vw,108px) clamp(20px,5vw,80px)' }}
          >
            <p className="eyebrow mb-5" style={{ color: 'rgba(245,241,232,0.28)' }}>Lo esencial</p>
            <h2
              className="display mb-16"
              style={{
                fontSize: 'clamp(36px, 4.5vw, 72px)',
                fontStyle: 'italic',
                color: 'var(--color-cream)',
                lineHeight: 0.9,
              }}
            >
              Las 3 reglas<br />
              <span style={{ color: 'rgba(245,241,232,0.28)', fontSize: '0.75em' }}>que lo cambian todo.</span>
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              <ReglaCard numero="01" iconKey="drop"
                titulo="No todas las plantas necesitan el mismo riego"
                cuerpo="Interior: una vez por semana en verano, cada dos en invierno. Exterior: según zona climática."
                tip="Fieltro húmedo en las mesas → las plantas toman agua por capilaridad según su necesidad."
                ctaHref="/mi-tienda" ctaLabel="Frecuencia exacta de mi tienda" />
              <ReglaCard numero="02" iconKey="sun"
                titulo="Ubica cada planta según su luz"
                cuerpo="Interior no tolera sol directo, salvo el de la mañana. Exterior necesita al menos unas horas de sol."
                tip="Sol fuerte en interior → hojas quemadas. Sin sol en exterior → planta débil y sin flores."
                ctaHref="/plantas" ctaLabel="Ver fichas de plantas" />
              <ReglaCard numero="03" iconKey="eye"
                titulo="10 minutos de revisión salvan plantas"
                cuerpo="Una planta enferma detectada a tiempo se salva. Abandonada, se pierde. Revisa mañana, mediodía y cierre."
                tip="Dedo 2 cm en la tierra: húmedo → no riegues. Seco → riega. Más preciso que cualquier calendario."
                ctaHref="/rutina" ctaLabel="Ver checklist diario" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PLANTAS ESPECIALES
      ══════════════════════════════════════════════════ */}
      <section className="pt-28 pb-0 scroll-reveal">
        <p className="eyebrow mb-5" style={{ color: 'var(--color-green-soft)' }}>Atención extra</p>
        <h2 className="serif mb-12" style={{ fontSize: 'clamp(28px, 3.2vw, 50px)', letterSpacing: '-0.03em' }}>
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

/* ── Subcomponents ──────────────────────────────── */

function HeroStat({ value, label, separator }: { value: number | string; label: string; separator?: boolean }) {
  return (
    <div
      style={{
        paddingLeft: separator ? '2rem' : 0,
        borderLeft: separator ? '0.5px solid rgba(245,241,232,0.09)' : 'none',
      }}
    >
      <span
        className="display text-white"
        style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontStyle: 'italic' }}
      >
        {value}
      </span>
      <p style={{
        marginTop: '0.35rem',
        fontFamily: 'var(--font-sans)',
        fontSize: '10px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: 'rgba(245,241,232,0.30)',
      }}>
        {label}
      </p>
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
      className="flex flex-col rounded-2xl"
      style={{
        padding: 'clamp(28px,3vw,40px)',
        background: 'rgba(245,241,232,0.035)',
        border: '0.5px solid rgba(245,241,232,0.07)',
        transition: 'background 0.5s var(--ease-luxury)',
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="display select-none"
          style={{ fontSize: '96px', color: 'rgba(245,241,232,0.05)', lineHeight: 1, fontStyle: 'italic' }}
          aria-hidden
        >
          {numero}
        </span>
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
          style={{ background: 'rgba(245,241,232,0.07)' }}
        >
          <Icon aria-hidden className="h-5 w-5" strokeWidth={1.4} style={{ color: 'rgba(245,241,232,0.55)' }} />
        </span>
      </div>
      <h3
        className="serif mt-4 leading-snug"
        style={{ fontSize: 'clamp(17px, 1.5vw, 20px)', color: 'var(--color-cream)' }}
      >
        {titulo}
      </h3>
      <p className="mt-3 flex-1 leading-relaxed" style={{ fontSize: '13.5px', color: 'rgba(245,241,232,0.45)' }}>
        {cuerpo}
      </p>
      <div
        className="mt-6 px-5 py-4 rounded-r-xl"
        style={{
          borderLeft: '1.5px solid rgba(245,241,232,0.12)',
          background: 'rgba(245,241,232,0.03)',
        }}
      >
        <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(245,241,232,0.36)' }}>{tip}</p>
      </div>
      <Link
        href={ctaHref}
        className="mt-7 inline-flex items-center gap-1.5 font-medium"
        style={{
          fontSize: '11px',
          color: 'rgba(245,241,232,0.38)',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          transition: 'color 0.3s, gap 0.3s var(--ease-luxury)',
        }}
      >
        {ctaLabel}
        <Icons.arrowRight aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
      </Link>
    </div>
  );
}

function QuickLink({ href, label, hint, index }: {
  href: string;
  label: string;
  hint: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className="ql-row group"
      style={{
        borderBottom: '0.5px solid var(--color-rule)',
        padding: 'clamp(20px, 2.5vw, 34px) 0',
        textDecoration: 'none',
      }}
    >
      {/* Index */}
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: '3.5rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.1em',
          color: 'var(--color-ink-soft)',
          opacity: 0.28,
        }}
      >
        {String(index).padStart(2, '0')}
      </span>

      {/* Label + hint */}
      <div style={{ flex: 1, paddingRight: 'clamp(16px, 2vw, 32px)' }}>
        <p
          className="ql-label display"
          style={{
            fontSize: 'clamp(32px, 4vw, 60px)',
            fontStyle: 'italic',
            color: 'var(--color-ink)',
            lineHeight: 1,
          }}
        >
          {label}
        </p>
        <p
          className="ql-hint eyebrow"
          style={{
            marginTop: '8px',
            color: 'var(--color-ink-soft)',
            opacity: 0.4,
          }}
        >
          {hint}
        </p>
      </div>

      {/* Arrow */}
      <span
        className="ql-arrow"
        aria-hidden
        style={{
          flexShrink: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: '20px',
          color: 'var(--color-ink-soft)',
          opacity: 0.2,
        }}
      >
        →
      </span>
    </Link>
  );
}

function EspecialCard({ planta }: { planta: (typeof plantasEspeciales)[number] }) {
  return (
    <div
      className="rounded-2xl"
      style={{
        border: '0.5px solid var(--color-rule)',
        background: 'var(--color-surface)',
        padding: 'clamp(24px,2.5vw,36px)',
      }}
    >
      <div className="flex items-start gap-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-green-deep)] text-[var(--color-cream)]">
          <Icons.flower aria-hidden className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="serif leading-tight" style={{ fontSize: 'clamp(19px, 2vw, 24px)' }}>
            {planta.nombre}
          </h3>
          <p className="eyebrow mt-1.5" style={{ color: 'var(--color-green-soft)' }}>Planta de temporada</p>
        </div>
      </div>
      <div className="mt-5 rounded-xl px-5 py-4" style={{ background: 'var(--color-surface-2)' }}>
        <p className="eyebrow mb-2" style={{ color: 'var(--color-green-deep)' }}>Cuidado especial</p>
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
