/*
  # Fix quoll_shouts user relationship

  1. Changes
    - Add foreign key constraint from quoll_shouts.user_id to public.users.id
    - This enables Supabase to resolve the join between quoll_shouts and users tables
    - Replaces the existing foreign key that points to auth.users

  2. Security
    - Maintains existing RLS policies
    - Preserves CASCADE delete behavior
*/

-- First, drop the existing foreign key constraint to auth.users
ALTER TABLE public.quoll_shouts 
DROP CONSTRAINT IF EXISTS quoll_shouts_user_id_fkey;

-- Add the new foreign key constraint to public.users
ALTER TABLE public.quoll_shouts 
ADD CONSTRAINT quoll_shouts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;