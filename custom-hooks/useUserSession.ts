import { supabase } from "@/lib/SupabaseClient";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";


export default function useUserSession(){
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const {error, data} = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        }

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        fetchSession();

        return () => subscription.unsubscribe();
    },[]);


    return { session, loading };
}


