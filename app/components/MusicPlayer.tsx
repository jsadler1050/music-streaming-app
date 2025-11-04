"use client"
import { PlayerContext } from "@/layouts/FrontendLayout";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdPause, IoMdPlay, IoMdSkipBackward, IoMdSkipForward, IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { MdOutlineQueueMusic } from "react-icons/md";

export default function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [previousVolume, setPreviousVolume] = useState(0);
    const [repeatSong, setRepeatSong] = useState(false);

    const context = useContext(PlayerContext);

    if(!context){
        throw new Error("player context must be within a provider");
    }

    const {isQueueModalOpen, setQueueModalOpen, currentMusic, playNext, playPrev} = context;


    const togglePlayButton = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying)
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return; // if music is not playing (audio is false), return null

        const updateTime = () => {
            setCurrentTime(audio.currentTime); //updating the song every second
            setDuration(audio.duration || 0); // set total duration once loaded
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateTime);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateTime);
        }

    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume])

    const formatTime = (time: number) => {

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");

        return `${minutes}:${seconds}`;
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);

        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseInt(e.target.value);
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol / 100;
        }
    };

    const toggleMute = () => {
        if (volume === 0) {
            //Unmute the music
            setVolume(previousVolume);
            if (audioRef.current) {
                audioRef.current.volume = previousVolume / 100;
            }
        } else {
            //mute music
            setPreviousVolume(volume);
            setVolume(0);
            if (audioRef.current) {
                audioRef.current.volume = 0;
            }
        }
    }

    useEffect(() => {
        const audio = audioRef.current;

        if(!audio || !currentMusic) return;

        const playAudio = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                console.log("Audioplay Error:", error);
                setIsPlaying(false);
            }
        };

        playAudio();
    },[currentMusic]);

    //this will listen for when a song ends
    useEffect(() => {
        const audio = audioRef.current;
        if(!audio) return;

        const handleEnded = () => {
            if(repeatSong){
                audio.currentTime = 0;
                audio.play();
            } else {
                playNext();
            }
        }

        audio.addEventListener("ended", handleEnded);
        return () => {
            audio.removeEventListener("ended", handleEnded);
        }
    },[repeatSong, playNext]);

    if(!currentMusic) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black text-white px-4 py-3 shadow-md z-50">
            <audio src={currentMusic.audio_url || ""} controls ref={audioRef}></audio> {/* Temporary audio file - Must integrate Spotify API*/}
            <div className="max-w-8xl w-[95%] mx-auto flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <Image src={currentMusic.cover_image_url || ""} alt="cover-image" width={500} height={500} className="w-13 h-13 object-cover rounded-md" />
                    <div className="text-sm">
                        <p className="text-white">{currentMusic.title}</p>
                        <p className="text-secondary-text font-normal">{currentMusic.artist}</p>
                    </div>
                </div>

                {/*Song controls */}
                <div className="max-w-[400px] w-full flex items-center flex-co gap-3">
                    <div className="flex gap-4">
                        <button className="text-xl text-secondary-text" onClick={playPrev}> 
                            <IoMdSkipBackward /> {/* Backwards button*/}
                        </button>
                        <button onClick={togglePlayButton} className="bg-white text-xl text-black w-10 h-10 rounded-full grid place-items-center">
                            {isPlaying ? <IoMdPause /> : <IoMdPlay />}
                        </button>

                        <button className="text-xl text-secondary-text" onClick={playNext}>
                            <IoMdSkipForward />
                        </button>
                    </div>
                    <div className="w-full flex justify-center items-center gap-2">
                        <span className="text-secondary-text font-normal text-sm">
                            {formatTime(currentTime)}
                        </span>
                        <div className="w-full">
                            <input onChange={handleSeek} type="range" min="0" max={duration} value={currentTime} className="w-full outline-none h-1 bg-zinc-700 rounded-md appearance-none accent-white" />
                        </div>
                        <span className="text-secondary-text font-normal text-sm">
                            {formatTime(duration)}
                        </span>
                    </div>

                    <div>
                        {/*Volume controls*/}
                        <div className="flex items-center gap-2">
                            {repeatSong ?  <button onClick={() => setRepeatSong(false)} className="text-primary" >
                                <LuRepeat1 />
                            </button> : <button onClick = {() => setRepeatSong(true)}>
                                <LuRepeat />
                            </button>}
 
                            <button onClick={() => setQueueModalOpen(!isQueueModalOpen)} className="text-secondary-text text-xl cursor-pointer">
                                <MdOutlineQueueMusic />
                            </button>
                            {volume === 0 ? <button onClick={toggleMute} >
                                <IoMdVolumeOff />
                            </button> : <button onClick={toggleMute} className="text-secondary-text text-xl cursor-pointer">
                                <IoMdVolumeHigh />
                            </button>}
                            <input onChange={handleVolumeChange} value={volume} type="range" min="0" max="100" className="w-[100px] outline-none h-1 bg-zinc-700 accent-white appearance-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}