-- Add start_date and end_date columns to subscriptions
ALTER TABLE public.subscriptions
ADD COLUMN start_date date NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN end_date date DEFAULT NULL;

-- Backfill start_date from created_at for existing rows
UPDATE public.subscriptions SET start_date = created_at::date WHERE start_date = CURRENT_DATE;