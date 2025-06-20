// supabase-config.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hsjhreljjxfsutdwpjeh.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzamhyZWxqanhmc3V0ZHdwamVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTQ1NzEsImV4cCI6MjA2NTAzMDU3MX0.CDIbrFMs_kIigQuQzVUOUxpnQxfEw5S44iRT4LiHTuA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
