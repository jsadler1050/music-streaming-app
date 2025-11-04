"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import signUpUser from "@/lib/auth/signUpUser";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/SupabaseClient";

export default function Page() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");


    const handleSignup = async (e : React.FormEvent) => {
        e.preventDefault(); //prevents page from refreshing when the user clicks 'continue' 

        if(!name.trim() || !email.trim() || !password.trim()){  //ensures if theres any blanks in the input
            setMessage("All fields are required!"); //displays message if the user doesn't enter required credentials
            return;
        }

        const result = await signUpUser(name, email, password); //the 3 arguments - name, email, and password - are required
        if(result?.error){
            setMessage(result.error);
        } else {
            setMessage("Signup successful");
            setTimeout(() => {
                router.push("/");
            }, 3000);
        }
    };
/* ERROR HERE
    useEffect(() => {
          supabase.auth.getSession().then(({data}) => {
              if(!data.session){
                  router.push("/");
              } 
          })
      }, [router]);

*/
    return (
            <div className="h-screen flex justify-center items-center w-full bg:hover">
        <div className="bg-background flex flex-col items-center px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]">
            <Image src="/images/logo.png" alt="logo" width={500} height={500} className="h-11 w-11"/>
            <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">Sign Up for Spotify</h2>
            <form onSubmit={handleSignup}>
                {message && (<p className="bg-primary rounded-full font-semibold text-center mb-4">{message}</p>
            )}
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Name" className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/> {/* onChange handler is needed for any new changes*/}
                <input onChange={(e) => setEmail(e.target.value)}  value={email} type="text" placeholder="Email" className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/>
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" placeholder="Password" className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/>
                {/* If onchange handler wasn't included, user wouldn't be able to type their credentials*/}

            <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">Continue</button>
            <div className="text-secondary-text text-center my-6">
                <span>Already have an account?</span>
                <Link href="login" className="ml-2 text-white underline hover:text-primary">
                Login now!
                </Link>
            </div>
        </form>
        </div>
    </div>

    )
}