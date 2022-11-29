// https://github.com/taylorotwell/next-example-frontend/blob/master/src/hooks/auth.js
import { useState } from 'react';
import { AxiosResponse } from 'axios';

import axios from '../libs/axios';
import { NEW_VLIDE, UPDATE_VLIDE, UPLOAD_AUDIO } from '../types/vlide';
// import { useNavigate } from 'react-router-dom';

export const useDraftVlide = () => {
    // let navigate = useNavigate();

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>("");
    const [tagList, setTagList] = useState<string[]>([]);
    const [durationTime, setDurationTime] = useState<number>(0);
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [countClips, setCountClips] = useState<boolean>(false);

    // const [image, setImage] = useState<File | null>(null);

    const [audio, setAudio] = useState<File | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [src, setSrc] = useState<string | null>("");
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const retrieve= (vlideId: string) => {
        axios
            .get(`/api/v1/vlide/${vlideId}`)
            .then((res: AxiosResponse<any, any>) => {
                const data = res.data;
                setTitle(data.title);
                setContent(data.content ? data.content : "");
                setTagList(data.tags.map( 
                    (tag: {id:string, name:string}) => tag["name"])
                );
                setIsPublic(data.is_public);
                setDurationTime(data.duration);
                setIsSaved(data.is_saved);

                setSrc(data.audio_file_name);
                setCountClips(data.count_clips);
            });
    };

    const retrieveForDraft = (vlideId: string) => {
        axios
            .get(`/api/v1/vlide/${vlideId}/draft`)
            .then((res: AxiosResponse<any, any>) => {
                const data = res.data;
                setTitle(data.title)
                setContent(data.content ? data.content : "");
                setTagList(data.tags.map( 
                    (tag: {id:string, name:string}) => tag["name"])
                );
                setIsPublic(data.is_public);
                setDurationTime(data.duration);
                setIsSaved(data.is_saved)
                // const fileName = data.audio_file_name;
                // const fileName = "/storage/audios/" + data.audio_file_name;
                // const fileName = "/api/v1/audio?f=" + data.audio_file_name;

                setSrc(data.audio_file_name);
                // setSrc('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')

            });
    };

    const create = async (
        { ...props }: NEW_VLIDE
    ) => {
        const res = await axios
            .post('/api/v1/vlide', props)
            
        return res;
    };

    const uploadAudio = async (
        {...props}: UPLOAD_AUDIO
    ) => {
        let uploadData = new FormData();
        uploadData.append('audio', props.audio, props.audio.name)

        const res =  await axios.post(
            `/api/v1/vlide/${props.id}/audio`, 
            uploadData,
            {
                // baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json",
                    'content-type': 'multipart/form-data',
                },
                withCredentials: true
            }
        );
        return res;
    };

    const deleteAudio = async (
        vlideId: string,
        audioId: string,
        setSrc: React.Dispatch<React.SetStateAction<string | null>>
    ) => {

        await axios
            .delete(`/api/v1/vlide/${vlideId}/audio`)
            .then(res => {
                setIsLoading(false);
                setSrc("");
            })
            .catch((error) => {
                if (error.response.status !== 422) throw error;
            });

    };

    // edit
    const update = async (
        { ...props }: UPDATE_VLIDE
    ) => {
        axios
            .put(`/api/v1/vlide/${props.vlide_id}`, props)
            .then((res) => {
                // router.push(`/drafts/vlide/${id}`)
            })
            .catch(error => {
            });
    }

    // delete
    // const destroy = async ( vlide_id: string ) => {
    //     axios
    //     .delete(`/api/v1/vlide/${vlide_id}`)
    //     .then((res) => {
    //         // router.push(`/drafts/vlide/${id}`)
    //     })
    //     .catch(error => {
    //     })

    // }

    const savedUnsaved = (vlideId: string) => {
        axios
            .put(`/api/v1/vlide/${vlideId}/save`,{})
            .then((res) => {

                if( res.data.result === "saved" ) {
                    setIsSaved(true);
                }else if(res.data.result === "unsaved") {
                    setIsSaved(false);
                }
            });
    };



    // useEffect(() => {
    // }, [title, tagList]);

    return {
        title,
        setTitle,
        content, 
        setContent,
        isPublic,
        setIsPublic,
        isSaved,
        countClips,
        tagList,
        setTagList,
        durationTime,
        setDurationTime,
        audio,
        setAudio,
        src, 
        setSrc,
        currentTime, 
        setCurrentTime,
        isRunning, 
        setIsRunning,
        isLoading,
        setIsLoading,
        retrieve,
        retrieveForDraft,
        create,
        uploadAudio,
        deleteAudio,
        update,
        // destroy,
        savedUnsaved
    }
};