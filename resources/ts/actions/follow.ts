import { Dispatch, SetStateAction } from "react";

import axios from "../libs/axios";
import { USER } from "../types/user";



export const putAsyncFollowUnfollow = async (
    targetId: string,
    loginId: string,
    users: {
        users: USER[] | undefined,
        setUsers: Dispatch<SetStateAction<USER[] | undefined>>,
    },
    // プロフィールが画面に表示されている場合に使う
    prof?: {
        prof: USER | undefined,
        setProf: Dispatch<SetStateAction<USER | undefined>>,
    }
) => {

    await axios
        .put(`/api/v1/user/${targetId}/follow`,{})
        .then((res) => {

            if( res.data.result === "followed" ) {
                const add_follow = (user:USER) => {
                    user["count_followers"] += 1;
                    user["isFollowed"] = true;
                    return user;
                };

                users?.setUsers( (prev) => {
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

                if(prof?.prof) {
                    // プロフィールがログインユーザーかどうかで、フォロー数、フォロー数のどちらを変化させるか判断
                    if(loginId === prof.prof.id && loginId !== res.data.id) {
                        prof?.setProf((prev) => {
                            const newProf = Object.assign({}, prev);
                            newProf.count_followings += 1;

                            return newProf;
                        });
                    }

                    if(loginId !== prof.prof.id && prof.prof.id === res.data.id) {
                        prof?.setProf((prev) => {
                        const newProf = Object.assign({}, prev);
                            
                            newProf.count_followers += 1;
                            newProf.isFollowed = true;

                            return newProf;
                        })
                    }
                }

            }else if(res.data.result === "unfollowed") {
                const delete_follow = (user:USER) => {
                    user["count_followers"] -= 1;
                    user["isFollowed"] = false;

                    return user;
                };

                users.setUsers( (prev) => {
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

                if(prof?.prof) {
                    if(loginId === prof.prof.id && loginId !== res.data.id) {
                        prof?.setProf((prev) => {
                            const newProf = Object.assign({}, prev);
                            newProf.count_followings -= 1;
    
                            return newProf;
                        });
                    }
    
                    if(loginId !== prof.prof.id && prof.prof.id === res.data.id) {
                        prof?.setProf((prev) => {
                           const newProf = Object.assign({}, prev);
                            
                            newProf.count_followers -= 1;
                            newProf.isFollowed = false;
    
                            return newProf;
                        })
                    }
                }

            }
        });
};