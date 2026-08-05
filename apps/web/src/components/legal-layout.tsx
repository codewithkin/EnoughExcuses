import Link from "next/link";

// Shared chrome for the /privacy and /terms pages so both stay visually
// consistent with the landing page without duplicating markup.

export function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6">
      <header className="border-b border-line py-16">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.3em] text-green hover:text-green-bright"
        >
          ExcuseLess
        </Link>
        <h1 className="mt-6 font-display text-4xl tracking-tight text-fg sm:text-5xl">{title}</h1>
        <p className="mt-4 font-mono text-xs text-subtle">Effective {effectiveDate}</p>
      </header>

      <div className="py-16">{children}</div>

      <footer className="border-t border-line py-10 font-mono text-xs text-subtle">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} ExcuseLess</span>
          <span className="flex gap-5">
            <Link href="/" className="hover:text-fg">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-fg">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-fg">
              Terms
            </Link>
          </span>
        </div>
      </footer>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl tracking-tight text-fg">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-subtle">{children}</div>
    </section>
  );
}

export function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc marker:text-green">
          {item}
        </li>
      ))}
    </ul>
  );
}
