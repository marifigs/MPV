import Link from "next/link";
import { WifiOff, Leaf } from "@/lib/icons";

export const metadata = {
  title: "Sin conexión — PlantasFácil",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-[var(--surface-raised)]">
        <WifiOff className="size-10 text-[var(--ink-soft)]" aria-hidden />
      </div>

      <div>
        <h1
          className="text-2xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sin conexión
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Estás offline. Las páginas que visitaste están disponibles en caché.
        </p>
      </div>

      <div className="flex flex-col gap-2 text-sm text-[var(--ink-soft)]">
        <p className="font-medium text-[var(--ink)]">Disponible offline:</p>
        <ul className="flex flex-col gap-1">
          <li>
            <Link href="/plantas" className="flex items-center gap-1.5 hover:text-[var(--ink)]">
              <Leaf className="size-3.5" aria-hidden />
              Catálogo de plantas (visitadas)
            </Link>
          </li>
          <li>
            <Link href="/rutina" className="hover:text-[var(--ink)]">
              Rutina diaria
            </Link>
          </li>
          <li>
            <Link href="/tiendas" className="hover:text-[var(--ink)]">
              Mi tienda
            </Link>
          </li>
        </ul>
      </div>

      <p className="text-xs text-[var(--ink-soft)]">
        El progreso del checklist se guardó en este dispositivo.
      </p>
    </div>
  );
}
