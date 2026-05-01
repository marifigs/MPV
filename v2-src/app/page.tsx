import Link from 'next/link';
import { Icons } from '@/lib/icons';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Stat } from '@/components/ui/stat';
import { Alert } from '@/components/ui/alert';
import { plantas, tiendas, zonas, plantasEspeciales } from '@/data';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl bg-[var(--color-green-deep)] p-7 sm:p-10 text-[var(--color-cream)]">
        <Eyebrow className="text-[var(--color-cream)]/70">Manual operativo</Eyebrow>
        <h1 className="serif mt-2 text-[40px] sm:text-[56px] leading-[1.05] tracking-tight">
          Plantas Vivas,
          <br />
          cuidadas como deben.
        </h1>
        <p className="mt-4 max-w-prose text-[var(--color-cream)]/85 leading-relaxed">
          Tu guía operativa para mantener las plantas en perfectas condiciones.
          Busca tu tienda, conoce tu clima y aprende a cuidar cada especie.
        </p>
        <div className="mt-7 grid grid-cols-3 gap-3">
          <HeroStat value={plantas.length} label="plantas" />
          <HeroStat value={tiendas.length} label="tiendas" />
          <HeroStat value={zonas.length} label="zonas" />
        </div>
      </section>

      {/* 3 Reglas de oro */}
      <Section
        eyebrow="Lo esencial"
        title="Las 3 reglas de oro"
        description="Sigue estas reglas y tus plantas estarán siempre bien."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <ReglaCard
            numero="01"
            iconKey="drop"
            titulo="No todas las plantas necesitan el mismo riego"
            cuerpo="Como regla general: en verano, plantas de interior una vez por semana. En invierno, cada dos semanas."
            tip='Truco profesional: coloca fieltro en las mesas. Humedécelo y las plantas tomarán agua por capilaridad según su necesidad.'
            ctaHref="/mi-tienda"
            ctaLabel="Ver frecuencia exacta de mi tienda"
          />
          <ReglaCard
            numero="02"
            iconKey="sun"
            titulo="Ubica cada planta según su luz"
            cuerpo="Las plantas de interior no toleran sol directo, salvo el de la mañana. Las de exterior necesitan al menos algunas horas de sol directo al día."
            tip="Sol directo fuerte sobre interior → hojas quemadas. Sin sol sobre exterior → la planta se debilita y pierde forma."
            ctaHref="/plantas"
            ctaLabel="Ver fichas de plantas"
          />
          <ReglaCard
            numero="03"
            iconKey="eye"
            titulo="Revisar cada día: 10 minutos salvan plantas"
            cuerpo="Una planta enferma detectada a tiempo se puede salvar. Una planta abandonada se pierde. Revisa en la mañana, al mediodía y al cierre."
            tip="Mete el dedo 2 cm en la tierra. Húmedo no riegues; seco riega. Es más preciso que cualquier calendario."
            ctaHref="/rutina"
            ctaLabel="Ver checklist diario"
          />
        </div>
      </Section>

      {/* Plantas especiales */}
      <Section
        eyebrow="Atención extra"
        title="Cuidados especiales"
        description="Estas plantas necesitan reglas particulares. Léelas antes de regar."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {plantasEspeciales.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green-deep)]">
                  <Icons.flower aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="serif text-[20px] leading-tight">{p.nombre}</h3>
              </div>
              <dl className="mt-4 grid gap-3 text-[14px]">
                <div>
                  <dt className="eyebrow text-[var(--color-green-deep)]">Cuidado especial</dt>
                  <dd className="mt-1 text-[var(--color-ink)] leading-relaxed">{p.especial}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-[var(--color-green-deep)]">Temperatura</dt>
                  <dd className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">{p.temperatura}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-[var(--color-terracotta)]">Atento a esto</dt>
                  <dd className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">{p.urgente}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </Section>

      {/* Acceso rápido */}
      <Section eyebrow="Saltos rápidos" title="¿Qué necesitas ahora?">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <QuickLink href="/mi-tienda" iconKey="store" label="Mi tienda" hint="Riego por zona" />
          <QuickLink href="/plantas" iconKey="sprout" label="Plantas" hint="Catálogo y fichas" />
          <QuickLink href="/alertas" iconKey="alert" label="Alertas" hint="Diagnóstico rápido" />
          <QuickLink href="/liquidacion" iconKey="tag" label="Liquidación" hint="Proceso completo" />
        </div>
      </Section>

      {/* Reminder */}
      <Stat
        value={`${tiendas.length} · ${plantas.length}`}
        label="Tiendas · Plantas activas"
        hint="Actualiza el dato real desde Easy cuando llegue una recarga de mercadería."
      />
    </div>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-start rounded-xl bg-[var(--color-cream)]/10 px-4 py-3 backdrop-blur-sm">
      <span className="serif text-[28px] sm:text-[36px] leading-none text-[var(--color-cream)]">
        {value}
      </span>
      <span className="text-[12px] uppercase tracking-[0.08em] text-[var(--color-cream)]/70 mt-1">
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
    <Card className="flex flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <Icon aria-hidden className="h-6 w-6 text-[var(--color-green-deep)]" strokeWidth={1.5} />
        <span className="eyebrow">{numero}</span>
      </div>
      <h3 className="serif mt-4 text-[22px] leading-tight">{titulo}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
        {cuerpo}
      </p>
      <Alert className="mt-4" variant="info">
        {tip}
      </Alert>
      <Link
        href={ctaHref}
        className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-green-deep)] hover:underline"
      >
        {ctaLabel}
        <Icons.arrowRight aria-hidden className="h-4 w-4" strokeWidth={1.75} />
      </Link>
    </Card>
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
      className="flex items-center gap-3 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)] min-h-[72px]"
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green-deep)]">
        <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-medium text-[15px]">{label}</p>
        <p className="text-[12px] text-[var(--color-ink-soft)]">{hint}</p>
      </div>
    </Link>
  );
}
