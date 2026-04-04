import Link from "next/link";
import { Plus } from "lucide-react";

export function FloatingNewButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
      <Link
        href="/experiments/new"
        aria-label="Log new experiment"
        className="inline-flex size-14 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-lg transition-colors hover:bg-[#6366f1]/90"
      >
        <Plus className="size-7" strokeWidth={2} />
      </Link>
    </div>
  );
}
