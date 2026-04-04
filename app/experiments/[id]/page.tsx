import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { buttonVariants } from "@/components/ui/button";
import { formatConcentration } from "@/lib/concentration";
import { formatExperimentDateTime } from "@/lib/format-experiment-date";
import { mapExperimentRow } from "@/lib/map-experiment";
import { outcomeBadgeClass, outcomeLabel } from "@/lib/outcome-styles";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function ExperimentDetailPage({
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

  let parentName: string | null = null;
  if (exp.based_on) {
    const { data: parent } = await supabase
      .from("experiments")
      .select("name")
      .eq("id", exp.based_on)
      .maybeSingle();
    parentName = parent?.name ?? null;
  }

  return (
    <div className="min-h-dvh bg-white pb-12">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              {exp.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {formatExperimentDateTime(exp.date)}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`w-fit border ${outcomeBadgeClass(exp.outcome)}`}
          >
            {outcomeLabel(exp.outcome)}
          </Badge>
        </div>

        {exp.based_on ? (
          <p className="mb-6 text-sm text-neutral-700">
            Based on:{" "}
            <Link
              href={`/experiments/${exp.based_on}`}
              className="font-medium text-[#6366f1] underline-offset-2 hover:underline"
            >
              {parentName ?? "Previous experiment"}
            </Link>
          </p>
        ) : null}

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-neutral-500">Concentration</dt>
            <dd className="mt-1 text-neutral-900">
              {formatConcentration(exp.concentration)}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <dt className="font-medium text-neutral-500">Time (h)</dt>
              <dd className="mt-1 text-neutral-900">{exp.time_hours ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500">pH</dt>
              <dd className="mt-1 text-neutral-900">{exp.ph ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500">Temp (°C)</dt>
              <dd className="mt-1 text-neutral-900">
                {exp.temperature_celsius ?? "—"}
              </dd>
            </div>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Result</dt>
            <dd className="mt-1 whitespace-pre-wrap text-neutral-900">
              {exp.result?.trim() || "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Notes</dt>
            <dd className="mt-1 whitespace-pre-wrap text-neutral-900">
              {exp.notes?.trim() || "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/experiments/${exp.id}/edit`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "inline-flex min-h-12 w-full justify-center px-6 text-base sm:w-auto"
            )}
          >
            Edit
          </Link>
          <Link
            href={`/experiments/new?from=${exp.id}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex min-h-12 w-full justify-center px-6 text-base sm:w-auto"
            )}
          >
            Run variation
          </Link>
        </div>
      </main>
    </div>
  );
}
