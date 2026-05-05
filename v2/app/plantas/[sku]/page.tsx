import { notFound } from "next/navigation";
import Link from "next/link";
import { plants, plantBySku, careFor, climateZoneById } from "@/lib/data";
import { ArrowLeft, Droplets, Sun, Thermometer, Check, Leaf } from "@/lib/icons";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Alert } from "@/components/ui/alert";
import { ShareButton } from "@/components/ShareButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ sku: string }>;
}

export function generateStaticParams() {
  return plants.map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params;
  const plant = plantBySku.get(sku);
  if (!plant) return { title: "Planta no encontrada" };
  return { title: `${plant.nombre} — PlantasFácil` };
}

export default async function PlantDetailPage({ params }: Props) {
  const { sku } = await params;
  const plant = plantBySku.get(sku);
  if (!plant) notFound();

  const care = careFor(plant);

  const climateOrder = [
    "desertico",
    "semiarido",
    "costero",
    "templado",
    "montana",
    "frio_humedo",
  ] as const;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/plantas"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Catálogo
        </Link>
        <ShareButton title={plant.nombre} text={`Ficha de cuidado: ${plant.nombre}`} />
      </div>

      <div
        className="mb-6 flex h-40 items-center justify-center rounded-[var(--radius-lg)]"
        style={{ background: care ? `${care.color}18` : "#f0f0f0" }}
      >
        <Leaf className="size-16 opacity-20" style={{ color: care?.color }} aria-hidden />
      </div>

      <header className="mb-6">
        <Eyebrow>{care?.nombre ?? plant.grupo}</Eyebrow>
        <h1
          className="mt-1 text-2xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {plant.nombre}
        </h1>
        <p className="mt-0.5 text-xs text-[var(--ink-soft)]">SKU {plant.sku}</p>
      </header>

      <div className="mb-6 flex items-center gap-2 text-sm">
        <span
          className={`font-semibold ${plant.tiendas.length > 0 ? "text-[var(--success)]" : "text-[var(--ink-soft)]"}`}
        >
          {plant.tiendas.length > 0
            ? `Disponible en ${plant.tiendas.length} ${plant.tiendas.length === 1 ? "tienda" : "tiendas"}`
            : "Sin presencia en tienda"}
        </span>
      </div>

      {care && (
        <>
          <Card className="mb-4" accentColor={care.color}>
            <CardBody className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-soft)]">
                  <Sun className="size-3.5" aria-hidden /> Luz
                </span>
                <span className="text-sm text-[var(--ink)]">{care.luz}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-soft)]">
                  <Droplets className="size-3.5" aria-hidden /> Riego
                </span>
                <span className="text-sm text-[var(--ink)]">{care.riego}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-soft)]">
                  <Thermometer className="size-3.5" aria-hidden /> Temperatura
                </span>
                <span className="text-sm text-[var(--ink)]">
                  {care.temperatura_min}° – {care.temperatura_max}°C
                </span>
              </div>
            </CardBody>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <Eyebrow>Frecuencia de riego por zona</Eyebrow>
            </CardHeader>
            <CardBody className="pt-3">
              <ul className="divide-y divide-[var(--rule)]">
                {climateOrder.map((zoneId) => {
                  const zone = climateZoneById.get(zoneId);
                  const freq = care.frecuencia[zoneId];
                  if (!zone || !freq) return null;
                  return (
                    <li key={zoneId} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="flex items-center gap-2">
                        <span aria-hidden>{zone.emoji}</span>
                        <span className="text-[var(--ink)]">{zone.nombre}</span>
                      </span>
                      <span className="font-semibold text-[var(--ink)]">{freq}</span>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>

          {care.alertas.length > 0 && (
            <div className="mb-4 flex flex-col gap-2">
              {care.alertas.map((alerta, i) => (
                <Alert key={i} variant={alerta.includes("🚨") ? "danger" : "warning"}>
                  {alerta.replace(/^[⚠️🚨]\s*/, "")}
                </Alert>
              ))}
            </div>
          )}

          {care.tips.length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <Eyebrow>Tips operativos</Eyebrow>
              </CardHeader>
              <CardBody className="pt-3">
                <ul className="flex flex-col gap-2">
                  {care.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--ink)]">
                      <Check className="mt-0.5 size-4 shrink-0 text-[var(--green-deep)]" aria-hidden />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardBody>
              <Eyebrow className="mb-2">Estructura en tienda</Eyebrow>
              <p className="text-sm text-[var(--ink)]">{care.estructura}</p>
            </CardBody>
          </Card>
        </>
      )}

      {!care && (
        <Alert variant="warning">
          No hay ficha de cuidado para este grupo ({plant.grupo}).
        </Alert>
      )}
    </div>
  );
}
