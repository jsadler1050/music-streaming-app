"use client"
import MusicPlayer from "@/app/components/MusicPlayer";
import Navbar from "@/app/components/Navbar";
import Queue from "@/app/components/Queue";
import Sidebar from "@/app/components/Sidebar";
import { Song } from "@/types/song";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createContext } from "react";

type PlayerContextType = {
    isQueueModalOpen:boolean;
    setQueueModalOpen:React.Dispatch<React.SetStateAction<boolean>>;
    currentMusic : Song | null; //can be Song or null
    setCurrentMusic: React.Dispatch<React.SetStateAction<Song | null>>;
    queue:Song[];
    setQueue:(songs : Song[]) => void;
    playNext:() => void;
    playPrev:() => void;
    setCurrentIndex:React.Dispatch<React.SetStateAction<number>>;
    currentIndex: number;
}
export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export default function FrontendLayout({children} : Readonly<{children: React.ReactNode}>) {
    const queryClient = new QueryClient();
    const [isQueueModalOpen,setQueueModalOpen] = useState(false);
    const [currentMusic, setCurrentMusic] = useState<null | Song>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [queue, setQueue] = useState<Song[]>([]);
    const [queueModal, setQueueModal] = useState(false);

    const playNext = () => {
        if(currentIndex < queue.length - 1){
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    }

    const playPrev = () => {
        if(currentIndex > 0){
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    }

    useEffect(() => {
        if(queue.length > 0 && currentIndex >= 0 && currentIndex < queue.length){
            setCurrentMusic(queue[currentIndex])
        }
    },[currentIndex, queue]); //don't use currentMusic


    return (
        <div className="min-h-screen">
            <QueryClientProvider client={queryClient}>
                <PlayerContext.Provider value={{isQueueModalOpen, setQueueModalOpen, currentMusic, setCurrentMusic, queue, setQueue, playNext, playPrev, setCurrentIndex, currentIndex}}>
                <div className="min-h-screen">
                    <Navbar/>
                    <main>
                        <Sidebar/>
                        <Queue/>
                        {currentMusic && <MusicPlayer/>}
                        {children}
                    </main>
                    </div>
                </PlayerContext.Provider>

            </QueryClientProvider>
        </div>
    );
}