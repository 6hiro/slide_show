// https://github.com/taylorotwell/next-example-frontend/blob/master/src/hooks/auth.js
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';

import axios from '../libs/axios';
import { NEW_VLIDE, UPDATE_VLIDE, UPLOADED_IMAGE, UPLOAD_AUDIO, UPLOAD_IMAGE } from '../types/vlide';
import { generateUid } from '../utils/uid';
import { deleteAsyncImage, uploadAsyncImage } from '../actions/image';
import { ToastNotification } from '../types/toast';



export const useDraftVlide = () => {
    let navigate = useNavigate();
    const processing: React.MutableRefObject<boolean> = useRef<boolean>(false);

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>("");
    const [tagList, setTagList] = useState<string[]>([]);
    const [durationTime, setDurationTime] = useState<number>(0);
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [countClips, setCountClips] = useState<boolean>(false);
    const [headerImageUrl, setHeaderImageUrl] = useState<string>("");
    const [audio, setAudio] = useState<File | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [src, setSrc] = useState<string | null>("");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageGallery, setImageGallery] = useState<{id: string, url: string, is_public: boolean}[]>(([]));
 

    const retrieveForDraft = async(vlideId: string) => {
        setIsLoading(true);

        axios
            .get(`/api/v1/vlide/${vlideId}/draft`)
            .then((res: AxiosResponse<any, any>) => {
                const data = res.data;
                setTitle(data.title)
                setContent(data.content ? data.content : "");
                setTagList(data.tags.map( 
                    (tag: {id:string, name:string}) => tag["name"])
                );
                setIsPublic(data.is_public);
                setDurationTime(data.duration);
                setIsSaved(data.is_saved)

                setSrc(data.audio_file_name);

                setHeaderImageUrl(data.header_file_name)
                setImageGallery([...data.images])

                setIsLoading(false);
            });
    };

    const create = async (
        setToastNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        { ...props }: NEW_VLIDE
    ) => {
        if (processing.current) return;
        processing.current = true;

        await axios
            .post('/api/v1/vlide', props)
            .then(res => {
                res.data.id && navigate(`/drafts/vlide/${res.data.id}`);
            })
            .catch(error => {
                if(error.response.data.status === "over") {
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"warning", message:"作成できる投稿数を超えています"},
                        ];
                    });
                }else{
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"warning", message:"投稿に失敗しました"},
                        ];
                    });
                }

            })
            .finally(()=>{
                processing.current = false;
            });
    };

    const uploadImage = async (
        notifications: ToastNotification[],
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        // processing: React.MutableRefObject<boolean>, 
        setImage: React.Dispatch<React.SetStateAction<File | null>>,
        setPreviewImage: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>,
        {...props}: UPLOAD_IMAGE
    ) => {
        let uploadData = new FormData();
        uploadData.append('image', props.image, props.image.name);
        if (processing.current) return;
        processing.current = true;
        const onSuccess = (res: any) => {
            setNotifications([...notifications ,{id: generateUid(), type:"success", message:"画像をアップロードしました。"}] );    
            const filePath: string = "/api/v1/image?f=" + res.data.filePath;
            const updatedImage = {id: String(res.data.id), url: filePath, is_public: false }
            setImageGallery([updatedImage, ...imageGallery])
            setImage(null);
            setPreviewImage(null); 

        }
        const onError = (err: any) => {
            setNotifications([...notifications ,{
                id: generateUid(), 
                type:"error", 
                message:  err.response.data.message === "over" 
                    ? "画像数が上限に達しています。" 
                    : "画像のアップロードに失敗しました。"
            }] );
        }

        uploadAsyncImage(`/api/v1/vlide/${props.id}/image`, uploadData, processing, onSuccess, onError)
    };

    const editHeaderImage = async (
        imageId: string,
        vlideId: string,
        notifications: ToastNotification[],
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
    ) => {
        if (processing.current) return;
        processing.current = true;

        await axios
            .put(`/api/v1/vlide/${vlideId}/image/${imageId}`, {})
            .then(res => {
                if(res.data.url === headerImageUrl){
                    setHeaderImageUrl("");
                    setNotifications([
                        ...notifications ,
                        {id: generateUid(), type:"success", message:"ヘッダーを削除しました。"}
                    ] );        

                }else{
                    setHeaderImageUrl(res.data.url);
                    setNotifications([
                        ...notifications ,
                        {id: generateUid(), type:"success", message:"ヘッダーを設定しました。"}
                    ] );   
                }
            })
            .catch((error) => {
                processing.current = false;
                setNotifications([...notifications ,{
                    id: generateUid(), 
                    type:"error", 
                    message: "ヘッダーの変更に失敗しました。"
                }] );
            })
            .finally(()=>{
                processing.current = false;
            });
    }

    const setIsPublicImage = async (
        imageId: string,
        is_public: boolean,
        notifications: ToastNotification[],
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
    ) => {
        if (processing.current) return;
        processing.current = true;

        await axios
            .put(`/api/v1/vlide/image/${imageId}`, {is_public: is_public})
            .then(res => {
                const editIsPublic = (image: UPLOADED_IMAGE) => { // 投稿の保存数と保存をしたかどうかを変更
                    image["is_public"] = !image["is_public"];
                    return image;
                }

                setImageGallery( (prev) => {
                    if(prev){
                        const newImages = [ ...prev ]

                        newImages?.map((img) => 
                            img.id === imageId ? editIsPublic(img) : img, 
                        )
                        return newImages;
                    }else{
                        return prev;
                    }
                });
                console.log(res.data.is_public)
                
                if(res.data.is_public){
                    setNotifications([...notifications ,{id: generateUid(), type:"success", message:"画像を公開しました。"}] );
                }else{
                    setNotifications([...notifications ,{id: generateUid(), type:"success", message:"画像を非公開にしました。"}] );
                }   
            })
            .catch((error) => {
                processing.current = false;
                setNotifications([...notifications ,{
                    id: generateUid(), 
                    type:"error", 
                    message: "画像情報の変更に失敗しました。"
                }] );
            })
            .finally(()=>{
                processing.current = false;
            });
    }
    const deleteImage = async (
        imageId: string,
        vlideId: string,
        notifications: ToastNotification[],
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        // setSrc: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        if (processing.current) return;
        processing.current = true;
        const onSuccess = (res: any) => {
            setNotifications([...notifications ,{id: generateUid(), type:"success", message:"画像の削除が完了しました。"}] );    
            setImageGallery(imageGallery.filter((img) => {
                return img.id !== imageId;
            }))
        }
        const onError = (err: string) => {
            setNotifications([...notifications ,{
                id: generateUid(), 
                type:"error", 
                message: "画像の削除に失敗しました。"
            }] );
        }

        deleteAsyncImage(`/api/v1/vlide/${vlideId}/image/${imageId}`, processing, onSuccess, onError)
    };

    const uploadAudio = async (
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        setSrc: (value: React.SetStateAction<string | null>) => void,
        {...props}: UPLOAD_AUDIO
    ) => {
        let uploadData = new FormData();
        uploadData.append('audio', props.audio, props.audio.name);

        if (processing.current) return;
        processing.current = true;

        const res =  await axios.post(
            `/api/v1/vlide/${props.id}/audio`, 
            uploadData,
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json",
                    'content-type': 'multipart/form-data',
                },
                withCredentials: true
            }
        )
        .then((res) => {
            setNotifications(prev => {
                return [...prev ,{
                    id: generateUid(), 
                    type:"success", 
                    message: "音声のアップロードしました。"
                }] 
            });

            const filePath = "/api/v1/audio?f=" + res.data.filePath;
            setSrc(filePath);
        })
        .catch((error) => {
            setNotifications(prev => {
                return [...prev ,{
                    id: generateUid(), 
                    type:"error", 
                    message: "音声のアップロードに失敗しました。"
                }] 
            });
        })
        .finally(()=>{
            processing.current = false;
        });
    };

    const deleteAudio = async (
        vlideId: string,
        audioId: string,
        setSrc: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        if (processing.current) return;
        processing.current = true;

        await axios
            .delete(`/api/v1/vlide/${vlideId}/audio`)
            .then(res => {
                setIsLoading(false);
                setSrc("");
            })
            .catch((error) => {
                if (error.response.status !== 422) throw error;
            })
            .finally(()=>{
                processing.current = false;
            });
    };

    const update = async (
        setToastNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        { ...props }: UPDATE_VLIDE
    ) => {
        if (processing.current) return;
        processing.current = true;

        axios
            .put(`/api/v1/vlide/${props.vlide_id}`, props)
            .then((res) => {
                // router.push(`/drafts/vlide/${id}`)
                setToastNotifications(prev => {
                    return[
                        ...prev,
                        {id: generateUid(), type:"success", message:"投稿を更新しました"},
                    ];
                });
            })
            .catch(error => {
                setToastNotifications(prev => {
                    return[
                        ...prev,
                        {id: generateUid(), type:"error", message:"更新が失敗しました"},
                    ];
                });
            })
            .finally(()=>{
                processing.current = false;
            });
    }


    return {
        title,
        setTitle,
        content, 
        setContent,
        isPublic,
        setIsPublic,
        isSaved,
        countClips,
        tagList,
        setTagList,
        durationTime,
        setDurationTime,
        audio,
        setAudio,
        src, 
        setSrc,
        headerImageUrl,
        setHeaderImageUrl,
        imageGallery,
        setImageGallery,
        currentTime, 
        setCurrentTime,
        isRunning, 
        setIsRunning,
        isLoading,
        setIsLoading,
        retrieveForDraft,
        create,
        uploadImage,
        deleteImage,
        editHeaderImage,
        setIsPublicImage,
        uploadAudio,
        deleteAudio,
        update,
    }
};