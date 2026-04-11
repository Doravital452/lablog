"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ExperimentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [experiment, setExperiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("experiments")
        .select("*")
        .eq("id", id)
        .single();
      setExperiment(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this experiment?")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("experiments").delete().eq("id", id);
    router.push("/dashboard");
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!experiment) return <div className="p-8">Experiment not found.</div>;

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{experiment.name}</h1>
        <Badge>{experiment.outcome}</Badge>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>Date:</strong> {new Date(experiment.created_at).toLocaleString("en-GB")}</p>
        <p><strong>Time:</strong> {experiment.time_hours} hours</p>
        <p><strong>pH:</strong> {experiment.ph}</p>
        <p><strong>Temperature:</strong> {experiment.temperature_celsius}°C</p>
        <p><strong>Result:</strong> {experiment.result}</p>
        {experiment.notes && <p><strong>Notes:</strong> {experiment.notes}</p>}
        {experiment.concentration && (
          <div>
            <strong>Concentration:</strong>
            <ul className="ml-4 list-disc">
              {Object.entries(experiment.concentration).map(([k, v]) => (
                <li key={k}>{k}: {v as string}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Link href={`/experiments/${id}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>
        <Link href={`/experiments/new?from=${id}`}>
          <Button variant="outline">Run Variation</Button>
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
        ← Back to dashboard
      </Link>
    </main>
  );
}