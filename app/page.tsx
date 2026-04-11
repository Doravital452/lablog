import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, GitBranch, MessageSquare, Table2, Zap } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white text-foreground">
      <header className="border-b border-border/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold tracking-tight"
          >
            <span className="text-xl" aria-hidden>
              🧪
            </span>
            LabLog
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-3 py-1.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start for free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
          <p className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-lg" aria-hidden>
              🧪
            </span>
            Built for chemistry research
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl md:leading-tight">
            Stop tracking experiments in WhatsApp
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            LabLog gives you a clean experiment logger built for chemistry
            researchers. Log parameters, compare runs, spot patterns.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#6366f1] bg-white px-6 text-sm font-semibold text-[#6366f1] transition-colors hover:bg-[#6366f1]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
          </div>
        </section>

        <section className="border-t border-border/60 bg-neutral-50/50 py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-[#6366f1]">
              The problem
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-lg font-medium text-foreground">
              Chat apps weren&apos;t built for the lab
            </p>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              <li className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                  <Clock className="size-5" aria-hidden />
                </div>
                <p className="mt-4 font-semibold leading-snug">
                  Hours of waiting, no clear next step
                </p>
              </li>
              <li className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                  <MessageSquare className="size-5" aria-hidden />
                </div>
                <p className="mt-4 font-semibold leading-snug">
                  Results buried in chat history
                </p>
              </li>
              <li className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                  <Table2 className="size-5" aria-hidden />
                </div>
                <p className="mt-4 font-semibold leading-snug">
                  No way to compare runs side by side
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-[#6366f1]">
              Features
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-lg font-medium text-foreground">
              Everything you need to run cleaner experiments
            </p>
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              <li>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                  <Zap className="size-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Log in 2 minutes</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Track concentration, pH, temperature, time per experiment.
                </p>
              </li>
              <li>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                  <Table2 className="size-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Compare table</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  See all runs side by side, spot patterns instantly.
                </p>
              </li>
              <li>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                  <GitBranch className="size-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Experiment lineage
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Track which run was based on which.
                </p>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/80 py-8">
        <p className="text-center text-sm text-muted-foreground">
          LabLog - Free for researchers
        </p>
      </footer>
    </div>
  );
}
