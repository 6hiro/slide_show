import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';

import { deleteAsyncClip, likeUnlikeAsyncClip, shareAsyncClip, unShareAsyncClip } from "../actions/clip";
import { fetchAsyncLatestData, fetchAsyncMoreData } from "../actions/common";
import { putAsyncFollowUnfollow } from "../actions/follow";
import { deleteAsyncImage, fetchAsyncUserImages, uploadAsyncImage } from "../actions/image";
import { fetchAsyncUser, updateAsyncProf } from "../actions/user";
import { deleteAsyncVlide, saveUnsaveAsyncVlide } from "../actions/vlide";
import { ToastNotification } from "../components/toastNotification/ToastNotifications";
import { CLIP } from "../types/clip";
import { UPLOAD_ICON, USER } from "../types/user";
import { SHOW_IMAGE, VLIDE } from "../types/vlide";
import { generateUid } from "../utils/uid";

type Props = {
    user: any;
    isLoading: boolean;
    username: string | undefined;
};
export const useProf = (props: Props) => {
    let navigate = useNavigate();
    const processing: React.MutableRefObject<boolean> = useRef<boolean>(false);

    
    const [searchParams, _] = useSearchParams();

    const [section, setSection] = useState<string>();
    const [isLoadingProf, setIsLoadingProf] = useState<boolean>(true);
    const [isLoadingContents, setIsLoadingContents] = useState<boolean>(false);


    const [prof, setProf] = useState<USER>();

    const [vlideNextPageLink, setVlideNextPageLink] = useState<string>();
    const [clipNextPageLink, setClipNextPageLink] = useState<string>();
    const [userNextPageLink, setUserNextPageLink] = useState<string>();
    const [clipUserNextPageLink, setClipUserNextPageLink] = useState<string>();
    const [imageNextPageLink, setImageNextPageLink] = useState<string>();

    const [vlides, setVlides] = useState<VLIDE[]>();
    const [clips, setClips] = useState<CLIP[]>();
    const [users, setUsers] = useState<USER[]>();
    const [clipUsers, setClipUsers] = useState<USER[]>();
    const [images, setImages] = useState<SHOW_IMAGE[]>();

    const clearContents = () => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setImages([]);
        setImageNextPageLink("");
    }

    const getUser = () => {
        clearContents();
        setProf(undefined);
        fetchAsyncUser(props.username, setProf, setIsLoadingProf)
    };

    const getVlides =  (userId: string) => {
        clearContents();
        fetchAsyncLatestData(`/api/v1/user/${userId}/vlides`, setVlides, setVlideNextPageLink, setIsLoadingContents);
    };

    const getBookmarks = (userId: string) => {
        clearContents();
        fetchAsyncLatestData(`/api/v1/user/${userId}/saves`, setVlides, setVlideNextPageLink, setIsLoadingContents);
    };

    const getClips = (userId: string) => {
        clearContents();
        const url = `/api/v1/user/${userId}/clips`;
        
        fetchAsyncLatestData(url, setClips, setClipNextPageLink, setIsLoadingContents)
    };

    const getReplies = (userId: string) => {
        clearContents();
        const url = `/api/v1/user/${userId}/replies`;
        fetchAsyncLatestData(url, setClips, setClipNextPageLink, setIsLoadingContents)
    };

    const getLikes = (userId: string) => {
        clearContents();
        const url = `/api/v1/user/${userId}/likes`;
        fetchAsyncLatestData(url, setClips, setClipNextPageLink, setIsLoadingContents);
    };
    
    const getImages = (userId: string) => {
        clearContents();
        setIsLoadingContents(true);

        const onSuccess = (res: any) => {
            setImages(res.data.data);
            setImageNextPageLink(res.data.next_page_link);
            setIsLoadingContents(false);
        }
        const onError = (err: any) => {
            setIsLoadingContents(false);
        }
        fetchAsyncUserImages(userId, onSuccess, onError)
    };

    const getMoreVlides = () => {
        fetchAsyncMoreData(vlideNextPageLink, setVlides, setVlideNextPageLink);
    };

    const getMoreClips = () => {
        fetchAsyncMoreData(clipNextPageLink, setClips, setClipNextPageLink);
    };

    const getMoreUsers= () => {
        fetchAsyncMoreData(userNextPageLink, setUsers, setUserNextPageLink);
    };

    const getMoreClipUsers= () => {
        fetchAsyncMoreData(clipUserNextPageLink, setClipUsers, setClipUserNextPageLink);
    };

    const getMoreImages = () => {
        fetchAsyncMoreData(imageNextPageLink, setImages, setImageNextPageLink);
    };

    const getFollowings = (userId: string) => {
        const url = `/api/v1/user/followings/${userId}`;
        fetchAsyncLatestData(url, setUsers, setUserNextPageLink, null);        
    };

    const getFollowers = (userId: string) => {
        const url = `/api/v1/user/followers/${userId}`;
        fetchAsyncLatestData(url, setUsers, setUserNextPageLink, null);        
    };

    const getlikeUsers = (clipId: string) => {
        const url = `/api/v1/clip/${clipId}/like/users`;
        fetchAsyncLatestData(url, setClipUsers, setClipUserNextPageLink, null);        
    }

    const getShareUsers = (clipId: string) => {
        const url = `/api/v1/clip/${clipId}/share/users`;
        fetchAsyncLatestData(url, setClipUsers, setClipUserNextPageLink, null); 
    }
    
    const uploadImage = async (
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>,
        {...props}: UPLOAD_ICON
    ) => {
        let uploadData = new FormData();
        uploadData.append('image', props.image, props.image.name);
        
        if (processing.current) return;
        processing.current = true;

        const onSuccess = (res: AxiosResponse<any, any>) => {
            setNotifications((prev) => {
                return[...prev, {id: generateUid(), type:"success", message:"画像をアップロードしました。"}]}
            );    
            const filePath: string = "/api/v1/image?f=" + res.data.file_path;

            prof && setProf( (prev) => {
                if(prev){
                    return {
                        ...prev,
                        file_name: filePath,
                      };
                }
                return prev;
            });

            clips && setClips( (prev )=> {
                if(prev){
                    const newClips = [ ...prev ];
                    
                    newClips?.map((clip) => {
                        if(clip.clip_type==="reclip"){
                            if(clip.parent && clip.parent.user.id === res.data.user_id){
                                clip.parent.user.file_name = filePath;
                            }  
                        }else{
                            if(clip.user.id === res.data.user_id){
                                clip.user.file_name = filePath;
                            }
                        }
                    });
                    return newClips;
                }else{
                    return prev;
                }
            });

            vlides && setVlides( (prev )=> {
                if(prev){
                    const newVlides = [ ...prev ];

                    newVlides?.map((vlide) => {
                        if(vlide.user.id === res.data.user_id){
                            vlide.user.file_name = filePath;
                        }
                    });
                    return newVlides;
                }else{
                    return prev;
                }
            });
            refetch();
        }
        const onError = (error: any) => {
            setNotifications((prev) => {
                return[ 
                    ...prev, 
                    {
                        id: generateUid(), 
                        type:"error", 
                        message:  error.response.data.message === "over" 
                            ? "画像数が上限に達しています。" 
                            : "画像のアップロードに失敗しました。"
                    }
                ]}
            );
        }
        const url = `/api/v1/user/prof/icon`;

        uploadAsyncImage(url, uploadData, processing, onSuccess, onError)
    };

    const deleteImage = async (
        user_id: string,
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>
    ) => {
        if (processing.current) return;
        processing.current = true;
        const onSuccess = (res: AxiosResponse<any, any>) => {
            setNotifications((prev) => {
                return [...prev, {id: generateUid(), type:"success", message:"画像の削除が完了しました。"}];
            });
            prof && setProf( (prev) => {
                if(prev){
                    return {
                        ...prev,
                        file_name: "",
                      };
                }
                return prev;
            });
            clips && setClips( (prev )=> {
                if(prev){
                    const newClips = [ ...prev ];
                    
                    newClips?.map((clip) => {
                        if(clip.clip_type==="reclip"){
                            if(clip.parent && clip.parent.user.id === user_id){
                                clip.parent.user.file_name = "";
                            }  
                        }else{
                            if(clip.user.id === user_id){
                                clip.user.file_name = "";
                            }
                        }
                    });
                    return newClips;
                }else{
                    return prev;
                }
            });

            vlides && setVlides( (prev )=> {
                if(prev){
                    const newVlides = [ ...prev ];

                    newVlides?.map((vlide) => {
                        if(vlide.user.id === user_id){
                            vlide.user.file_name = "";
                        }
                    });
                    return newVlides;
                }else{
                    return prev;
                }
            });
            refetch();
        }
        const onError = (err: any) => {
            setNotifications((prev) => {
                return [...prev, {id: generateUid(), type:"error", message:"画像の削除に失敗しました。"}];
            })
        }
        const url = `/api/v1/user/prof/icon`;
        deleteAsyncImage(url, processing, onSuccess, onError)
    };

    const updateProf = (
        nickName: string, 
        description: string,
        setToastNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
    ) => {
        updateAsyncProf(
            nickName, 
            description,
            setToastNotifications,
            setProf,
            setVlides,
            setClips,
        );
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
            prof && setProf(
                {
                    ...prof,
                    count_vlides: prof.count_vlides-1
                }
            )
        };
        deleteAsyncVlide(vlideId, onSuccess);
    };

    const deleteClip = async ( 
        clipId: string, 
        setShowDelete: Dispatch<SetStateAction<any>>
    ) => {
        deleteAsyncClip(clipId, undefined, clips, setClips, setShowDelete, undefined);
    };

    const savedUnsaved = (vlideId: string) => {
        saveUnsaveAsyncVlide(vlideId, setVlides, null);
    };

    const likeUnlike = (clipId: string) => {
        likeUnlikeAsyncClip(clipId, setClips, null);
    };

    
    const shareClip = async (
        clipId: string, 
        setReClipId: Dispatch<SetStateAction<any>>, 
    ) => {
        const onSuccess = (res: any) => {
            if(clips && section==="clips" && props.user.name === props.username){
                setClips([res.data, ...clips]);
            }else{
                setReClipId(res.data.id);
            }
        };
        shareAsyncClip(clipId, onSuccess);
    };

    const unShareClip = async (
        clipId: string,
        setReClipId: Dispatch<SetStateAction<any>>, 
    ) => {
        const onSuccess = (res: any) => {
            if(clips && section==="clips" && props.user.name === props.username){
                setClips( (prev )=> {
                    if(prev){
                        return prev.filter((clip) => {
                            return clip.id !== clipId;
                        });
                        
                    }else{
                        return prev;
                    }
                    
                })
            }
            setReClipId(res.data.id);
        };
        unShareAsyncClip(clipId, onSuccess);
    };

    const followUnfollow = (targetId: string, loginId:string) => {
        putAsyncFollowUnfollow(targetId, loginId, {users, setUsers}, {prof, setProf})
    };

    const clipfollowUnfollow = (targetId: string, loginId:string) => {
        putAsyncFollowUnfollow(targetId, loginId, {users:clipUsers, setUsers:setClipUsers})
    };

    // URL の query を変える
    const changeSection = (sectionName: string) => {
        setSection(sectionName);
        if(prof){
            if(sectionName==="vlides"){
                navigate(`/prof/${prof.name}`);
            }else if(sectionName==="clips" ){
                navigate(`/prof/${prof.name}?f=clips`);
            }else if(sectionName==="replies" ){
                navigate(`/prof/${prof.name}?f=replies`);
            }else if(sectionName==="bookmarks" ){
                navigate(`/prof/${prof.name}?f=bookmarks`);
            }else if(sectionName==="likes" ){
                navigate(`/prof/${prof.name}?f=likes`);
            }else if(sectionName==="images" ){
                navigate(`/prof/${prof.name}?f=images`);
            }
            window.scrollTo(0, 0);
        }

    };

    useEffect(() =>{
        getUser();
    }, [props.username]);

    useEffect(() => { //query が変わるたびにフェッチする

        if(prof?.id) {
            const f = searchParams.get("f");

            if( f === null) {
                setSection("vlides")
                getVlides(prof.id)
            }else if( typeof f === "string" ) {
    
                if(f==="bookmarks"){
                    setSection("bookmarks")
                    getBookmarks(prof.id)
                }else if(f==="clips") {
                    setSection('clips')
                    getClips(prof.id);
                }else if(f==="replies") {
                    setSection('replies')
                    getReplies(prof.id)
                }else if(f==="likes") {
                    setSection('likes')
                    getLikes(prof.id);
                }else if(f==="images") {
                    setSection('images')
                    getImages(prof.id);
                }
            }
        }
        
    }, [searchParams, prof?.name]);

    return {
        prof, 
        isLoadingProf,
        isLoadingContents,
        vlides,
        vlideNextPageLink,
        clips,
        clipNextPageLink,
        users,
        userNextPageLink,
        clipUsers,
        clipUserNextPageLink, 
        images,
        imageNextPageLink,
        section,
        setSection,
        changeSection,
        getlikeUsers,
        getShareUsers,
        getFollowings,
        getFollowers,
        getMoreVlides,
        getMoreClips,
        getMoreUsers,
        getMoreClipUsers,
        getMoreImages,
        uploadImage,
        deleteImage,
        updateProf,
        deleteVlide,
        deleteClip,
        savedUnsaved,
        likeUnlike,
        shareClip,
        unShareClip,
        followUnfollow,
        clipfollowUnfollow
    };

};