import { Dispatch, SetStateAction, useState } from "react";

import { fetchAsyncLatestData, fetchAsyncMoreData } from "../actions/common";
import { deleteAsyncVlide, saveUnsaveAsyncVlide } from "../actions/vlide";
import axios from '../libs/axios';
import { VLIDE } from "../types/vlide";



export const useGetVlide = () => {

    const [vlide, setVlide] = useState<VLIDE>();
    const [vlides, setVlides] = useState<VLIDE[]>();
    const [vlideNextPageLink, setVlideNextPageLink] = useState<string>();
    const [isLoadingVlide, setIsLoadingVlide] = useState<boolean>(false);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const retrieve= (vlideId: string) => {
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

    const getFollowings = () => {
        fetchAsyncLatestData(`/api/v1/user/followings/vlides`, setVlides, setVlideNextPageLink, setIsLoadingVlide);
    };

    const getMoreVlide = () => {
        fetchAsyncMoreData(vlideNextPageLink, setVlides, setVlideNextPageLink);
    };

    const savedUnsaved = (vlideId: string) => {
        saveUnsaveAsyncVlide(vlideId, setVlides, setVlide);
    };

    const deleteVlide = async ( 
        vlideId: string,
        setShowDelete: Dispatch<SetStateAction<any>>
    ) => {
        const onSuccess = (res: any) => {
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
        };

        deleteAsyncVlide(vlideId, onSuccess);
    };

    return {
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
        // getTrend,
        getFollowings,
        getMoreVlide,
        savedUnsaved,
        deleteVlide
    }
};