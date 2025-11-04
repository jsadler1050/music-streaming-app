"use client"
import loginUser from "@/lib/auth/loginUser";
import { supabase } from "@/lib/SupabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [checkingSession, setCheckingSession] = useState(true);
    
    const handleLogin = async (e : React.FormEvent) => {
      e.preventDefault();

      if(!email.trim() || !password.trim()){  //just need to check the email and password
        setMessage("All fields are required!"); //displays message if the user doesn't enter required credentials
        return;
      }

      const result = await loginUser(email, password);

      if (result?.error){
        setMessage(result?.error);
      } else {
        setMessage("Login Successful");
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
              setCheckingSession(false);
          })
      }, [router]);
*/
  
  return (
    <div className="h-screen flex justify-center items-center w-full bg:hover">
        <div className="bg-background flex flex-col items-center px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]">
            <Image src="/images/logo.png" alt="logo" width={500} height={500} className="h-11 w-11"/>
            <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">Log in to Spotify</h2>
            <form onSubmit={handleLogin}>
                {message && (<p className="bg-primary rounded-full font-semibold text-center mb-4 py-1">{message}</p>)}

                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email" className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/>
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" placeholder="Password" className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/>


            <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">Continue</button>
            <div className="text-secondary-text text-center my-6">
                <span>Don&apos;t have an account?</span>
                <Link href="signup" className="ml-2 text-white underline hover:text-primary">
                Sign up now!
                </Link>
            </div>
            </form>
        </div>
    </div>
  )
}
