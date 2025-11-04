"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/SupabaseClient";
import { useRouter } from "next/navigation";
import useUserSession from "@/custom-hooks/useUserSession";

export default function Page() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const {session} = useUserSession();

    useEffect(() => {
        supabase.auth.getSession().then(({data}) => {
            if(!data.session){
                router.push("/");
            } else {
                setPageLoading(false);
            }
        })
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if(!title.trim() || !artist.trim() || !audioFile || !imageFile){
            setMessage("All fields are required!");
            setLoading(false);
            return;
        }

        try {
            //uploading song into Supabase's table

            const timestamp = Date.now();

            //upload the image
            const imagePath = `/${timestamp}_${imageFile.name}`;
//format of imagePath: 12321709_image.jpeg

            const {error: imgError} = await supabase.storage
            .from("cover-images") //cover-images bucket created in Supabase
            .upload(imagePath,imageFile);

            if(imgError) {
                setMessage(imgError.message);
                setLoading(false);
                return;
            }

            //get public URL
            const {
                data: {publicUrl:imageURL},
            } = supabase.storage.from("cover-images").getPublicUrl(imagePath);

            //upload audio
            const audioPath = `/${timestamp}_${audioFile.name}`;
            const {error: audioError} = await supabase.storage
            .from("songs") //songs bucket created in Supabase
            .upload(audioPath,audioFile);

            if(audioError) {
                    setMessage(audioError.message);
                    setLoading(false);
                    return;
                }

            const {data:{publicUrl: audioURL}} = supabase.storage.from("songs").getPublicUrl(audioPath)

            //save songs to supabase table
            const {error : insertError} = await supabase.from("songs").insert({
                title,
                artist,
                cover_image_url: imageURL,
                audio_url: audioURL,
                user_id : session?.user.id,

            })


            if(insertError){
                setMessage(insertError.message);
                setLoading(false);
                return;
            }

            setTitle("");
            setArtist("");
            setImageFile(null);
            setAudioFile(null);
            setMessage("Song uploaded successfully");
            setTimeout(() => {
                router.push("/");
            }, 3000);



        } catch (err) {
            console.log("Catched error", err);
        }
    }

    if(pageLoading) return null;

    return (
        <div className="h-screen flex justify-center items-center w-full bg:hover">
            <div className="bg-background flex flex-col items-center px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]">
                <Image src="/images/logo.png" alt="logo" width={500} height={500} className="h-11 w-11"/>
                <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">Upload to Spotify</h2>
                <form onSubmit={handleUpload}>
                    {message && <p className="bg-primary rounded-full font-semibold text-center mb-4">{message}</p>}

                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/>
                    <input value={artist} onChange={(e) => setArtist(e.target.value)} type="text" placeholder="Artist" className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/>

                    <label htmlFor="audio" className="block py-2 text-secondary-text">Audio</label>
                    <input accept="audio/*" onChange={(e) => {
                        const files = e.target.files;
                        if(!files) return;
                        const file = files[0];
                        setAudioFile(file);
                }} id="audio" type="file"  className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/>
    
                    <label htmlFor="cover" className="block py-2 text-secondary-text">Cover Image</label>
                    <input accept="images/*" id="cover" type="file"  onChange={(e) => {
                        const files = e.target.files;
                        if(!files) return;
                        const file = files[0];
                        setImageFile(file);
                    }} className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"/>

                    {loading ? (                    
                        <button className="bg-primary py-3 rounded-full w-full font-bold">Uploading...</button>
                    ) : (                
                    <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">Add Song</button>
                    )}
             </form>


            </div>
        </div>

    )
}