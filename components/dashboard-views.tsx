"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Experiment } from "@/lib/types";
import { formatConcentration } from "@/lib/concentration";
import { formatExperimentDateTime } from "@/lib/format-experiment-date";
import { outcomeBadgeClass, outcomeLabel } from "@/lib/outcome-styles";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SortKey =
  | "name"
  | "date"
  | "concentration"
  | "time_hours"
  | "ph"
  | "temperature_celsius"
  | "outcome"
  | "result";

type SortDir = "asc" | "desc";

function sortValue(
  exp: Experiment,
  key: SortKey
): string | number | null {
  switch (key) {
    case "name":
      return exp.name.toLowerCase();
    case "date":
      return new Date(exp.date).getTime();
    case "concentration":
      return formatConcentration(exp.concentration).toLowerCase();
    case "time_hours":
      return exp.time_hours ?? Number.NEGATIVE_INFINITY;
    case "ph":
      return exp.ph ?? Number.NEGATIVE_INFINITY;
    case "temperature_celsius":
      return exp.temperature_celsius ?? Number.NEGATIVE_INFINITY;
    case "outcome":
      return exp.outcome;
    case "result":
      return (exp.result ?? "").toLowerCase();
    default:
      return "";
  }
}

function CompareTable({ experiments }: { experiments: Experiment[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...experiments];
    copy.sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      let cmp = 0;
      if (typeof va === "number" && typeof vb === "number") {
        cmp = va - vb;
      } else {
        cmp = String(va).localeCompare(String(vb), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [experiments, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

  const headers: { key: SortKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "date", label: "Date" },
    { key: "concentration", label: "Concentration" },
    { key: "time_hours", label: "Time (h)" },
    { key: "ph", label: "pH" },
    { key: "temperature_celsius", label: "Temp (°C)" },
    { key: "outcome", label: "Outcome" },
    { key: "result", label: "Result" },
  ];

  return (
    <div className="w-full min-w-0 max-h-[min(70vh,720px)] overflow-auto rounded-xl border border-neutral-200">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
          <TableRow className="hover:bg-transparent">
            {headers.map((h) => (
              <TableHead key={h.key} className="whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => toggleSort(h.key)}
                  className="inline-flex items-center gap-1 font-semibold text-neutral-800 hover:text-[#6366f1]"
                >
                  {h.label}
                  {sortKey === h.key ? (
                    <span className="text-xs text-neutral-400" aria-hidden>
                      {sortDir === "asc" ? "↑" : "↓"}
                    </span>
                  ) : null}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((exp) => (
            <TableRow key={exp.id} className="hover:bg-neutral-50">
              <TableCell className="max-w-[140px] font-medium">
                <Link
                  href={`/experiments/${exp.id}`}
                  className="text-[#6366f1] underline-offset-2 hover:underline"
                >
                  {exp.name}
                </Link>
              </TableCell>
              <TableCell className="whitespace-nowrap text-neutral-700">
                {formatExperimentDateTime(exp.date)}
              </TableCell>
              <TableCell className="max-w-[220px] text-neutral-700">
                <span className="line-clamp-2">
                  {formatConcentration(exp.concentration)}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {exp.time_hours ?? "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">{exp.ph ?? "—"}</TableCell>
              <TableCell className="whitespace-nowrap">
                {exp.temperature_celsius ?? "—"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`border ${outcomeBadgeClass(exp.outcome)}`}
                >
                  {outcomeLabel(exp.outcome)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[min(40vw,280px)] text-neutral-700">
                <span className="line-clamp-3">{exp.result?.trim() || "—"}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TimelineView({ experiments }: { experiments: Experiment[] }) {
  if (experiments.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center text-neutral-600">
        No experiments yet. Tap + to log your first run.
      </p>
    );
  }

  return (
    <ul
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
      role="list"
    >
      {experiments.map((exp) => (
        <li key={exp.id} className="min-w-0">
          <Link href={`/experiments/${exp.id}`} className="block h-full">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="gap-2 pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold leading-snug">
                    {exp.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`shrink-0 border ${outcomeBadgeClass(exp.outcome)}`}
                  >
                    {outcomeLabel(exp.outcome)}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500">
                  {formatExperimentDateTime(exp.date)}
                </p>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-sm text-neutral-700">
                <p>
                  <span className="text-neutral-500">Conc.: </span>
                  {formatConcentration(exp.concentration)}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600">
                  {exp.time_hours != null ? (
                    <span>Time: {exp.time_hours} h</span>
                  ) : null}
                  {exp.ph != null ? <span>pH: {exp.ph}</span> : null}
                  {exp.temperature_celsius != null ? (
                    <span>Temp: {exp.temperature_celsius} °C</span>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function DashboardViews({ experiments }: { experiments: Experiment[] }) {
  return (
    <Tabs
      defaultValue="compare"
      className="flex w-full min-w-0 flex-col gap-4"
    >
      <TabsList
        variant="line"
        className="flex h-auto w-full min-w-0 shrink-0 justify-start gap-0 rounded-none border-b border-neutral-200 bg-transparent p-0"
      >
        <TabsTrigger
          value="timeline"
          className="flex-none rounded-none px-4 py-3 text-base data-active:after:bottom-0"
        >
          Timeline
        </TabsTrigger>
        <TabsTrigger
          value="compare"
          className="flex-none rounded-none px-4 py-3 text-base data-active:after:bottom-0"
        >
          Compare Table
        </TabsTrigger>
      </TabsList>
      <TabsContent value="timeline" className="mt-0 w-full min-w-0 flex-1">
        <TimelineView experiments={experiments} />
      </TabsContent>
      <TabsContent value="compare" className="mt-0 w-full min-w-0 flex-1">
        {experiments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center text-neutral-600">
            No experiments yet. Tap + to log your first run.
          </p>
        ) : (
          <CompareTable experiments={experiments} />
        )}
      </TabsContent>
    </Tabs>
  );
}
