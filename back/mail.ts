// back/mail.ts

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!; // service_role for server-side

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);