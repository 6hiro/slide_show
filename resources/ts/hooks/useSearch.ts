import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import axios from "../libs/axios";
import { CLIP, NEW_CLIP } from "../types/clip";
import { USER } from "../types/user";
import { VLIDE } from "../types/vlide";
import { useAuth } from "./useAuth";


type Props = {
    keyword: string;
    order: string;
    section: string;
};

/**
 * 
 * ログインしていない場合は、Vlide のみ検索可能
 * keyword の1文字目が # の場合、/tag?q=%23${keyword} 飛ぶ
 */
export const useSearch = (props: Props) => {
    let navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { user } = useAuth();

    const [message, setMessage] = useState<string>();


    const [keyword, setKeyword] = useState<string>(String(props.keyword));
    const [order, setOrder] = useState<string>(props.order);
    const [section, setSection] = useState<string>(String(props.section));
    const [vlideNextPageLink, setVlideNextPageLink] = useState<string>();
    const [clipNextPageLink, setClipNextPageLink] = useState<string>();
    const [userNextPageLink, setUserNextPageLink] = useState<string>();

    const [vlides, setVlides] = useState<VLIDE[]>();
    const [clips, setClips] = useState<CLIP[]>();
    const [users, setUsers] = useState<USER[]>();

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


    const getLatestVlide = (word: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setUsers([]);
        setUserNextPageLink("");

        axios
            .get(`/api/v1/search/vlide/latest?word=${word}`)
            .then((res) => {
                setVlides(res.data.data);
                setVlideNextPageLink(res.data.next_page_link);
            })
            .catch((error) => {});
    };
    const getTrendVlide = (word: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setUsers([]);
        setUserNextPageLink("");

        axios
            .get(`/api/v1/search/vlide/rank?word=${word}`)
            .then((res) => {
                setVlides(res.data.data);
            })
            .catch((error) => {});

    };
    const getLatestClip = (word: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setUsers([]);
        setUserNextPageLink("");

        axios
            .get(`/api/v1/search/clip/latest?word=${word}`)
            .then((res) => {
                setClipNextPageLink(res.data.next_page_link);
                setClips(res.data.data);
            })
            .catch((error: any) => {
                switch (error.response?.status) {
                    // case 401:
                    //     navigate('/');
                    case 404:
                        navigate('/auth/login');

                        return false;
                }
            });

    };

    const getTrendClip = (word: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setUsers([]);
        setUserNextPageLink("");

        axios
            .get(`/api/v1/search/clip/rank?word=${word}`)
            .then((res) => {
                setClips(res.data.data);

                // res.data.id && router.push(`/drafts/vlide/${res.data.id}`);
            })
            .catch((error) => {});
    };

    const getLatestUser = (word: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setUsers([]);
        setUserNextPageLink("");

        axios
            .get(`/api/v1/search/user/latest?word=${word}`)
            .then((res) => {
                
                setUserNextPageLink(res.data.next_page_link)
                setUsers(res.data.data);
            })
            .catch((error) => {});

    };

    const getTrendUser = (word: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setUsers([]);
        setUserNextPageLink("");

        axios
            .get(`/api/v1/search/user/rank?word=${word}`)
            .then((res) => {
                setUsers(res.data.data);

                // res.data.id && router.push(`/drafts/vlide/${res.data.id}`);
            })
            .catch((error) => {});
    };

    const getMoreVlide = () => {
        axios
            .get(`${vlideNextPageLink}`)
            .then((res) => {
                setVlides( (prev) => {
                    if(vlides){
                        return [...vlides, ...res.data.data];
                    }else{
                        return res.data.data;
                    }
                });

                setVlideNextPageLink(res.data.next_page_link ? res.data.next_page_link : "");
            })
            .catch((error) => {});
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

    const getMoreUser= () => {
        axios
            .get(`${userNextPageLink}`)
            .then((res) => {
                
                setUsers( (prev) => {
                    if(users){
                        return [...users, ...res.data.data];
                    }else{
                        return res.data.data;
                    }
                });
                setUserNextPageLink(res.data.next_page_link ? res.data.next_page_link : "");
            })
            .catch((error) => {});

    };

    const savedUnsaved = (vlideId: string) => {
        axios
            .put(`/api/v1/vlide/${vlideId}/save`,{})
            .then((res) => {
                if( res.data.result === "saved" ) {

                    const add_save = (vlide:VLIDE) => { // 投稿の保存数と保存をしたかどうかを変更
                        vlide["count_saves"] = res.data.count_saves;
                        vlide["is_saved"] = true;

                        return vlide;
                    }

                    vlides && setVlides( (prev) => {
                        if(prev){
                            const newVlides = [ ...prev ]

                            newVlides?.map((vlide) => 
                                vlide.id === res.data.id ? add_save(vlide) : vlide, 
                            )
                            return newVlides;
                        }else{
                            return prev;
                        }
                    });
                }else if(res.data.result === "unsaved") {

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
                            )
                            return newVlides;
                        }else{
                            return prev;
                        }
                    });

                }
            });
    };

    const likeUnlike = (clipId: string) => {
        axios
            .put(`/api/v1/clip/${clipId}/like`,{})
            .then((res) => {
                if( res.data.result === "like" ) {

                    const add_like = (clip:CLIP) => { // 投稿の保存数と保存をしたかどうかを変更
                        clip["count_likes"] = res.data.count_likes;
                        clip["is_liked"] = true;

                        return clip;
                    }

                    clips && setClips( (prev) => {
                        if(prev){
                            const newClips = [ ...prev ]

                            newClips?.map((clip) => 
                                clip.id === res.data.id ? add_like(clip) : clip, 
                            )
                            return newClips;
                        }else{
                            return prev;
                        }
                    });
                }else if(res.data.result === "unlike") {

                    const delete_like = (clip:CLIP) => {
                        // 投稿のいいね数といいねをしたかどうかを変更
                        clip["count_likes"] = res.data.count_likes;
                        clip["is_liked"] = false;
                        return clip;
                    };

                    clips && setClips( (prev) => {
                        if(prev){
                            const newClips = [ ...prev ];

                            newClips?.map((clip) => 
                            clip.id === res.data.id ? delete_like(clip) : clip, 
                            )
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

    const followUnfollow = (userId: string) => {
        axios
            .put(`/api/v1/user/${userId}/follow`,{})
            .then((res) => {
                if( res.data.result === "followed" ) {
                    const add_follow = (user:USER) => {
                        user["count_followers"] = res.data.count_followers;
                        user["isFollowed"] = true;

                        return user;
                    }

                    users && setUsers( (prev) => {
                        if(prev){
                            const newUsers = [ ...prev ];

                            newUsers?.map((user) => 
                                user.id === res.data.id ? add_follow(user) : user, 
                            )
                            return newUsers;
                        }else{
                            return prev;
                        }
                    });
                }else if(res.data.result === "unfollowed") {

                    const delete_follow = (user:USER) => {
                        user["count_followers"] = res.data.count_followers;
                        user["isFollowed"] = false;

                        return user;
                    };

                    users && setUsers( (prev) => {
                        if(prev){
                            const newUsers = [ ...prev ];

                            newUsers?.map((user) => 
                                user.id === res.data.id ? delete_follow(user) : user, 
                            )
                            return newUsers;
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
            .catch(error => { });
    };

    const deleteClip = async ( 
        clipId: string, 
        setShowDelete: Dispatch<SetStateAction<any>>
    ) => {
        axios
            .delete(`/api/v1/clip/${clipId}`)
            .then((res) => {
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
                if(user){
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
        
                    if(!user){
                        setMessage("検索を続けるには、ログインが必要です。");
                    }
                }

            }else if(f==="user") {
                if(user){
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
        
                    if(!user){
                        setMessage("検索を続けるには、ログインが必要です。");
                    }
                }
            }
        }
        
    },[searchParams, user])



    return {
        message,
        setMessage,
        user,
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
        search,
        getMoreVlide,
        getMoreClip,
        getMoreUser,
        savedUnsaved,
        likeUnlike,
        shareClip,
        unShareClip,
        followUnfollow,
        destroy,
        deleteClip
    }
};