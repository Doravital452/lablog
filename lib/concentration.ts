export function formatConcentration(concentration: Record<string, string>): string {
  const entries = Object.entries(concentration).filter(
    ([k, v]) => k.trim() !== "" || String(v).trim() !== ""
  );
  if (entries.length === 0) return "—";
  return entries.map(([k, v]) => `${k}: ${v}`).join(", ");
}

export function concentrationFromRecord(
  raw: unknown
): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    out[k] = v === null || v === undefined ? "" : String(v);
  }
  return out;
}
