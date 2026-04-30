import { Checklist } from "@/components/Checklist";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

export const metadata = {
  title: "Rutina Diaria — PlantasFácil",
};

const APERTURA = [
  { id: "ap_recorrido", label: "Recorrido de plantas vivas", sublabel: "Revisar estado general, signos de estrés" },
  { id: "ap_marchitas", label: "Retirar flores y hojas marchitas", sublabel: "Mejora presentación y previene hongos" },
  { id: "ap_stock", label: "Verificar etiquetas y precios", sublabel: "Asegurar que todos los SKUs estén etiquetados" },
  { id: "ap_riego", label: "Riego según grupo y zona climática", sublabel: "Consultar frecuencia en la app" },
  { id: "ap_plagas", label: "Inspección rápida de plagas", sublabel: "Revisar envés de hojas y brotes nuevos" },
  { id: "ap_orden", label: "Ordenar exhibición", sublabel: "Alinear y girar macetas para aspecto uniforme" },
];

const CIERRE = [
  { id: "ci_riego_tarde", label: "Riego vespertino si corresponde", sublabel: "Solo en grupos que lo requieren (plantines, aromáticas)" },
  { id: "ci_marchitas", label: "Segunda revisión de marchitas", sublabel: "Lo que quedó del día" },
  { id: "ci_liquidacion", label: "Identificar plantas para liquidación", sublabel: "Dañadas, sin flor, bajo stock" },
  { id: "ci_registro", label: "Anotar novedades", sublabel: "Plagas, llegada de mercadería, pérdidas" },
  { id: "ci_proteger", label: "Proteger plantas sensibles", sublabel: "Mover interiores si hay helada prevista" },
];

const SEMANAL = [
  { id: "sem_limpieza", label: "Limpiar hojas de polvo", sublabel: "Paño húmedo en plantas de interior" },
  { id: "sem_rotacion", label: "Rotar plantas colgantes", sublabel: "Para crecimiento uniforme" },
  { id: "sem_tutores", label: "Revisar tutores y amarres", sublabel: "Trepadoras y palmeras" },
  { id: "sem_drenaje", label: "Revisar drenaje de platos", sublabel: "No dejar agua acumulada > 2h" },
  { id: "sem_fertilizacion", label: "Fertilización si corresponde", sublabel: "Grupos en floración activa" },
];

export default function RutinaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <Eyebrow>Operaciones diarias</Eyebrow>
        <h1
          className="mt-1 text-2xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Rutina Diaria
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Progreso guardado en este dispositivo
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <Section>
          <div className="rounded-[var(--radius-lg)] border border-[var(--rule)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
            <Checklist
              items={APERTURA}
              storageKey="rutina_apertura"
              title="🌅 Apertura"
            />
          </div>
        </Section>

        <div className="rounded-[var(--radius-lg)] border border-[var(--rule)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <Checklist
            items={CIERRE}
            storageKey="rutina_cierre"
            title="🌇 Cierre"
          />
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--rule)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <Checklist
            items={SEMANAL}
            storageKey="rutina_semanal"
            title="📅 Semanal"
          />
        </div>
      </div>
    </div>
  );
}
