import { faqClientes } from '@/data';
import type { FaqCliente } from '@/types/data';

export const metadata = {
  title: 'FAQ de clientes — Manual Plantas Vivas',
};

const CAT_LABEL: Record<FaqCliente['categoria'], string> = {
  riego:     'Riego',
  cuidados:  'Cuidados',
  problemas: 'Problemas',
  seguridad: 'Seguridad',
};

const CAT_COLOR: Record<FaqCliente['categoria'], string> = {
  riego:     'var(--color-green-deep)',
  cuidados:  'var(--color-gold)',
  problemas: 'var(--color-terracotta)',
  seguridad: 'var(--color-warning)',
};

const CATS = ['riego', 'problemas', 'cuidados', 'seguridad'] as const;

export default function FaqPage() {
  return (
    <div className="space-y-12">

      {/* Header */}
      <header style={{ borderBottom: '0.5px solid var(--color-rule)', paddingBottom: '2rem' }}>
        <p className="eyebrow mb-4" style={{ color: 'var(--color-green-soft)' }}>Para el vendedor</p>
        <h1 className="display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontStyle: 'italic', lineHeight: 0.88 }}>
          Preguntas frecuentes del cliente
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--color-ink-soft)', maxWidth: '58ch' }}>
          Las 12 preguntas que más hace el comprador y cómo responderlas con seguridad.
          Léelas antes de tu turno — en 5 minutos las tienes.
        </p>
      </header>

      {/* Categorías */}
      {CATS.map(cat => {
        const items = faqClientes.filter(f => f.categoria === cat);
        if (items.length === 0) return null;
        const color = CAT_COLOR[cat];
        return (
          <section key={cat} className="space-y-3">
            <div className="flex items-center gap-4">
              <h2
                className="display shrink-0"
                style={{ fontSize: 'clamp(22px, 2.5vw, 34px)', fontStyle: 'italic', lineHeight: 0.9, color }}
              >
                {CAT_LABEL[cat]}
              </h2>
              <div style={{ flex: 1, height: '0.5px', background: color, opacity: 0.25 }} />
            </div>

            <ul className="divide-y" style={{ border: '0.5px solid var(--color-rule)' }}>
              {items.map(f => (
                <li key={f.id} className="px-5 py-5 space-y-2">
                  <p className="font-medium text-[15px] leading-snug" style={{ color: 'var(--color-ink)' }}>
                    {f.pregunta}
                  </p>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-ink-soft)' }}>
                    {f.respuesta}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {/* Footer note */}
      <aside
        style={{
          borderLeft: '2px solid var(--color-green-deep)',
          paddingLeft: '1.25rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
        }}
      >
        <p className="eyebrow mb-1" style={{ color: 'var(--color-green-deep)' }}>Si no sabes la respuesta</p>
        <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>
          Es mejor decir &ldquo;déjame verificarlo&rdquo; que inventar una respuesta. Busca el nombre de la planta
          en la sección Plantas de este manual — ahí están los cuidados específicos de cada especie.
        </p>
      </aside>

    </div>
  );
}
