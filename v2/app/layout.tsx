import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlantasFácil — Manual de Plantas Vivas Easy Chile",
  description:
    "Guía operativa para vendedores de plantas vivas en tiendas Easy Chile. Frecuencias de riego, fichas de cuidado y proceso de liquidación.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${sourceSerif4.variable} antialiased`}>
        <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)] md:flex-row">
          {/* Desktop sidebar */}
          <aside className="hidden w-56 shrink-0 md:block">
            <div className="sticky top-0 flex h-screen flex-col">
              <div className="border-b border-[var(--rule)] px-4 py-5">
                <p
                  className="text-lg font-semibold leading-none text-[var(--green-deep)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  PlantasFácil
                </p>
                <p className="mt-0.5 text-xs text-[var(--ink-soft)]">Easy Chile</p>
              </div>
              <Nav />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>

          {/* Mobile bottom nav */}
          <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
            <Nav />
          </div>
        </div>
      </body>
    </html>
  );
}
