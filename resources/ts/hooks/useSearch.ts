import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { deleteAsyncClip, likeUnlikeAsyncClip, shareAsyncClip, unShareAsyncClip } from "../actions/clip";
import { fetchAsyncMoreData } from "../actions/common";
import { putAsyncFollowUnfollow } from "../actions/follow";
import { fetchAsyncLatestData, fetchAsyncRankData } from "../actions/common";
import { deleteAsyncVlide, saveUnsaveAsyncVlide } from "../actions/vlide";
import { CLIP } from "../types/clip";
import { USER } from "../types/user";
import { VLIDE } from "../types/vlide";


type Props = {
    user: any;
    keyword: string;
    order: string;
    section: string;
};

/**
 * ログインしていない場合は、Vlide のみ検索可能
 * keyword の1文字目が # の場合、/tag?q=%23${keyword} 飛ぶ
 */
export const useSearch = (props: Props) => {
    let navigate = useNavigate();
    const [searchParams, _] = useSearchParams();
    
    const [message, setMessage] = useState<string>();
    const [isLoadingContents, setIsLoadingContents] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>(String(props.keyword));
    const [order, setOrder] = useState<string>(props.order);
    const [section, setSection] = useState<string>(String(props.section));
    const [vlideNextPageLink, setVlideNextPageLink] = useState<string>();
    const [clipNextPageLink, setClipNextPageLink] = useState<string>();
    const [userNextPageLink, setUserNextPageLink] = useState<string>();
    const [clipUserNextPageLink, setClipUserNextPageLink] = useState<string>();
    const [vlides, setVlides] = useState<VLIDE[]>();
    const [clips, setClips] = useState<CLIP[]>();
    const [users, setUsers] = useState<USER[]>();
    const [clipUsers, setClipUsers] = useState<USER[]>();

    // URL の query を変える
    const search = ( orderName?: string, sectionName?: string ) => {
        if(section==="clip" && order==="top"){
            if(keyword.slice(0, 1)==="#"){
                navigate(`/tag?q=%23${keyword.trim().slice(1)}&f=clip&o=top`);
            }else{
                navigate(`/search?q=${keyword.trim()}&f=clip&o=top`);
            }
        }else if(section==="clip" &&  order==="latest"){
            if(keyword.slice(0, 1)==="#"){
                navigate(`/tag?q=%23${keyword.trim().slice(1)}&f=clip&o=latest`);
            }else{
                navigate(`/search?q=${keyword.trim()}&f=clip&o=latest`);
            }
        }else if(section==="vlide" && order==="top"){
            if(keyword.slice(0, 1)==="#"){
                navigate(`/tag?q=%23${keyword.trim().slice(1)}&f=vlide&o=top`);
            }else{
                navigate(`/search?q=${keyword.trim()}&f=vlide&o=top`);
            }
        }else if(section==="vlide" && order==="latest"){
            if(keyword.slice(0, 1)==="#"){
                navigate(`/tag?q=%23${keyword.trim().slice(1)}&f=vlide&o=latest`);
            }else{
                navigate(`/search?q=${keyword.trim()}&f=vlide&o=latest`);
            }
        }else if(section==="user" && order==="top"){
            if(keyword.slice(0, 1)==="#"){
                navigate(`/tag?q=%23${keyword.trim().slice(1)}&f=user&o=top`);
            }else{
                navigate(`/search?q=${keyword.trim()}&f=user&o=top`);
            }
        }else if(section==="user" && order==="latest"){
            if(keyword.slice(0, 1)==="#"){
                navigate(`/tag?q=%23${keyword.trim().slice(1)}&f=user&o=latest`);
            }else{
                navigate(`/search?q=${keyword.trim()}&f=user&o=latest`);
            }
        }
    };
    const clearContents = () => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setUsers([]);
        setUserNextPageLink("");
    }
    const getLatestVlide = (word: string) => {
        clearContents();
        fetchAsyncLatestData(`/api/v1/search/vlide/latest?word=${word}`, setVlides, setVlideNextPageLink, setIsLoadingContents);
    };
    const getTrendVlide = (word: string) => {
        clearContents();
        fetchAsyncRankData(`/api/v1/search/vlide/rank?word=${word}`, setVlides, setIsLoadingContents);
    };
    const getLatestClip = (word: string) => {
        clearContents();
        fetchAsyncLatestData(`/api/v1/search/clip/latest?word=${word}`, setClips, setClipNextPageLink, setIsLoadingContents);
    };

    const getTrendClip = (word: string) => {
        clearContents();
        fetchAsyncRankData(`/api/v1/search/clip/rank?word=${word}`, setClips, setIsLoadingContents);
    };

    const getLatestUser = (word: string) => {
        clearContents();
        fetchAsyncLatestData(`/api/v1/search/user/latest?word=${word}`, setUsers, setUserNextPageLink, setIsLoadingContents);
    };

    const getTrendUser = (word: string) => {
        clearContents();
        fetchAsyncRankData(`/api/v1/search/user/latest?word=${word}`, setUsers, setIsLoadingContents);
    };

    const getMoreVlide = () => {
        fetchAsyncMoreData(vlideNextPageLink, setVlides, setVlideNextPageLink);
    };
    const getMoreClip= () => {
        fetchAsyncMoreData(clipNextPageLink, setClips, setClipNextPageLink);
    };
    const getMoreUser= () => {
        fetchAsyncMoreData(userNextPageLink, setUsers, setUserNextPageLink);
    };
    const getMoreClipUsers= () => {
        fetchAsyncMoreData(clipUserNextPageLink, setClipUsers, setClipUserNextPageLink);
    };

    const savedUnsaved = (vlideId: string) => {
        saveUnsaveAsyncVlide(vlideId, setVlides, null);
    };

    const likeUnlike = (clipId: string) => {
        likeUnlikeAsyncClip(clipId, setClips, null);
    };
    const getlikeUsers = (clipId: string) => {
        const url = `/api/v1/clip/${clipId}/like/users`;
        fetchAsyncLatestData(url, setClipUsers, setClipUserNextPageLink, setIsLoadingContents); 
    };
    const getShareUsers = (clipId: string) => {
        const url = `/api/v1/clip/${clipId}/share/users`;
        fetchAsyncLatestData(url, setClipUsers, setClipUserNextPageLink, null); 
    }
    const clipfollowUnfollow = (targetId: string, loginId:string) => { // いいね一覧
        putAsyncFollowUnfollow(targetId, loginId, {users:clipUsers, setUsers:setClipUsers})
    };

    const shareClip = async (
        clipId:string,
        setReClipId: Dispatch<SetStateAction<any>>, 
    ) => {
        const onSuccess = (res: any) => {
            setReClipId(res.data.id);
        };
        shareAsyncClip(clipId, onSuccess);
    };
    const unShareClip = async (
        clipId:string,
        setReClipId: Dispatch<SetStateAction<any>>, 
    ) => {
        const onSuccess = (res: any) => {
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
        }
        unShareAsyncClip(clipId, onSuccess);

    };

    const followUnfollow = (targetId: string, loginId:string) => {
        putAsyncFollowUnfollow(targetId, loginId, {users:users, setUsers:setUsers})
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

    const deleteClip = async ( 
        clipId: string, 
        setShowDelete: Dispatch<SetStateAction<any>>
    ) => {
        deleteAsyncClip(clipId, undefined, clips, setClips, setShowDelete, undefined);
    };
    
    useLayoutEffect(() => { //query が変わるたびにフェッチする
        
        const q = searchParams.get("q");
        const f = searchParams.get("f");
        const o = searchParams.get("o");

        if(typeof q === "string" && typeof f === "string" && typeof o === "string") {
            setKeyword(q);
            setOrder(o);
            setSection(f);

            if(f==="vlide"){
                setMessage("");

                if(o==="latest"){
                    getLatestVlide(q);
                    
                }else if(o==="top") {
                    getTrendVlide(q);
                }
                
            }else if(f==="clip") {
                if(props.user){
                    setMessage("");

                    if(o==="latest"){
                        getLatestClip(q);
                    }else if(o==="top") {
                        getTrendClip(q);
                    }
                } else {
                    setVlides([]);
                    setClips([]);
                    setUsers([]);
                    setVlideNextPageLink("");
                    setClipNextPageLink("");
                    setUserNextPageLink("");
        
                    setMessage("検索を続けるには、ログインが必要です。");
                }

            }else if(f==="user") {
                if(props.user){
                    setMessage("");

                    if(o==="latest"){
                        getLatestUser(q);
                    }else if(o==="top") {
                        getTrendUser(q);
                    }
                } else {
                    setVlides([]);
                    setClips([]);
                    setUsers([]);
                    setVlideNextPageLink("");
                    setClipNextPageLink("");
                    setUserNextPageLink("");
        
                    setMessage("検索を続けるには、ログインが必要です。");
                }
            }
        }
        
    },[searchParams, props.user]);


    return {
        message,
        setMessage,
        keyword, 
        setKeyword,
        order,
        setOrder,
        section,
        setSection,
        vlides,
        vlideNextPageLink,
        clips,
        clipNextPageLink,
        users,
        userNextPageLink,
        clipUsers, 
        setClipUsers,
        clipUserNextPageLink,
        search,
        getMoreVlide,
        getMoreClip,
        getMoreClipUsers,
        getMoreUser,
        getlikeUsers,
        getShareUsers,
        savedUnsaved,
        likeUnlike,
        shareClip,
        unShareClip,
        followUnfollow,
        clipfollowUnfollow,
        deleteVlide,
        deleteClip
    }
};