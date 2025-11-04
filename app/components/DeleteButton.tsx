import { supabase } from '@/lib/SupabaseClient'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
//includes all the logic needed to delete a song
// Requirements needed for deleting: song id, image path, and audio path

type DeleteButtonProp = {
    songId: number,
    imagePath : string,
    audioPath : string
}
export default function DeleteButton({songId, imagePath, audioPath} : DeleteButtonProp) {
    const queryClient = useQueryClient();

    const deleteSong = async () => {
        //delete the image
        const {error : imgError} = await supabase.storage.from("cover-images").remove([imagePath]);

        if(imgError){
            console.log("ImageDeleteError:", imgError.message);
            return;
        }

        //delete the audio
        const {error : audioError} = await supabase.storage.from("songs").remove([audioPath]);

        if(audioError){
            console.log("AudioDeleteError:", audioError.message);
            return;
        }

        //delete the song from the songs table
        const {error : deleteError} = await supabase.from("songs").delete().eq("id", songId);

        if(deleteError){
            console.log("TableDeleteError:", deleteError.message);  
            return;    
        }

        queryClient.invalidateQueries({queryKey:["allSongs"]})
        queryClient.invalidateQueries({queryKey:["userSongs"]})


    }
  return (
    <button onClick={deleteSong} className="text-secondary-text absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hidden group-hover:block z-100">
        <FaTrash />
    </button>
  );
}
