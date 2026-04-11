/**
 * True when public Supabase URL and anon key are set to real values (not placeholders).
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return false;
  if (
    url === "your_supabase_project_url" ||
    key === "your_supabase_anon_key"
  ) {
    return false;
  }
  return true;
}

export function assertSupabaseEnv(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your project API settings: https://supabase.com/dashboard/project/_/settings/api"
    );
  }
}
