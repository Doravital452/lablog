"use client";

import { AppHeader } from "@/components/app-header";
import { DashboardViews } from "@/components/dashboard-views";
import { FloatingNewButton } from "@/components/floating-new-button";
import { mapExperimentRow } from "@/lib/map-experiment";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { Experiment } from "@/lib/types";

export default function DashboardPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExperiments() {
      try {
        const supabase = createClient();
        const { data: rows, error } = await supabase
          .from("experiments")
          .select("*")
          .order("date", { ascending: false });

        if (!error && rows) {
          const mappedExperiments = rows.map((r) =>
            mapExperimentRow(r as Parameters<typeof mapExperimentRow>[0])
          );
          setExperiments(mappedExperiments);
        }
      } catch (error) {
        console.error("Error loading experiments:", error);
      } finally {
        setLoading(false);
      }
    }

    loadExperiments();
  }, []);

  const handleExperimentsChange = (newExperiments: Experiment[]) => {
    setExperiments(newExperiments);
  };

  return (
    <div className="min-h-dvh bg-white pb-28">
      <AppHeader />
      <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-6 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">
          Dashboard
        </h1>
        {loading ? (
          <p className="text-sm text-neutral-600">Loading experiments...</p>
        ) : (
          <DashboardViews 
            experiments={experiments} 
            onExperimentsChange={handleExperimentsChange}
          />
        )}
      </main>
      <FloatingNewButton />
    </div>
  );
}
