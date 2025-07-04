import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'SUPABASE_URL';
const supabaseAnonKey = 'SUPABASE_SERVICE_ROLE_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
