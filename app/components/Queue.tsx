"use client"
import { PlayerContext } from "@/layouts/FrontendLayout"
import { Song } from "@/types/song";
import Image from "next/image"
import React, { useContext } from "react"

export default function Queue() {
    const context = useContext(PlayerContext);

    if(!context){
        throw new Error("player context must be within a provider");
    }

    const {isQueueModalOpen, currentMusic, currentIndex, queue, setCurrentIndex, setQueue} = context;

    const startPlayingSong = (songs : Song[], index : number) => {
        setCurrentIndex(index);
        setQueue(songs);
    }

    if(!isQueueModalOpen) return null;
    return (
        <div className='fixed top-18 right-15 z-50 max-w-[300px] w-full h-[75vh] bg-black border p-4 overflow-y-auto rounded-md'>
            <h2>Queue</h2>
            <div className="mt-8">
                <h2 className='text-white font-bold mb-3'>Now Playing</h2>
                <div className='flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-hover'>
                    {currentMusic && <Image src={currentMusic?.cover_image_url} width={300} height={300} alt='queue-image' className='w-10 h-10 object-cover rounded-md'/>}
                    <div>
                        <p className='text-green font-semibold'>{currentMusic?.title}</p>
                        <p className='text-sm text-secondary-text'>{currentMusic?.artist}</p>
                    </div>
                </div>
                <h2 className="text-white font-bold mb-3">Queue List</h2>
                {queue.map((song : Song, index) => {
                    return (                
                    <div key={song.id} className='mt-8'>
                    <Image src={song.cover_image_url} onClick={() => startPlayingSong(queue, index)} width={300} height={300} alt='queue-image' className='w-10 h-10 object-cover rounded-md'/>
                    <div>
                        <p className={`font-semibold ${currentIndex === index ? "text-primary" : "text-primary-text"}`}>{song.title}</p>
                        <p className='text-sm text-secondary-text'>{song.artist}</p>
                    </div>
   
                </div>)
                })}
            </div>
\        </div>
    )
}