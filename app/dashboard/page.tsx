import { AppHeader } from "@/components/app-header";
import { DashboardViews } from "@/components/dashboard-views";
import { FloatingNewButton } from "@/components/floating-new-button";
import { mapExperimentRow } from "@/lib/map-experiment";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("experiments")
    .select("*")
    .order("date", { ascending: false });

  const experiments =
    !error && rows
      ? rows.map((r) =>
          mapExperimentRow(
            r as Parameters<typeof mapExperimentRow>[0]
          )
        )
      : [];

  return (
    <div className="min-h-dvh bg-white pb-28">
      <AppHeader />
      <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-6 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">
          Dashboard
        </h1>
        {error ? (
          <p className="text-sm text-red-600">
            Could not load experiments. Check that the database is set up and
            you are signed in.
          </p>
        ) : (
          <DashboardViews experiments={experiments} />
        )}
      </main>
      <FloatingNewButton />
    </div>
  );
}
