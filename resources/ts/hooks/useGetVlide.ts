import { Dispatch, SetStateAction, useEffect, useState } from "react";

import axios from '../libs/axios';
import { VLIDE } from "../types/vlide";
import { useAuth } from "./useAuth";

export const useGetVlide = () => {
        
    const { 
        user, 
    } = useAuth();

    const [vlide, setVlide] = useState<VLIDE>();
    const [vlides, setVlides] = useState<VLIDE[]>();
    const [vlideNextPageLink, setVlideNextPageLink] = useState<string>();
    const [isLoadingVlide, setIsLoadingVlide] = useState<boolean>(false);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const retrieve= (vlideId: string) => {
        // setVlide();
        setIsLoadingVlide(true);
        axios
            .get(`/api/v1/vlide/${vlideId}`)
            .then((res) => {
                const data = res.data;
                setVlide(data);
                setIsLoadingVlide(false);
            })
            .catch(() => {
                setIsLoadingVlide(false);
            });
    };
    

    const getTrend = () => {
        setVlides([]);
        setIsLoadingVlide(true);

        axios
            .get(`/api/v1/vlide/rank`)
            .then((res) => {
                const data = res.data;
                setVlides(data.data);
                setIsLoadingVlide(false);
            })
            .catch(() => {
                setIsLoadingVlide(false);
            });

    };

    const getFollowings = () => {
        setVlides([]);
        setIsLoadingVlide(true);

        axios
            .get(`/api/v1/user/followings/vlides`)
            .then((res) => {
                const data = res.data;
                setVlides(data.data);
                setIsLoadingVlide(false);
                setVlideNextPageLink(res.data.next_page_link ? res.data.next_page_link : "");
            })
            .catch(() => {
                setIsLoadingVlide(false);
            });
    };

    const getMoreVlide = () => {
        axios
            .get(`${vlideNextPageLink}`)
            .then((res) => {
                setVlides( (prev) => {
                    if(vlides){
                        return [...vlides, ...res.data.data]
                    }else{
                        return res.data.data;
                    }
                });

                setVlideNextPageLink(res.data.next_page_link ? res.data.next_page_link : "");
            })
            .catch((error) => {});
    };

    const savedUnsaved = (vlideId: string) => {
        axios
            .put(`/api/v1/vlide/${vlideId}/save`,{})
            .then((res) => {
                // 'id' => $vlide->id,
                // 'count_saves' => $vlide->count_saves-1,
                // 'result' => 'unsave'

                if( res.data.result === "saved" ) {

                    vlide && setVlide( (prev) => {
                        if(prev && prev.id === res.data.id){
                            const newVlide = Object.assign({}, prev);

                            newVlide.count_saves += 1;
                            newVlide.is_saved = true;

                            return newVlide;
                        }
                        return  prev;
                    });
                    
                    const add_save = (vlide:VLIDE) => { // 投稿の保存数と保存をしたかどうかを変更
                        vlide["count_saves"] = res.data.count_saves;
                        vlide["is_saved"] = true;

                        return vlide;
                    }

                    vlides && setVlides( (prev) => {
                        if(prev){
                            const newVlides = [ ...prev ];

                            newVlides?.map((vlide) => 
                                vlide.id === res.data.id ? add_save(vlide) : vlide, 
                            );
                            return newVlides;
                        }else{
                            return prev;
                        }
                    });
                }else if(res.data.result === "unsaved") {

                    vlide && setVlide( (prev) => {
                        if(prev && prev.id === res.data.id){
                            const newVlide = Object.assign({}, prev)
                            
                            newVlide.count_saves -= 1;
                            newVlide.is_saved = false;

                            return newVlide;
                        }
                        return  prev;
                    });

                    const delete_save = (vlide:VLIDE) => {
                        // 投稿のいいね数といいねをしたかどうかを変更
                        vlide["count_saves"] = res.data.count_saves;
                        vlide["is_saved"] = false;
                        return vlide;
                    };

                    vlides && setVlides( (prev) => {
                        if(prev){
                            const newVlides = [ ...prev ]

                            newVlides?.map((vlide) => 
                                vlide.id === res.data.id ? delete_save(vlide) : vlide, 
                            );
                            return newVlides;
                        }else{
                            return prev;
                        }
                    });

                }
            });
    };

    const destroy = async ( 
        vlideId: string,
        setShowDelete: Dispatch<SetStateAction<any>>
    ) => {
        axios
            .delete(`/api/v1/vlide/${vlideId}`)
            .then((res) => {
                // router.push(`/drafts/vlide/${id}`)
                vlides && setVlides( (prev)=> {
                    if(prev){                        
                        return prev.filter((vlide) => {
                            return vlide.id !== vlideId;
                        });
                    }else{
                        return prev;
                    }
                });
                setShowDelete(false);
            })
            .catch(error => {});
    };

    useEffect(() => {}, [vlide, vlides]);


    return {
        user,
        vlide,
        setVlide,
        vlides,
        setVlides,
        vlideNextPageLink,
        setVlideNextPageLink,
        isLoadingVlide,
        currentTime, 
        setCurrentTime,
        isRunning,
        setIsRunning,
        retrieve,
        getTrend,
        getFollowings,
        getMoreVlide,
        savedUnsaved,
        destroy
    }
};