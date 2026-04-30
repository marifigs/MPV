import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Source_Serif_4 } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
