"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { useEffect, useState } from "react";

export function AppHeader() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  if (loading) {
    return (
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 sm:px-6">
        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight text-[#6366f1]"
        >
          LabLog
        </Link>
        <div className="min-h-10 w-20" />
      </header>
    );
  }

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
