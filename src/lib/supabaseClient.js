import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwfnzoqyfpvbgoowtuzc.supabase.co';
const supabaseAnonKey = 'sb_publishable_Gu6dYqiy5yBoIKTIDy_-Rw_qtvVWHgx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
