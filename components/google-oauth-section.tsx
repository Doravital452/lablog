"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function GoogleOAuthSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return (
    <div className="space-y-5">
      {error ? (
        <p className="text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="h-auto min-h-12 w-full gap-3 border-neutral-300 bg-white text-base text-neutral-900 hover:bg-neutral-50"
        onClick={handleGoogle}
        disabled={loading}
      >
        <span
          className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-neutral-200 bg-white text-sm font-bold text-neutral-800"
          aria-hidden
        >
          G
        </span>
        {loading ? "Connecting…" : "Continue with Google"}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-neutral-500">or</span>
        </div>
      </div>
    </div>
  );
}
