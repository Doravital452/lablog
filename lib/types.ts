export type ExperimentOutcome =
  | "success"
  | "partial"
  | "inconclusive"
  | "failed";

export type Experiment = {
  id: string;
  user_id: string;
  name: string;
  date: string;
  concentration: Record<string, string>;
  time_hours: number | null;
  ph: number | null;
  temperature_celsius: number | null;
  result: string | null;
  outcome: ExperimentOutcome;
  notes: string | null;
  based_on: string | null;
  created_at: string;
};
