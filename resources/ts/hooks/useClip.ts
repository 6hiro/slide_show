import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CLIP, NEW_CLIP, NEW_REPLY } from "../types/clip";
import { USER } from "../types/user";
import { fetchAsyncLatestData, fetchAsyncMoreData } from "../actions/common";
import { putAsyncFollowUnfollow } from "../actions/follow";
import { 
    createAsyncClip, 
    createAsyncClipReply, 
    deleteAsyncClip, 
    fetchAsyncClip, 
    likeUnlikeAsyncClip, 
    shareAsyncClip,
    unShareAsyncClip
} from "../actions/clip";


export const useClip = () => {
    let navigate = useNavigate();

    const [clip, setClip] = useState<CLIP>();
    const [clips, setClips] = useState<CLIP[]>();
    const [text, setText] = useState("");
    const [clipNextPageLink, setClipNextPageLink] = useState<string>();
    const [isLoadingClip, setIsLoadingClip] = useState<boolean>(false);
    const [clipUsers, setClipUsers] = useState<USER[]>();
    const [clipUserNextPageLink, setClipUserNextPageLink] = useState<string>();


    const retrieve = (clipId: string) => {
        fetchAsyncClip(clipId, setClip, setClips);
    };

    const getlikeUsers = (clipId: string) => {
        const url = `/api/v1/clip/${clipId}/like/users`;
        fetchAsyncLatestData(url, setClipUsers, setClipUserNextPageLink, null); 
    }

    const getShareUsers = (clipId: string) => {
        const url = `/api/v1/clip/${clipId}/share/users`;
        fetchAsyncLatestData(url, setClipUsers, setClipUserNextPageLink, null); 
    }

    const create = (props: NEW_CLIP) => {
        createAsyncClip( props, setText, setIsLoadingClip )
    };
    
    const addReply = (props: NEW_REPLY) => {
        createAsyncClipReply(props, setText, setClips, setIsLoadingClip)
    };

    const getFollowings = () => {
        const url = `/api/v1/user/followings/clips`;
        fetchAsyncLatestData(url, setClips, setClipNextPageLink, setIsLoadingClip);
    };

    const getVlideClips = (vlideId: string) => {
        const url = `/api/v1/clip/vlide/${vlideId}`;
        fetchAsyncLatestData(url, setClips, setClipNextPageLink, setIsLoadingClip);
    };

    const getMoreClip= () => {
        fetchAsyncMoreData(clipNextPageLink, setClips, setClipNextPageLink);
    };

    const getMoreClipUsers= () => {
        fetchAsyncMoreData(clipUserNextPageLink, setClipUsers, setClipUserNextPageLink);
    };

    const likeUnlike = (clipId: string) => {
        likeUnlikeAsyncClip(clipId, setClips, setClip);
    }; 

    const shareClip = (
        clipId:string,
        setReClipId: Dispatch<SetStateAction<any>>, 
    ) => {
        const onSuccess = (res: any) => {
            setReClipId(res.data.id);
        }
        shareAsyncClip(clipId, onSuccess);
    };

    const unShareClip = (
        clipId:string,
        setReClipId: Dispatch<SetStateAction<any>>, 
    ) => {
        const onSuccess = (res: any) => {
            setClips( (prev)=> {
                if(prev){                        
                    return prev.filter((clip) => {
                        return clip.id !== clipId;
                    });
                    
                }else{
                    return prev;
                }
            });
            setReClipId("");
        }
        unShareAsyncClip(clipId, onSuccess);

    };

    const deleteClip = ( 
        clipId: string, 
        setShowDelete: Dispatch<SetStateAction<any>>
    ) => {
        deleteAsyncClip(clipId, clip, clips, setClips, setShowDelete, navigate);
    };

    const followUnfollow = (
        targetId: string, 
        loginId: string
    ) => {
        putAsyncFollowUnfollow(targetId, loginId, {users:clipUsers, setUsers:setClipUsers})
    };

    const clipfollowUnfollow = (targetId: string, loginId:string) => {
        putAsyncFollowUnfollow(targetId, loginId, {users:clipUsers, setUsers:setClipUsers})
    };

    return {
        text, 
        setText,
        clip,
        clips,
        clipNextPageLink,
        clipUsers,
        clipUserNextPageLink,
        isLoadingClip,
        retrieve,
        create,
        addReply,
        getShareUsers,
        getlikeUsers,
        getFollowings,
        getVlideClips,
        getMoreClip,
        getMoreClipUsers,
        likeUnlike,
        shareClip,
        unShareClip,
        deleteClip,
        followUnfollow,
        clipfollowUnfollow
    }

};