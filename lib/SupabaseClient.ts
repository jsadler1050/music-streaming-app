import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!; //retrieve from Supabase Website - credentials stored in a .env file
const supabaseAnonkey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; //retrieve from Supbase Website

export const supabase = createClient(supabaseURL, supabaseAnonkey);