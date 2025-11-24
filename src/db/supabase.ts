
        import { createClient } from "@supabase/supabase-js";

        const supabaseUrl = "https://lrqkiwoguodxshwnwkvt.supabase.co";
        const supabaseAnonKey = "sb_publishable_2fIFVmu-KC-J-6ZKupQzVw_77CPm8U2";

        export const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
