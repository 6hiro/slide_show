import { Dispatch, SetStateAction } from "react";

import axios from "../libs/axios";
import { BLOGCARD, VLIDE } from "../types/vlide";



export const fetchBlogCard = async (
    src: string,
    setBlogCard: (value: React.SetStateAction<BLOGCARD | undefined>) => void
) => {
    // setBlogCard(undefined);

    await axios
        .get(`/api/v1/embed?url=${src}`)
        .then((res) => {
            setBlogCard(res.data);
        })
        .catch((error) => {
        })
        .finally(() => {
        });
};

export const saveUnsaveAsyncVlide = async (
    vlideId:string,
    setVlides: Dispatch<SetStateAction<VLIDE[] | undefined>> | null,
    setVlide: Dispatch<SetStateAction<VLIDE | undefined>> | null
) => {
    axios
    .put(`/api/v1/vlide/${vlideId}/save`,{})
    .then((res) => {
        if( res.data.result === "saved" ) {
            setVlide && setVlide( (prev) => {
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

            setVlides && setVlides( (prev) => {
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
            setVlide && setVlide( (prev) => {
                if(prev && prev.id === res.data.id){
                    const newVlide = Object.assign({}, prev)
                    
                    newVlide.count_saves -= 1;
                    newVlide.is_saved = false;

                    return newVlide;
                }
                return  prev;
            });

            const delete_save = (vlide:VLIDE) => {
                vlide["count_saves"] = res.data.count_saves;
                vlide["is_saved"] = false;
                return vlide;
            };
            setVlides && setVlides( (prev) => {
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

export const deleteAsyncVlide = async (
    vlideId:string,
    onSuccess: Function
) => {
    axios
    .delete(`/api/v1/vlide/${vlideId}`)
    .then((res) => {
        onSuccess(res);
    });
};