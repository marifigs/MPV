export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1
        className="text-4xl font-semibold"
        style={{ fontFamily: "var(--font-display)", color: "var(--green-deep)" }}
      >
        PlantasFácil Easy
      </h1>
      <p className="mt-4" style={{ color: "var(--ink-soft)" }}>
        Manual de Plantas Vivas · Easy Chile
      </p>
    </main>
  );
}
