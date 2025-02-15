import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = "https://unvmrsjaaibioefbderi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudm1yc2phYWliaW9lZmJkZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MTQ1NTYsImV4cCI6MjA1NTE5MDU1Nn0.rRMxS3SvkwZEkTrsLgIGZLkGeLY3JVEh4hLXCmdPFO8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
