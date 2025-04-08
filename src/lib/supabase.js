import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgopxktjoxelcmiafcij.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnb3B4a3Rqb3hlbGNtaWFmY2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTQxNjgsImV4cCI6MjA1NjY3MDE2OH0.ciEdSM0zWl6Krp3nOX4E1jbSQgyV7jLm6imlDUu21yk';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});