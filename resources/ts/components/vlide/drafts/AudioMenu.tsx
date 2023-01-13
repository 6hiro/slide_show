import React, { useRef } from 'react'
import { BiHeadphone, BiMessageError, BiX } from 'react-icons/bi';

import { generateUid } from '../../../utils/uid';
import { ToastNotification } from '../../toastNotification/ToastNotifications';



type Props = {
    isShowedAudioMenu: boolean;
    setIsShowedAudioMenu: React.Dispatch<React.SetStateAction<boolean>>;
    vlide_id: string;
    src: string | null;
    setSrc: React.Dispatch<React.SetStateAction<string | null>>;
    // handleChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    setAudio: React.Dispatch<React.SetStateAction<File | null>>
    uploadAudio: Function;
    deleteAudio: Function;
    notifications: ToastNotification[];
    setNotifications: React.Dispatch<React.SetStateAction<ToastNotification[]>>;
};

const AudioMenu = (props: Props) => {
    const audioInputRef = useRef<HTMLInputElement | null>(null);
// console.log(props.src)
    const handleEditAudio = () => {
        audioInputRef.current?.click();
    };
        // ファイルがアップロードされたときの処理
        const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => { 
    
            const { currentTarget } = e;
    
            if( !currentTarget.files ){
                return;
            }
    
            props.setAudio( currentTarget.files[0]);
            
            const extension = currentTarget.files[0].name.split('.').pop();
    
            if(extension === "mp3" || extension === "aac" || extension === "m4a"){
    
                // https://stackoverflow.com/questions/3717793/javascript-file-upload-size-validation
                if(!props.vlide_id || currentTarget.files[0].size/1024/1024 > 25){ // .size: バイト単位
                    props.setNotifications(prev => {
                        return [...prev ,{
                            id: generateUid(), 
                            type:"error", 
                            message: "画像のサイズは 15mb 未満にしてください。"
                        }] 
                    });
                }else{
                    const packet = { id: props.vlide_id, audio: currentTarget.files[0] };
                    await props.uploadAudio(props.setNotifications, props.setSrc, packet);
                }
    
            }else{
                props.setNotifications(prev => {
                    return [...prev ,{
                        id: generateUid(), 
                        type:"error", 
                        message: "画像の種類は mp3, aac, m4a のいずれかにしてください"
                    }] 
                });
            }
        };
    
    return (
        <div className='audio_menu_container'>
            <div className={`${props.isShowedAudioMenu ? "overlay" : ""}`} onClick={() =>props.setIsShowedAudioMenu(false)}></div>

            {props.isShowedAudioMenu ?

                <div className="audio_menu">

                    <div className='audio_menu__x' onClick={() => props.setIsShowedAudioMenu(false)}>
                        <BiX />
                    </div>
                    <input 
                            type="file"
                            id="audioInput"
                            className="audioInput"
                            ref={audioInputRef}
                            hidden 
                            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
                            // https://www.iana.org/assignments/media-types/media-types.xhtml#audio
                            // https://webbibouroku.com/Blog/Article/html5-file-accept
                            accept="audio/mp4,audio/x-m4a,audio/aac,.mp3" 
                            // accept=".mpeg,.mpga,.mp3,.wav" 
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleChangeFile(e) } 
                        />

                    <div
                        onClick={() => {
                            // if(!props.isLoading) 
                            handleEditAudio();
                        }}
                        className="add_audio_button"
                    >
                        <BiHeadphone />
                        音声をアップロードする
                    </div>
                    {props.src && props.src.length > 16 && props.vlide_id
                        ?   <div className='audio_delete_button_wrapper'>

                                <div
                                    onClick={() => {
                                        props.src && props.deleteAudio(props.vlide_id ,props.src.split("=")[1], props.setSrc);
                                    }}
                                    className="audio_delete_button"
                                >
                                    <BiHeadphone />
                                    音声を削除する
                                </div>
                            </div>
                        : null                                        
                    }
                    <div className="rule" >
                        <BiMessageError />
                        <span> ファイルサイズは 25 MB までです</span>
                    </div>    
                    <div className="rule" >
                        <BiMessageError />
                        <span> mp3, aac に対応しています</span>
                    </div>    


                </div>
                :null

            }
        </div>
    )
};

export default AudioMenu;