import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";

import axios from "../libs/axios";
import { CLIP, NEW_CLIP, NEW_REPLY } from "../types/clip";



export const fetchAsyncClip = async (
    clipId: string, 
    setClip: Dispatch<SetStateAction<CLIP | undefined>>,
    setClips: Dispatch<SetStateAction<CLIP[] | undefined>>,
) => {
    axios
        .get(`/api/v1/clip/${clipId}`)
        .then((res: AxiosResponse<any, any>) => {
            const data = res.data;
            setClip(data);
            setClips(data.replies);
        });
};

export const createAsyncClip = async (
    props: NEW_CLIP,
    setText: Dispatch<SetStateAction<string>>,
    setIsLoadingClip: Dispatch<SetStateAction<boolean>>,
) => {
    setIsLoadingClip(true);

    const url = props.id ? `/api/v1/clip/${props.id}` :  "/api/v1/clip"

    await axios
        .post(url, {
            content: props.content.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n'),
            quote: props.quote?.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n')
        })
        .then((res:any) => {
            setText("");
        })
        .catch((error:any) => {
        })
        .finally(() => {
            setIsLoadingClip(false);
        });
};

export const createAsyncClipReply = async (
    props: NEW_REPLY,
    setText: Dispatch<SetStateAction<string>>,
    setClips: Dispatch<SetStateAction<CLIP[] | undefined>>,
    setIsLoadingClip: Dispatch<SetStateAction<boolean>>,
) => {
    setIsLoadingClip(true);

    await axios
        .post(`/api/v1/clip/reply/${props.id}`, {
            content: props.content.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n'),
        })
        .then((res:any) => {
            setText("");
            setIsLoadingClip(false);
            res.data && setClips((prev) => {
                if(prev){
                    return [res.data, ...prev];
                }else {
                    return [res.data];
                }
            });
        })
        .catch((error:any) => {
            setIsLoadingClip(false);
        });
};

export const deleteAsyncClip = async (
    clipId: string,
    clip: CLIP | undefined,
    clips: CLIP[] | undefined,
    setClips: Dispatch<SetStateAction<CLIP[] | undefined>>,
    setShowDelete: Dispatch<SetStateAction<boolean>>,
    navigate: NavigateFunction | undefined,
) => {
    axios
        .delete(`/api/v1/clip/${clipId}`)
        .then((res) => {
            // clipの詳細ページの場合の処理
            (clip?.id === clipId && navigate) && navigate(`/prof/${clip.user.name}?f=clips`);

            // clipの一覧ページの場合の処理
            setClips( (prev)=> {
                if(prev){                        
                    return prev.filter((clip) => {
                        if(clip.clip_type === "reclip" && clip.parent && clip.parent.id === clipId) return false;
                        if (clip.clip_type !== "reclip" &&  clip.id === clipId) return false;

                        return true;
                    });
                }else{
                    return prev;
                }
            });
            setShowDelete(false);
        })
        .catch(error => {});
};

export const shareAsyncClip = async (
    clipId:string,
    onSuccess: Function
) => {
    await axios
        .post(`/api/v1/clip/share/${clipId}`, {})
        .then((res) => {
            onSuccess(res);
        });
};

export const unShareAsyncClip = async (
    clipId:string,
    onSuccess: Function,
) => {
    await axios
        .post(`/api/v1/clip/unshare/${clipId}`, {})
        .then((res) => {
            onSuccess(res);
        });
};

export const likeUnlikeAsyncClip = async (
    clipId:string,
    setClips: Dispatch<SetStateAction<CLIP[] | undefined>>,
    setClip: Dispatch<SetStateAction<CLIP | undefined>> | null
) => {
    axios
        .put(`/api/v1/clip/${clipId}/like`,{})
        .then((res) => {
            if( res.data.result === "like" ) {
                setClip && setClip( (prev) => {
                    if(prev){
                        const newClip = Object.assign({}, prev);

                        if(prev.clip_type!=="reclip" && prev.parent && prev.parent.id === res.data.id){
                            prev.parent.count_likes += 1;
                            prev.parent.is_liked = true;
                        }  

                        if(prev.id === res.data.id) {
                            newClip.count_likes += 1;
                            newClip.is_liked = true;    
                        }

                        return newClip;
                    }
                    return  prev;
                });

                setClips( (prev) => {
                    if(prev){
                        const newClips = [ ...prev ];

                        newClips?.map((clip) => {

                            if(clip.clip_type==="reclip"){
                                if(clip.parent && clip.parent.id === res.data.id){
                                    clip.parent.count_likes += 1;
                                    clip.parent.is_liked = true;
                                }  
                            }else{
                                if(clip.id === res.data.id){
                                    clip.count_likes +=1;
                                    clip.is_liked = true;
                                }
                            }
                        });
                        return newClips;
                    }else{
                        return prev;
                    }
                });
            }else if(res.data.result === "unlike") {

                setClip && setClip( (prev) => {
                        if(prev){
                            const newClip = Object.assign({}, prev);

                            if(prev.clip_type!=="reclip" && prev.parent && prev.parent.id === res.data.id){
                                prev.parent.count_likes -= 1;
                                prev.parent.is_liked = false;
                            }  
                            if(prev.id === res.data.id) {
                                newClip.count_likes -=1;
                                newClip.is_liked = false;
                            }

                            return newClip;
                        }
                    // }
                    return  prev;
                });

                setClips( (prev) => {
                    if(prev){
                        const newClips = [ ...prev ]

                        newClips?.map((clip) => {
                            if(clip?.clip_type==='reclip'){
                                if(clip.parent && clip.parent.id === res.data.id){
                                    clip.parent.count_likes -= 1;
                                    clip.parent.is_liked = false;
                                }
                            }else{
                                if(clip.id === res.data.id){
                                    clip.count_likes -=1;
                                    clip.is_liked = false;
                                }
                            }
                        });
                        return newClips;
                    }else{
                        return prev;
                    }
                });
            }
        });
};