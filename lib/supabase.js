import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Inicializa o supabase sem reclamar muito localmente se as envs não estiverem presentes (para podermos codar os componentes felizes)
export const supabase = createClient(
  supabaseUrl || 'https://fake-project.supabase.co',
  supabaseAnonKey || 'fake-anon-key'
);
