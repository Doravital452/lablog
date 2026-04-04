import type { ExperimentOutcome } from "@/lib/types";

export function outcomeBadgeClass(outcome: ExperimentOutcome): string {
  switch (outcome) {
    case "success":
      return "bg-emerald-100 text-emerald-900 border-emerald-200";
    case "partial":
      return "bg-amber-100 text-amber-900 border-amber-200";
    case "inconclusive":
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
    case "failed":
      return "bg-red-100 text-red-900 border-red-200";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
}

export function outcomeLabel(outcome: ExperimentOutcome): string {
  return outcome.charAt(0).toUpperCase() + outcome.slice(1);
}
