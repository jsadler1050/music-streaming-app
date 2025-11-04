import useUserSession from "@/custom-hooks/useUserSession";
import LogoutUser from "@/lib/auth/logoutUser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoSearch } from "react-icons/go";
import { MdHomeFilled } from "react-icons/md";

export default function Navbar() {
    const router = useRouter();
    const {session, loading} = useUserSession();
    

    const handleLogout = async () => {
        const result = await LogoutUser();

        if(result?.error){
            router.push("/")
        }
    }

    return(    
        <nav className="h-15 border-b-2 flex justify-between items-center px-6 fixed top-0 left-0 w-full bg-black z-100">
            <div className="flex items-center gap-6">
                <Image src="/images/logo.png" alt="logo-image" width={800} height={800} className="w-9 h-9" />

                <Link href="/" className="bg-background w-11 h-11 grid place-items-center text-white text-3xl rounded-full">
                    <MdHomeFilled />
                </Link>
                    <div className="bg-background hidden lg:flex items-center h-11 w-90 px-3 gap-3 text-primary-text rounded-full">
                        <GoSearch className="text-text-primary shrink-0 size={25}" />
                        <input className="h-full w-full outline-none placeholder:text-text-primary" type="text" placeholder="Search" />
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="lg:flex hidden gap-2 text-secondary-text font-bold border-r-2 border-primary-text pr-6">
                        <a href="#" className="hover:text-primary-text">
                            Premium
                        </a>

                        <a href="#" className="hover:text-primary-text">
                            Support
                        </a>

                        <a href="#" className="hover:text-primary-text">
                            Download
                        </a>


                    </div>
                    <div>
                        {!loading && (      
                            <>
                                {session ? ( <button onClick = {handleLogout} className=" cursor-pointer h-11 bg-white text-gray-950 rounded-full font-bold hover:bg-secondary-text grid px-8 place-items-center">Logout</button>) :  (<Link href="/login" className="h-11 bg-white text-gray-950 rounded-full font-bold hover:bg-secondary-text grid px-8 place-items-center">
                                Login
                            </Link>
                            )}
                            </>                  
                       
                        )}

                    </div>
                </div>
        </nav>
    );
}

