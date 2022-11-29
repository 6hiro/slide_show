import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import axios from "../libs/axios";
import { CLIP } from "../types/clip";
import { USER } from "../types/user";
import { VLIDE } from "../types/vlide";
import { useAuth } from "./useAuth";

type Props = {
    username: string | undefined;
}
export const useProf = (props: Props) => {
    const { user, isLoading } = useAuth();

    let navigate = useNavigate();
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [section, setSection] = useState<string>();
    const [isLoadingProf, setIsLoadingProf] = useState<boolean>(true);
    const [isLoadingContents, setIsLoadingContents] = useState<boolean>();


    const [prof, setProf] = useState<USER>();

    const [vlideNextPageLink, setVlideNextPageLink] = useState<string>();
    const [clipNextPageLink, setClipNextPageLink] = useState<string>();
    const [userNextPageLink, setUserNextPageLink] = useState<string>();

    const [vlides, setVlides] = useState<VLIDE[]>();
    const [clips, setClips] = useState<CLIP[]>();
    const [users, setUsers] = useState<USER[]>();


    const getUser = () => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setIsLoadingContents(true);
        setProf(undefined);

        axios
            .get(`/api/v1/user/${props.username}`)
            .then((res) => {
                setProf(res.data.data);
            });
        setIsLoadingProf(false);
    };     

   
    const getVlides =  (userId: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setIsLoadingContents(true);

        axios
            .get(`/api/v1/user/${userId}/vlides`)
            .then((res) => {
                setVlides(res.data.data);
                setVlideNextPageLink(res.data.next_page_link);
                setIsLoadingContents(false);
            })
            .catch((error) => {
                setIsLoadingContents(false);
            });
    };

    const getBookmarks = (userId: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setIsLoadingContents(true);

        axios
            .get(`/api/v1/user/${userId}/saves`)
            .then((res) => {
                setVlides(res.data.data);
                setVlideNextPageLink(res.data.next_page_link);
                setIsLoadingContents(false);
            })
            .catch((error) => {
                setIsLoadingContents(false);
            });
    };

    const getClips = (userId: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setIsLoadingContents(true);

        axios
            .get(`/api/v1/user/${userId}/clips`)
            .then((res) => {
                setIsLoadingContents(false);
                setClips(res.data.data);
                setClipNextPageLink(res.data.next_page_link);
            })
            .catch((error) => {
                setIsLoadingContents(false);
            });
    };

    const getLikes = (userId: string) => {
        setVlides([]);
        setVlideNextPageLink("");
        setClips([]);
        setClipNextPageLink("");
        setIsLoadingContents(true);

        axios
            .get(`/api/v1/user/${userId}/likes`)
            .then((res) => {
                setClips(res.data.data);
                setClipNextPageLink(res.data.next_page_link);
                setIsLoadingContents(false);

            })
            .catch((error) => {
                setIsLoadingContents(false);
            });
    };

    const getMoreVlides = () => {
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

    const getMoreClips = () => {
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

    const getMoreUsers= () => {
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

    const getFollowings = (userId: string) => {
        setUsers([]);
        setUserNextPageLink("");

        axios
            .get(`/api/v1/user/followings/${userId}`)
            .then((res) => {
                setUserNextPageLink(res.data.next_page_link);
                setUsers(res.data.data);
            })
            .catch((error) => {});
    };

    const getFollowers = (userId: string) => {
        setUsers([]);
        setUserNextPageLink("");

        axios
            .get(`/api/v1/user/followers/${userId}`)
            .then((res) => {
                setUserNextPageLink(res.data.next_page_link);
                setUsers(res.data.data);
            })
            .catch((error) => {});
    };

    const updateProf = (nickName: string, description: string) => {
        axios
            .patch(`/api/v1/user/prof`,{
                nick_name: nickName,
                description: description.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n')
            })
            .then((res) => {

                prof && setProf( (prev) => {
                    if(prev){
                        return {
                            ...prev,
                            nick_name: res.data.nick_name,
                            description: res.data.description
                          };
                    }
                    return prev;
                });

                clips && setClips( (prev )=> {
                    if(prev){
                        const newClips = [ ...prev ];
                        
                        newClips?.map((clip) => {
                            if(clip.clip_type==="reclip"){
                                if(clip.parent?.user.id === res.data.user_id){
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

                vlides && setVlides( (prev )=> {
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

            });
    };

    const destroy = async ( 
        vlideId: string,
        setShowDelete: Dispatch<SetStateAction<any>>
    ) => {
        axios
            .delete(`/api/v1/vlide/${vlideId}`)
            .then((res) => {
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
            .catch(error => {})
    }

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

                    const delete_save = (vlide:VLIDE) => {
                        vlide["count_saves"] = res.data.count_saves;
                        vlide["is_saved"] = false;
                        return vlide;
                    };

                    vlides && setVlides( (prev) => {
                        if(prev){
                            const newVlides = [ ...prev ];

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

                    clips && setClips( (prev) => {
                        if(prev){
                            const newClips = [ ...prev ];

                            newClips?.map((clip) => {
      
                                if(clip.clip_type==="reclip"){
                                    if(clip.parent?.id === res.data.id){
                                        clip.parent.count_likes += 1
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

                    clips && setClips( (prev) => {
                        if(prev){
                            const newClips = [ ...prev ];

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

    
    const shareClip = async (clipId: string) => {
        await axios
            .post(`/api/v1/clip/share/${clipId}`, {})
            .then((res) => {
                if(clips && section==="clips" && user.name === props.username){
                    setClips([res.data, ...clips]);
                }
            });
    };

    const unShareClip = async (clipId: string) => {
        await axios
            .post(`/api/v1/clip/unshare/${clipId}`, {})
            .then((res) => {
                if(clips && section==="clips" && user.name === props.username){

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
                return res.data;
            });
    };

    const followUnfollow = (userId: string) => {
        axios
            .put(`/api/v1/user/${userId}/follow`,{})
            .then((res) => {
                if( res.data.result === "followed" ) {

                    if(user.id === prof?.id && user.id !== res.data.id) {
                        setProf((prev) => {
                            const newProf = Object.assign({}, prev);
                            newProf.count_followings += 1;
 
                            return newProf;
                        });
                    }

                    if(user.id !== prof?.id && prof?.id === res.data.id) {
                        setProf((prev) => {
                           const newProf = Object.assign({}, prev);
                            
                            newProf.count_followers += 1;
                            newProf.isFollowed = true;

                            return newProf;
                        })
                    }
                    
                    const add_follow = (user:USER) => {
                        user["count_followers"] += 1;
                        user["isFollowed"] = true;
                        return user;
                    };

                    users && setUsers( (prev) => {
                        if(prev){
                            const newUsers = [ ...prev ];

                            newUsers?.map((user) => 
                                user.id === res.data.id ? add_follow(user) : user, 
                            );
                            return newUsers;
                        }else{
                            return prev;
                        }
                    });
                }else if(res.data.result === "unfollowed") {

                    if(user.id === prof?.id && user.id !== res.data.id) {
                        setProf((prev) => {
                            const newProf = Object.assign({}, prev);
                            newProf.count_followings -= 1;
 
                            return newProf;
                        });
                    }

                    if(user.id !== prof?.id && prof?.id === res.data.id) {
                        setProf((prev) => {
                           const newProf = Object.assign({}, prev);
                            
                            newProf.count_followers -= 1;
                            newProf.isFollowed = false;

                            return newProf;
                        })
                    }
                    const delete_follow = (user:USER) => {
                        user["count_followers"] -= 1;
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

    // URL の query を変える
    const changeSection = (sectionName: string) => {
        setSection(sectionName);
        if(prof){
            if(sectionName==="vlides"){
                navigate(`/prof/${prof.name}`);
            }else if(sectionName==="clips" ){
                navigate(`/prof/${prof.name}?f=clips`);
            }else if(sectionName==="bookmarks" ){
                navigate(`/prof/${prof.name}?f=bookmarks`);
            }else if(sectionName==="likes" ){
                navigate(`/prof/${prof.name}?f=likes`);
            }
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
                }else if(f==="likes") {
                    setSection('likes')
                    getLikes(prof.id);
                }
            }
        }
        
    }, [searchParams, prof?.name]);

    return {
        user,
        isLoading,
        prof, 
        isLoadingProf,
        isLoadingContents,
        vlides,
        vlideNextPageLink,
        clips,
        clipNextPageLink,
        users,
        userNextPageLink,
        section,
        setSection,
        changeSection,
        getVlides,
        getFollowings,
        getFollowers,
        getBookmarks,
        getClips,
        getLikes,
        getMoreVlides,
        getMoreClips,
        getMoreUsers,
        updateProf,
        destroy,
        deleteClip,
        savedUnsaved,
        likeUnlike,
        shareClip,
        unShareClip,
        followUnfollow
    };

};