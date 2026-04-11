"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ExperimentForm } from "@/components/experiment-form";

export default function EditExperimentPage() {
  const { id } = useParams();
  const [initial, setInitial] = useState<any>(null);
  const [pastExperiments, setPastExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: exp }, { data: past }] = await Promise.all([
        supabase.from("experiments").select("*").eq("id", id).single(),
        supabase.from("experiments").select("id, name, created_at").order("created_at", { ascending: false }),
      ]);
      setInitial(exp);
      setPastExperiments(past ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!initial) return <div className="p-8">Experiment not found.</div>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Experiment</h1>
      <ExperimentForm
        mode="edit"
        experimentId={id as string}
        initial={{
          name: initial.name ?? "",
          concentration: initial.concentration ?? {},
          time_hours: initial.time_hours?.toString() ?? "",
          ph: initial.ph?.toString() ?? "",
          temperature_celsius: initial.temperature_celsius?.toString() ?? "",
          result: initial.result ?? "",
          outcome: initial.outcome ?? "inconclusive",
          notes: initial.notes ?? "",
          based_on: initial.based_on ?? null,
        }}
        pastExperiments={pastExperiments}
      />
    </main>
  );
}