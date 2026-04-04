import { AppHeader } from "@/components/app-header";
import { ExperimentForm } from "@/components/experiment-form";
import { experimentToFormInitial } from "@/lib/form-initial";
import { mapExperimentRow } from "@/lib/map-experiment";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditExperimentPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("experiments")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !row) notFound();

  const exp = mapExperimentRow(row as Parameters<typeof mapExperimentRow>[0]);

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

  return (
    <div className="min-h-dvh bg-white pb-12">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">
          Edit experiment
        </h1>
        <ExperimentForm
          mode="edit"
          experimentId={exp.id}
          initial={experimentToFormInitial(exp)}
          pastExperiments={pastExperiments}
        />
      </main>
    </div>
  );
}
