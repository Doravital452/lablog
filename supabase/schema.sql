-- Run this SQL in the Supabase SQL Editor (Dashboard → SQL → New query).

-- Outcome enum
DO $$ BEGIN
  CREATE TYPE experiment_outcome AS ENUM ('success', 'partial', 'inconclusive', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Experiments table
CREATE TABLE IF NOT EXISTS public.experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  concentration jsonb NOT NULL DEFAULT '{}'::jsonb,
  time_hours numeric,
  ph numeric,
  temperature_celsius numeric,
  result text,
  outcome experiment_outcome NOT NULL DEFAULT 'inconclusive',
  notes text,
  based_on uuid REFERENCES public.experiments (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS experiments_user_date_idx
  ON public.experiments (user_id, date DESC);

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

-- Validates based_on: NULL, or an experiment owned by the current user.
-- SECURITY DEFINER avoids RLS on the same table blocking the EXISTS subquery
-- inside INSERT/UPDATE WITH CHECK (self-referential policy issue).
CREATE OR REPLACE FUNCTION public.experiment_based_on_allowed(p_based_on uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p_based_on IS NULL
    OR EXISTS (
      SELECT 1 FROM public.experiments
      WHERE id = p_based_on AND user_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.experiment_based_on_allowed(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.experiment_based_on_allowed(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.experiment_based_on_allowed(uuid) TO service_role;

DROP POLICY IF EXISTS "experiments_select_own" ON public.experiments;
CREATE POLICY "experiments_select_own"
  ON public.experiments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "experiments_insert_own" ON public.experiments;
CREATE POLICY "experiments_insert_own"
  ON public.experiments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.experiment_based_on_allowed(based_on)
  );

DROP POLICY IF EXISTS "experiments_update_own" ON public.experiments;
CREATE POLICY "experiments_update_own"
  ON public.experiments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND public.experiment_based_on_allowed(based_on)
  );

DROP POLICY IF EXISTS "experiments_delete_own" ON public.experiments;
CREATE POLICY "experiments_delete_own"
  ON public.experiments FOR DELETE
  USING (auth.uid() = user_id);
