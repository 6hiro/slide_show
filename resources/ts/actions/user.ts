import { Dispatch, SetStateAction } from "react";

import { ToastNotification } from "../components/toastNotification/ToastNotifications";
import axios from "../libs/axios";
import { CLIP } from "../types/clip";
import { USER } from "../types/user";
import { VLIDE } from "../types/vlide";
import { generateUid } from "../utils/uid";



export const fetchAsyncUser = async (
    username: string | undefined, 
    setProf: Dispatch<SetStateAction<USER | undefined>>,
    setIsLoadingProf: Dispatch<SetStateAction<boolean>>,
) => {
    if(username) {
        setIsLoadingProf(true);
        username && await axios
            .get(`/api/v1/user/${username}`)
            .then((res) => {
                setProf(res.data.data);
            })
            .finally(() => {
                setIsLoadingProf(false);
            });
    }
};

export const updateAsyncProf = async(
    nickName: string, 
    description: string,
    setToastNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
    setProf: (value: SetStateAction<USER | undefined>) => void,
    setVlides: (value: SetStateAction<VLIDE[] | undefined>) => void,
    setClips: (value: SetStateAction<CLIP[] | undefined>) => void,
) => {
    axios
    .patch(`/api/v1/user/prof`,{
        nick_name: nickName,
        description: description.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n')
    })
    .then((res) => {
        // console.log(setToastNotifications)
        setToastNotifications(prev => {
            return[
                ...prev,
                {id: generateUid(), type:"success", message:"プロフィールを更新しました"},
            ];
        });

        setProf( (prev) => {
            if(prev){
                return {
                    ...prev,
                    nick_name: res.data.nick_name,
                    description: res.data.description
                  };
            }
            return prev;
        });

        setClips( (prev )=> {
            if(prev){
                const newClips = [ ...prev ];
                
                newClips?.map((clip) => {
                    if(clip.clip_type==="reclip"){
                        if(clip.parent && clip.parent.user.id === res.data.user_id){
                            clip.parent.user.nick_name = res.data.nick_name;
                        }  
                    }else{
                        if(clip.user.id === res.data.user_id){
                            clip.user.nick_name = res.data.nick_name;
                        }
                    }
                });
                return newClips;
            }else{
                return prev;
            }
        });

        setVlides( (prev )=> {
            if(prev){
                const newVlides = [ ...prev ];

                newVlides?.map((vlide) => {
                    if(vlide.user.id === res.data.user_id){
                        vlide.user.nick_name = res.data.nick_name;
                    }
                });
                return newVlides;
            }else{
                return prev;
            }
        });

    })
    .catch((error) => {
        setToastNotifications(prev => {
            return[
                ...prev,
                {id: generateUid(), type:"error", message:"プロフィールの更新に失敗しました"},
            ];
        });
    });
};