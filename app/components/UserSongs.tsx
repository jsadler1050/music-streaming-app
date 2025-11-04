import { supabase } from '@/lib/SupabaseClient';
import { Song } from '@/types/song';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image'
import React, { useContext } from 'react';
import DeleteButton from './DeleteButton';
import { PlayerContext } from '@/layouts/FrontendLayout';

type UserSongsProps = {
    userId: string | undefined;
}

export default function UserSongs({userId} : UserSongsProps) {
    
    const context = useContext(PlayerContext);

    if(!context){
        throw new Error("PlayerContext must be used within a PlayerProvider");
    }

    const {setQueue, setCurrentIndex} = context;
    const getUserSongs = async () => {
        const {error, data} = await supabase
            .from("songs")
            .select("*")
            .eq("user_id_", userId);

            if(error) {
                console.log("fetchUserSongsError:", error.message);
            }

            return data;
    };

        const {data : songs, isLoading, error, isError} = useQuery({
        queryFn: getUserSongs,
        queryKey:["userSongs"]
    });

    const startPlayingSong = (songs : Song[], index : number) => {
        setCurrentIndex(index);
        setQueue(songs);
    }

    if (isLoading) 
        return (
        <div>
            {[...Array(10)].map((i, index) => (
                <div key={index} className="flex gap-2 animate-pulse mb-4">
                <div className="w-10 h-10 rounded-md"></div>
                <div className="h-5 w-[80%] rounded-md bg-hover"></div>
            </div>
            ))}
        </div>

    )

    if(isError) return  <h2 className="text-center text-white-2xl">{error.message}</h2>

    if (songs?.length === 0) {
        return <h1 className="text-center text-white text-sm">You have no songs in your library</h1>
    }
    return (
    <div>
        {songs?.map((song : Song, index) => {
            return (       
            <div key={song.id} onClick={() => startPlayingSong(songs, index)}>
            <DeleteButton songId={song.id} imagePath={song.cover_image_url} audioPath={song.audio_url}/>
            <Image src={song.cover_image_url} alt="cover-image" width={300} height={300}/>
            <div>
                <p>{song.title}</p>
                <p>By {song.artist}</p>
            </div>
        </div>)
        })}
    </div>
  )
}
