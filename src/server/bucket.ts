import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://supabase.com/dashboard/project/gwaqfroimaqnpryscvoi',
  'gwaqfroimaqnpryscvoi',
)
