"use client"
import { PlayerContext } from "@/layouts/FrontendLayout"
import { supabase } from "@/lib/SupabaseClient"
import { Song } from "@/types/song"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useContext } from "react"
import { IoMdPlay } from "react-icons/io"


export default function Allsongs() {

     const context = useContext(PlayerContext);
    
        if(!context){
            throw new Error("PlayerContext must be used within a PlayerProvider");
        }
    
    const {setQueue, setCurrentIndex} = context;

    const getAllSongs = async () => {
        const {data, error} = await supabase.from("songs").select("*");

        if (error){
            console.log("fetchAllSongsError:", error.message);
        }

        return data;
    }

    const {data : songs, isLoading, error, isError} = useQuery({
        queryFn:getAllSongs,
        queryKey:["allSongs"]
    });

    const startPlayingSong = (songs: Song[], index:number) => {
        setCurrentIndex(index);
        setQueue(songs);
    }
    if(isLoading) 
        return (
        <div className="min-h-[90vh] bg-background my-15 p-4 ml-80 rounded-lg mx-4">
            <h2 className="text-2xl text-white mb-3 font-semibold">New Songs</h2>
            <h2 className="text-center text-white-2xl">Loading</h2>
        </div>
        );

        if (isError){
            return (        
            <div className="min-h-[90vh] bg-background my-15 p-4 ml-80 rounded-lg mx-4">
            <h2 className="text-2xl text-white mb-3 font-semibold">New Songs</h2>
            <h2 className="text-center text-white-2xl">{error.message}</h2>
            </div>)
        }
    

    return (
        <div className="min-h-[90vh] bg-background my-15 p-4 ml-80 rounded-lg mx-4">
            <h2 className="text-2xl text-white mb-3 font-semibold">New Songs</h2>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {songs?.map((song : Song, index) => {
                    return (
                    <div key={song.id}className="bg-background p-3 cursor-pointer rounded-md hover:bg-hover relative group" onClick={() => startPlayingSong(songs, index)}>
                    
                        <button className="bg-primary w-12 h-12 rounded-full grid place-items-center absolute bottom-8 opacity-0 right-5 group-hover:opacity-100 group-hover:bottom-18 transition-all duration-300 ease-in-out cursor-pointer">
                            <IoMdPlay/>
                        </button>

                        <Image src={song.cover_image_url} alt="cover-image" width={500} height={500} className="w-full h-50 object-cover" /> 
                        <div>
                            <p className="text-primary-text font-semibold">{song.title}</p>
                            <p className="text-secondary-text text-sm">{song.artist}</p>
                        </div>
                    </div>

                    )
                })}
           
 

 
            </div>
        </div>
    )
}