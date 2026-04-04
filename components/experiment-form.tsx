"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ExperimentFormInitial } from "@/lib/form-initial";
import type { ExperimentOutcome } from "@/lib/types";
import { concentrationFromRecord } from "@/lib/concentration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Row = { id: string; key: string; value: string };

function newRow(): Row {
  return { id: crypto.randomUUID(), key: "", value: "" };
}

function rowsFromConcentration(c: Record<string, string>): Row[] {
  const entries = Object.entries(c);
  if (entries.length === 0) return [newRow()];
  return entries.map(([key, value]) => ({
    id: crypto.randomUUID(),
    key,
    value,
  }));
}

function buildConcentrationObject(rows: Row[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of rows) {
    const k = r.key.trim();
    if (k === "") continue;
    out[k] = r.value.trim();
  }
  return out;
}

function parseDecimal(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

type ExperimentFormProps = {
  mode: "create" | "edit";
  experimentId?: string;
  initial: ExperimentFormInitial;
  pastExperiments: { id: string; name: string }[];
};

export function ExperimentForm({
  mode,
  experimentId,
  initial,
  pastExperiments,
}: ExperimentFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [rows, setRows] = useState<Row[]>(() =>
    rowsFromConcentration(concentrationFromRecord(initial.concentration))
  );
  const [timeHours, setTimeHours] = useState(initial.time_hours);
  const [ph, setPh] = useState(initial.ph);
  const [temp, setTemp] = useState(initial.temperature_celsius);
  const [result, setResult] = useState(initial.result);
  const [notes, setNotes] = useState(initial.notes);
  const [outcome, setOutcome] = useState<ExperimentOutcome>(initial.outcome);
  const [basedOn, setBasedOn] = useState<string>(initial.based_on ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const basedOnOptions = useMemo(() => {
    const opts = pastExperiments.filter(
      (p) => mode === "create" || p.id !== experimentId
    );
    return opts;
  }, [pastExperiments, mode, experimentId]);

  function addRow() {
    setRows((r) => [...r, newRow()]);
  }

  function removeRow(id: string) {
    setRows((r) => (r.length <= 1 ? r : r.filter((x) => x.id !== id)));
  }

  function updateRow(id: string, field: "key" | "value", value: string) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Experiment name is required.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("You must be signed in.");
      return;
    }

    const concentration = buildConcentrationObject(rows);
    const payload = {
      name: trimmedName,
      concentration,
      time_hours: parseDecimal(timeHours),
      ph: parseDecimal(ph),
      temperature_celsius: parseDecimal(temp),
      result: result.trim() || null,
      outcome,
      notes: notes.trim() || null,
      based_on: basedOn === "" ? null : basedOn,
    };

    if (mode === "create") {
      const { error: insertError } = await supabase.from("experiments").insert({
        ...payload,
        user_id: user.id,
      });
      setLoading(false);
      if (insertError) {
        setError(insertError.message);
        return;
      }
    } else if (experimentId) {
      const { error: updateError } = await supabase
        .from("experiments")
        .update(payload)
        .eq("id", experimentId);
      setLoading(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6 pb-24">
      <div className="space-y-2">
        <Label htmlFor="name">Experiment name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="min-h-12 text-base"
          placeholder="e.g. Batch A — silica gel"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-base">Concentration</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9"
            onClick={addRow}
          >
            Add row
          </Button>
        </div>
        <p className="text-xs text-neutral-500">
          Particle or reagent name and concentration (e.g. M, wt%).
        </p>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1 space-y-1">
                <Label className="sr-only">Reagent</Label>
                <Input
                  value={row.key}
                  onChange={(e) => updateRow(row.id, "key", e.target.value)}
                  className="min-h-12 text-base"
                  placeholder="Reagent"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <Label className="sr-only">Concentration</Label>
                <Input
                  value={row.value}
                  onChange={(e) => updateRow(row.id, "value", e.target.value)}
                  className="min-h-12 text-base"
                  placeholder="Concentration"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-12 shrink-0 text-neutral-500"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 1}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="time_hours">Time (hours)</Label>
          <Input
            id="time_hours"
            inputMode="decimal"
            value={timeHours}
            onChange={(e) => setTimeHours(e.target.value)}
            className="min-h-12 text-base"
            placeholder="—"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ph">pH</Label>
          <Input
            id="ph"
            inputMode="decimal"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
            className="min-h-12 text-base"
            placeholder="—"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="temp">Temp (°C)</Label>
          <Input
            id="temp"
            inputMode="decimal"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="min-h-12 text-base"
            placeholder="—"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="outcome">Outcome</Label>
        <select
          id="outcome"
          value={outcome}
          onChange={(e) =>
            setOutcome(e.target.value as ExperimentOutcome)
          }
          className="flex min-h-12 w-full rounded-lg border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="success">Success</option>
          <option value="partial">Partial</option>
          <option value="inconclusive">Inconclusive</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="result">Result</Label>
        <Textarea
          id="result"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="min-h-[100px] resize-y text-base"
          placeholder="What happened?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[88px] resize-y text-base"
          placeholder="Optional details"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="based_on">Based on previous experiment</Label>
        <select
          id="based_on"
          value={basedOn}
          onChange={(e) => setBasedOn(e.target.value)}
          className="flex min-h-12 w-full rounded-lg border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">None</option>
          {basedOnOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full text-base sm:w-auto sm:min-w-[160px]"
        disabled={loading}
      >
        {loading
          ? mode === "create"
            ? "Saving…"
            : "Updating…"
          : mode === "create"
            ? "Log experiment"
            : "Save changes"}
      </Button>
    </form>
  );
}
