import { PlayBadge } from "@/components/play-badge";
import { WaitlistForm } from "@/components/waitlist-form";

const steps = [
  {
    n: "01",
    title: "Open it.",
    body: "Your current task is right there. The timer's already running.",
  },
  {
    n: "02",
    title: "Do the one thing.",
    body: "No list to browse, no decisions. Just the task in front of you.",
  },
  {
    n: "03",
    title: "Done or Skip.",
    body: "Mark it and the next task loads instantly. Keep the loop going.",
  },
];

function CtaWithNote({ centered = false }: { centered?: boolean }) {
  return (
    <div className={centered ? "flex flex-col items-center gap-2" : "flex flex-col gap-2"}>
      <PlayBadge />
      <span className="font-mono text-xs text-subtle">iOS coming soon.</span>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-green">{children}</p>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6">
      {/* Hero */}
      <section className="flex min-h-[88vh] flex-col justify-center py-24">
        <Eyebrow>ExcuseLess</Eyebrow>
        <h1 className="max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-fg sm:text-7xl">
          Stop making excuses.
          <br />
          Start getting things done.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-subtle">
          ExcuseLess turns your day into one focused loop. One task. One timer. Done. Next.
        </p>
        <div className="mt-10">
          <CtaWithNote />
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-line py-24">
        <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">
          You don&apos;t need more motivation.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-subtle">
          You&apos;ve got the apps. The lists. The color-coded systems. And you&apos;re still not
          doing the thing. Motivation runs out. Discipline doesn&apos;t. ExcuseLess skips the
          planning theater and puts you straight into the work.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-line py-24">
        <Eyebrow>The loop</Eyebrow>
        <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">
          One loop. That&apos;s the whole app.
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl border border-line bg-card p-6">
              <p className="font-mono text-sm text-green">{s.n}</p>
              <h3 className="mt-4 text-xl font-semibold text-fg">{s.title}</h3>
              <p className="mt-2 text-subtle">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 font-mono text-sm text-subtle">
          No dashboards. No setup. Just the next right action.
        </p>
      </section>

      {/* Goals to Tasks */}
      <section className="border-t border-line py-24">
        <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">
          Set a goal. Break it into tasks. Execute.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-subtle">
          Pick what you&apos;re working toward. Drop the tasks under it. ExcuseLess feeds them to you
          one at a time, in order — so a big goal becomes the next single thing you do.
        </p>
      </section>

      {/* Streak */}
      <section className="border-t border-line py-24">
        <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">
          Finish one task a day. Keep the streak alive.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-subtle">
          Show up, do one thing, and your streak grows. Miss a day and it resets. Simple enough to
          hold in your head — and surprisingly hard to break once it&apos;s going.
        </p>
      </section>

      {/* Proof */}
      <section className="border-t border-line py-24">
        <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">
          Discipline you can actually see.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-subtle">
          Every day, ExcuseLess turns your focus into a clean summary — tasks done, time focused,
          streak intact. Post it. Or just keep it for yourself. Either way, the receipts are real.
        </p>
      </section>

      {/* Pricing */}
      <section className="border-t border-line py-24">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">
          Free. The whole thing.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-subtle">
          Goals, tasks, the focus timer, streaks, your daily summary, shareable cards — everything
          in ExcuseLess is free right now. No trial, no paywall, nothing locked behind an upgrade.
        </p>
      </section>

      {/* Final CTA */}
      <section className="border-t border-line py-28 text-center">
        <h2 className="font-display text-4xl tracking-tight text-fg sm:text-5xl">No excuses today.</h2>
        <p className="mt-4 text-lg text-subtle">One task. One timer. Start the streak.</p>
        <div className="mt-10 flex justify-center">
          <CtaWithNote centered />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-green">ExcuseLess</p>
            <p className="mt-3 max-w-xs text-sm text-subtle">
              One task. One timer. Discipline, made visible.
            </p>
            <div className="mt-6">
              <PlayBadge />
              <p className="mt-2 font-mono text-xs text-subtle">iOS coming soon.</p>
            </div>
          </div>
          <div className="max-w-sm">
            <p className="text-sm font-medium text-fg">iPhone user? Be first in line.</p>
            <div className="mt-3">
              <WaitlistForm />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 font-mono text-xs text-subtle sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} ExcuseLess</span>
          <span className="flex gap-5">
            <a href="/privacy" className="hover:text-fg">
              Privacy
            </a>
            <a href="/terms" className="hover:text-fg">
              Terms
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
