import { supabase } from "../SupabaseClient";

const loginUser = async (email: string, password: string) => {
    try{
        const {error} = await supabase.auth.signInWithPassword({ //this is a network request so we need to set 'await'
            email,
            password
        });

        if (error) {
            console.log("Login error:", error.message);
        return {error: error.message };
        }
    } catch (err) {
        console.log("Unexpected Error:", err);
        return { error: "Something went wrong" };
    }
};

export default loginUser;