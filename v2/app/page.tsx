import Link from "next/link";
import { plants, careGroups, stores, plantsInStock } from "@/lib/data";
import { Leaf, Store, Globe, ClipboardList, AlertTriangle, TrendingDown } from "@/lib/icons";
import { Card, CardBody } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Stat } from "@/components/ui/stat";

const NAV_CARDS = [
  {
    href: "/plantas",
    icon: Leaf,
    label: "Catálogo de Plantas",
    description: "Fichas de cuidado por grupo",
    color: "#2d5a3d",
  },
  {
    href: "/tiendas",
    icon: Store,
    label: "Mi Tienda",
    description: "Frecuencias de riego por zona",
    color: "#6b8f71",
  },
  {
    href: "/clima",
    icon: Globe,
    label: "Clima y Zonas",
    description: "6 zonas climáticas de Chile",
    color: "#4A90D9",
  },
  {
    href: "/rutina",
    icon: ClipboardList,
    label: "Rutina Diaria",
    description: "Checklist de apertura y cierre",
    color: "#D4A04C",
  },
  {
    href: "/alertas",
    icon: AlertTriangle,
    label: "Alertas",
    description: "Plantas en riesgo y liquidación",
    color: "#c8553d",
  },
] as const;

export default function HomePage() {
  const inStock = plantsInStock();
  const totalStock = inStock.reduce((sum, p) => sum + p.stock_total, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <header className="mb-8">
        <Eyebrow>Manual de Plantas Vivas</Eyebrow>
        <h1
          className="mt-2 text-3xl font-semibold leading-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          PlantasFácil
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Easy Chile — Terrazas y Jardín
        </p>
      </header>

      <div className="mb-8 grid grid-cols-3 gap-4 rounded-[var(--radius-lg)] border border-[var(--rule)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
        <Stat label="Plantas" value={plants.length} />
        <Stat label="Grupos" value={careGroups.length} />
        <Stat label="Tiendas" value={stores.length} />
      </div>

      <div className="mb-8 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--green-soft)]/30 bg-[var(--green-deep)]/5 px-4 py-3">
        <TrendingDown className="size-4 shrink-0 text-[var(--green-deep)]" aria-hidden />
        <p className="text-sm text-[var(--ink)]">
          <span className="font-semibold">{inStock.length} SKUs</span> con stock activo ·{" "}
          <span className="font-semibold">{totalStock.toLocaleString("es-CL")}</span> unidades
        </p>
      </div>

      <nav aria-label="Secciones">
        <ul className="flex flex-col gap-3">
          {NAV_CARDS.map(({ href, icon: Icon, label, description, color }) => (
            <li key={href}>
              <Link href={href} className="group block">
                <Card interactive accentColor={color}>
                  <CardBody className="flex items-center gap-4">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                      style={{ background: `${color}18` }}
                      aria-hidden
                    >
                      <Icon className="size-5" style={{ color }} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--ink)]">{label}</p>
                      <p className="text-sm text-[var(--ink-soft)]">{description}</p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
