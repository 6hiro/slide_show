import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";

import axios from "../libs/axios";
import { CLIP, NEW_CLIP, NEW_REPLY } from "../types/clip";

export const useClip = () => {
    let navigate = useNavigate();

    const [clip, setClip] = useState<CLIP>();
    const [clips, setClips] = useState<CLIP[]>();
    const [text, setText] = useState("");
    const [clipNextPageLink, setClipNextPageLink] = useState<string>();
    const [isLoadingClip, setIsLoadingClip] = useState<boolean>(false);

    const retrieve= (clipId: string) => {
        axios
            .get(`/api/v1/clip/${clipId}`)
            .then((res: AxiosResponse<any, any>) => {
                const data = res.data;
                setClip(data);
                setClips(data.replies);
            });
    };

    const create = async (
        { ...props }: NEW_CLIP
    ) => {
        setIsLoadingClip(true);

        axios
            .post(`/api/v1/clip/${props.id}`, {
                content: props.content.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n'),
                quote: props.quote.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n')
            })
            .then((res:any) => {
                setText("");
                setIsLoadingClip(false);
            })
            .catch((error:any) => {
                setIsLoadingClip(false);
            });
    };
    
    const addReply = async (
        { ...props }: NEW_REPLY
    ) => {
        setIsLoadingClip(true);

        axios
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

    const getFollowings = () => {
        setClips([]);
        setIsLoadingClip(true);

        axios
            .get(`/api/v1/user/followings/clips`)
            .then((res) => {
                const data = res.data;
                setClips(data.data);
                setIsLoadingClip(false);
            })
            .catch((error:any) => {
                setIsLoadingClip(false);
            });
    };

    const getVlideClips = (vlideId: string) => {
        setClips([]);
        setIsLoadingClip(true);

        axios
            .get(`/api/v1/clip/vlide/${vlideId}`)
            .then((res) => {
                const data = res.data;
                setClips(data.data);
                setClipNextPageLink(data.next_page_link ? res.data.next_page_link : "");

                setIsLoadingClip(false);
            })
            .catch((error:any) => {
                setIsLoadingClip(false);
            });
    };

    const getMoreClip= () => {
        axios
            .get(`${clipNextPageLink}`)
            .then((res) => {
                
                setClips( (prev) => {
                    if(clips){
                        return [...clips, ...res.data.data];
                    }else{
                        return res.data.data;
                    }
                });
                setClipNextPageLink(res.data.next_page_link ? res.data.next_page_link : "");
            })
            .catch((error) => {});

    };

    const likeUnlike = (clipId: string) => {
        axios
            .put(`/api/v1/clip/${clipId}/like`,{})
            .then((res) => {
                // 'id' => $vlide->id,
                // 'count_saves' => $vlide->count_saves-1,
                // 'result' => 'unsave'

                if( res.data.result === "like" ) {

                    clip && setClip( (prev) => {
                        if(prev && prev.id === res.data.id){
                            const newClip = Object.assign({}, prev);

                            newClip.count_likes += 1;
                            newClip.is_liked = true;

                            return newClip;
                        }
                        return  prev;
                    });


                    clips && setClips( (prev) => {
                        if(prev){
                            const newClips = [ ...prev ];

                            newClips?.map((clip) => {
      
                                if(clip.clip_type==="reclip"){
                                    if(clip.parent?.id === res.data.id){
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

                    clip && setClip( (prev) => {
                        // if(prev?.clip_type==='reclip'){
                        //     prev.parent.count_likes -= 1
                        //     prev.parent.is_liked = false;
                        // }else{
                            if(prev && prev.id === res.data.id){
                                const newClip = Object.assign({}, prev);

                                newClip.count_likes -=1;
                                newClip.is_liked = false;

                                return newClip;
                            }
                        // }
                        return  prev;
                    });

                    clips && setClips( (prev) => {
                        if(prev){
                            const newClips = [ ...prev ]
 
                            newClips?.map((clip) => {
                                if(clip?.clip_type==='reclip'){
                                    if(clip.parent?.id === res.data.id){
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
    

    const shareClip = async (
        clipId:string,
        setReClipId: Dispatch<SetStateAction<any>>, 
    ) => {
        // setReClipId("");
        await axios
            .post(`/api/v1/clip/share/${clipId}`, {})
            .then((res) => {
                setReClipId(res.data.id);

                return res.data;
            });
    };
    const unShareClip = async (
        clipId:string,
        setReClipId: Dispatch<SetStateAction<any>>, 
    ) => {
        await axios
            .post(`/api/v1/clip/unshare/${clipId}`, {})
            .then((res) => {
                clips && setClips( (prev)=> {
                    if(prev){                        
                        return prev.filter((clip) => {
                            return clip.id !== clipId;
                        });
                        
                    }else{
                        return prev;
                    }
                    
                });
                setReClipId(res.data.id);

                return res.data;
            });
    };
    const deleteClip = async ( 
        clipId: string, 
        setShowDelete: Dispatch<SetStateAction<any>>
    ) => {
        axios
            .delete(`/api/v1/clip/${clipId}`)
            .then((res) => {
                // clipの詳細ページの場合の処理
                (clip?.id === clipId) && navigate(`/prof/${clip.user.name}?f=clips`);

                // clipの一覧ページの場合の処理
                clips && setClips( (prev)=> {
                    if(prev){                        
                        return prev.filter((clip) => {
                            if(clip.clip_type === "reclip" && clip.parent.id === clipId) return false;
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

    return {
        text, 
        setText,
        clip,
        clips,
        clipNextPageLink,
        isLoadingClip,
        retrieve,
        create,
        addReply,
        getFollowings,
        getVlideClips,
        getMoreClip,
        likeUnlike,
        shareClip,
        unShareClip,
        deleteClip
    }
};