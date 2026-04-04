import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 sm:px-6">
      <Link
        href="/dashboard"
        className="text-lg font-semibold tracking-tight text-[#6366f1]"
      >
        LabLog
      </Link>
      {user ? (
        <form action={signOut}>
          <Button type="submit" variant="outline" size="default" className="min-h-10">
            Log out
          </Button>
        </form>
      ) : null}
    </header>
  );
}
