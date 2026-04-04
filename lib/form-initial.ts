import type { Experiment, ExperimentOutcome } from "@/lib/types";

export type ExperimentFormInitial = {
  name: string;
  concentration: Record<string, string>;
  time_hours: string;
  ph: string;
  temperature_celsius: string;
  result: string;
  notes: string;
  outcome: ExperimentOutcome;
  based_on: string | null;
};

export function experimentToFormInitial(exp: Experiment): ExperimentFormInitial {
  return {
    name: exp.name,
    concentration: exp.concentration,
    time_hours: exp.time_hours != null ? String(exp.time_hours) : "",
    ph: exp.ph != null ? String(exp.ph) : "",
    temperature_celsius:
      exp.temperature_celsius != null ? String(exp.temperature_celsius) : "",
    result: exp.result ?? "",
    notes: exp.notes ?? "",
    outcome: exp.outcome,
    based_on: exp.based_on,
  };
}

export const emptyFormInitial: ExperimentFormInitial = {
  name: "",
  concentration: {},
  time_hours: "",
  ph: "",
  temperature_celsius: "",
  result: "",
  notes: "",
  outcome: "inconclusive",
  based_on: null,
};
