import { AppHeader } from "@/components/app-header";
import { ExperimentForm } from "@/components/experiment-form";
import {
  emptyFormInitial,
  experimentToFormInitial,
} from "@/lib/form-initial";
import { mapExperimentRow } from "@/lib/map-experiment";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type SearchParams = { from?: string | string[] };

export default async function NewExperimentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: pastRows } = await supabase
    .from("experiments")
    .select("id, name, created_at")
    .order("date", { ascending: false });

  const pastExperiments =
    pastRows?.map((r) => ({
      id: r.id as string,
      name: r.name as string,
      created_at: r.created_at as string,
    })) ?? [];

  const fromRaw = searchParams.from;
  const fromId = Array.isArray(fromRaw) ? fromRaw[0] : fromRaw;

  let initial = emptyFormInitial;

  if (fromId) {
    const { data: src } = await supabase
      .from("experiments")
      .select("*")
      .eq("id", fromId)
      .maybeSingle();

    if (src) {
      const exp = mapExperimentRow(
        src as Parameters<typeof mapExperimentRow>[0]
      );
      initial = {
        ...experimentToFormInitial(exp),
        based_on: fromId,
      };
    }
  }

  return (
    <div className="min-h-dvh bg-white pb-12">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">
          New experiment
        </h1>
        <ExperimentForm
          mode="create"
          initial={initial}
          pastExperiments={pastExperiments}
        />
      </main>
    </div>
  );
}
