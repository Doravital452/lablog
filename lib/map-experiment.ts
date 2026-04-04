import { concentrationFromRecord } from "@/lib/concentration";
import type { Experiment, ExperimentOutcome } from "@/lib/types";

/** Maps a Supabase row to our Experiment type. */
export function mapExperimentRow(row: {
  id: string;
  user_id: string;
  name: string;
  date: string;
  concentration: unknown;
  time_hours: number | null;
  ph: number | null;
  temperature_celsius: number | null;
  result: string | null;
  outcome: string;
  notes: string | null;
  based_on: string | null;
  created_at: string;
}): Experiment {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    date: row.date,
    concentration: concentrationFromRecord(row.concentration),
    time_hours: row.time_hours,
    ph: row.ph,
    temperature_celsius: row.temperature_celsius,
    result: row.result,
    outcome: row.outcome as ExperimentOutcome,
    notes: row.notes,
    based_on: row.based_on,
    created_at: row.created_at,
  };
}
