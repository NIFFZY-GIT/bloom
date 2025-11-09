-- Link custom package entries to users when available.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'custom_packages'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.custom_packages
      ADD COLUMN user_id INTEGER;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.custom_packages'::regclass
      AND conname = 'custom_packages_user_id_fkey'
  ) THEN
    ALTER TABLE public.custom_packages
      ADD CONSTRAINT custom_packages_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_custom_packages_user_id
  ON public.custom_packages (user_id);
