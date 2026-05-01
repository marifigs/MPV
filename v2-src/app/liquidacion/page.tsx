import { Section } from '@/components/ui/section';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Alert } from '@/components/ui/alert';
import { DiscountBadge } from '@/components/ui/discount-badge';
import { Icons } from '@/lib/icons';
import { liquidacion } from '@/data';

export const metadata = {
  title: 'Liquidación — Manual Plantas Vivas',
};

const formatCLP = (n: number) => `$${n.toLocaleString('es-CL')}`;

export default function LiquidacionPage() {
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-2xl bg-[var(--color-green-deep)] p-7 sm:p-10 text-[var(--color-cream)]">
        <Eyebrow className="text-[var(--color-cream)]/70">Proceso oficial</Eyebrow>
        <h1 className="serif mt-2 text-[40px] sm:text-[52px] leading-[1.05] tracking-tight">
          Proceso de
          <br />
          liquidación
        </h1>
        <p className="mt-4 max-w-prose text-[var(--color-cream)]/85 leading-relaxed">
          Gestionar bien la liquidación reduce la merma, libera espacio y permite reponer producto
          fresco. Una planta liquidada a tiempo es mejor que una perdida.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--color-cream)]/10 px-3 py-1.5 text-[13px]">
            3 tipos de planta
          </span>
          <span className="rounded-full bg-[var(--color-cream)]/10 px-3 py-1.5 text-[13px]">
            3 etapas del proceso
          </span>
          <span className="rounded-full bg-[var(--color-cream)]/10 px-3 py-1.5 text-[13px]">
            1 zona exclusiva
          </span>
        </div>
      </section>

      {/* Etapa 1: cuándo liquidar */}
      <Section
        eyebrow="Etapa 1"
        title="¿Cuándo liquidar?"
        description="Actúa antes de que la planta pierda demasiado valor. El timing lo es todo."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {liquidacion.reglas.map((r, i) => (
            <Card key={r.id} className="flex h-full flex-col">
              <CardHeader>
                <Eyebrow>Tipo {i + 1}</Eyebrow>
                <CardTitle>{r.titulo}</CardTitle>
                <CardDescription className="mt-1 font-medium text-[var(--color-green-deep)]">
                  Plazo: {r.plazo}
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p className="text-[14px] leading-relaxed text-[var(--color-ink)]">
                  {r.descripcion}
                </p>
                <Alert className="mt-4" variant="info">
                  {r.tip}
                </Alert>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* Etapa 2: cuánto descontar */}
      <Section
        eyebrow="Etapa 2"
        title="¿Cuánto descontar?"
        description="El precio debe ser lo suficientemente atractivo para generar rotación rápida."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {liquidacion.descuentos.map((d) => (
            <Card key={d.porcentaje} className="p-5">
              <DiscountBadge tier={d.porcentaje} size="lg" />
              <p className="mt-3 serif text-[20px]">{d.nombre}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                {d.descripcion}
              </p>
            </Card>
          ))}
        </div>

        <Alert className="mt-6" variant="success" title="Regla de oro del precio de liquidación">
          <p className="leading-relaxed">
            El objetivo es <strong>rotar rápido</strong>, no recuperar el precio completo. Una planta
            en liquidación que no se vende en 7 días debe bajar al siguiente nivel.
            <strong> Es mejor recuperar el 30% que perder el 100%.</strong>
          </p>
        </Alert>

        <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-rule)]">
          <div className="flex items-center gap-2 bg-[var(--color-surface-2)] px-5 py-3">
            <Icons.chart aria-hidden className="h-4 w-4 text-[var(--color-green-deep)]" strokeWidth={1.75} />
            <p className="text-[13px] font-medium">Ejemplo práctico de precios</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-[var(--color-rule)] text-left text-[12px] uppercase tracking-[0.06em] text-[var(--color-ink-soft)]">
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium text-right">Normal</th>
                  <th className="px-4 py-3 font-medium text-right text-[var(--color-green-deep)]">−30%</th>
                  <th className="px-4 py-3 font-medium text-right text-[var(--color-warning)]">−50%</th>
                  <th className="px-4 py-3 font-medium text-right text-[var(--color-terracotta)]">−70%</th>
                </tr>
              </thead>
              <tbody>
                {liquidacion.precios.map((p) => (
                  <tr key={p.producto} className="border-t border-[var(--color-rule)]">
                    <td className="px-4 py-3 font-medium">{p.producto}</td>
                    <td className="px-4 py-3 text-right text-[var(--color-ink-soft)]">
                      {formatCLP(p.normal)}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--color-green-deep)] font-medium">
                      {formatCLP(p.con30)}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--color-warning)] font-medium">
                      {formatCLP(p.con50)}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--color-terracotta)] font-medium">
                      {formatCLP(p.con70)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-[var(--color-rule)] bg-[var(--color-surface-2)] px-5 py-2 text-[12px] italic text-[var(--color-ink-soft)]">
            Precios referenciales. Ajustar según el precio real en sistema Easy.
          </p>
        </div>
      </Section>

      {/* Etapa 3: zona */}
      <Section
        eyebrow="Etapa 3"
        title="Zona de liquidación"
        description="Una zona bien montada vende sola. El cliente busca, encuentra y decide."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Icons.check aria-hidden className="h-4 w-4 text-[var(--color-success)]" strokeWidth={2} />
              <h3 className="serif text-[18px]">Requisitos obligatorios</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14px]">
              <RequisitoItem
                icon="megaphone"
                titulo="Señalética visible"
                desc="Cartel ”LIQUIDACIÓN” grande y llamativo. Que se vea desde la entrada del pasillo."
              />
              <RequisitoItem
                icon="package"
                titulo="Todas juntas"
                desc="Sin excepción: todas las plantas en liquidación van al mismo sector. No mezclar con producto a precio normal."
              />
              <RequisitoItem
                icon="tag"
                titulo="Precio visible en cada planta"
                desc="Etiqueta con precio nuevo Y precio original tachado. El cliente debe ver el ahorro de un vistazo."
              />
              <RequisitoItem
                icon="drop"
                titulo="Seguir regando"
                desc="Las plantas en liquidación también necesitan agua. Una planta muerta en la zona da muy mala imagen."
              />
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Icons.pin aria-hidden className="h-4 w-4 text-[var(--color-green-deep)]" strokeWidth={1.75} />
              <h3 className="serif text-[18px]">Dónde ubicar la zona</h3>
            </div>
            <div className="mt-4 space-y-3 text-[14px]">
              <Alert variant="success" title="Buenas ubicaciones">
                Al final del pasillo de plantas, en el flujo de clientes, cerca de caja jardín o de la entrada al sector.
              </Alert>
              <Alert variant="danger" title="Evitar">
                Esconder la zona al fondo sin visibilidad. Mezclar con producto bueno. Ubicar sin señalética.
              </Alert>
              <Alert variant="info" title="Pro tip">
                Una zona de liquidación bien montada atrae clientes nuevos y genera tráfico a toda el área de plantas.
              </Alert>
              <Alert variant="info" title="Comunica internamente">
                Avisa al equipo cuando haya liquidación activa. Más ojos = más ventas.
              </Alert>
            </div>
          </Card>
        </div>
      </Section>

      {/* Flujo */}
      <Section eyebrow="Paso a paso" title="Flujo completo del proceso" description="De principio a fin.">
        <ol className="space-y-3">
          {liquidacion.flujo.map((paso, i, arr) => (
            <li key={paso.numero} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-green-deep)] text-[var(--color-cream)] font-medium">
                  {paso.numero}
                </span>
                {i < arr.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-[var(--color-rule)]" aria-hidden />
                ) : null}
              </div>
              <div className="pb-2">
                <h3 className="serif text-[18px] leading-tight">{paso.titulo}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                  {paso.detalle}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* KPIs */}
      <Section eyebrow="Mediciones" title="KPIs que deberías monitorear">
        <div className="grid gap-3 sm:grid-cols-2">
          {liquidacion.kpis.map((k) => (
            <Card key={k.nombre} className="p-5">
              <Eyebrow className="text-[var(--color-green-deep)]">{k.nombre}</Eyebrow>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink)]">
                {k.descripcion}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-2)] px-3 py-1 text-[13px] font-medium">
                <Icons.trending aria-hidden className="h-3.5 w-3.5 text-[var(--color-green-deep)]" strokeWidth={1.75} />
                Objetivo: {k.objetivo}
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function RequisitoItem({
  icon,
  titulo,
  desc,
}: {
  icon: 'megaphone' | 'package' | 'tag' | 'drop';
  titulo: string;
  desc: string;
}) {
  const Icon = Icons[icon];
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--color-surface-2)] text-[var(--color-green-deep)]">
        <Icon aria-hidden className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-medium leading-snug">{titulo}</p>
        <p className="text-[var(--color-ink-soft)] leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}
