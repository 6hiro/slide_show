import { useEffect, useRef } from "react";
import { BiLink, BiLock, BiLockOpenAlt, BiTrash } from "react-icons/bi";
import { FaRegWindowMaximize } from "react-icons/fa";

import { ToastNotification } from "../../../types/toast";
import { UPLOADED_IMAGE } from "../../../types/vlide";
import { generateUid } from "../../../utils/uid";



const ShowedImage = (props:{
    image: UPLOADED_IMAGE, 
    notifications: ToastNotification[],
    setNotifications: React.Dispatch<React.SetStateAction<ToastNotification[]>>,
    headerImageUrl: string;
    editHeaderImage: Function;
    setIsPublicImage: Function;
    deleteImage: Function;
}) => {
    const imageRef = useRef<HTMLImageElement>(null);
    useEffect(()=>{}, [props.headerImageUrl])

    return (
        <div className='img_wrapper' >
            <div 
                className="img_link_button"
                onClick={ (e) => {
                    e.preventDefault();
                    if( !(imageRef.current instanceof HTMLImageElement) ) return;

                    navigator.clipboard.writeText(imageRef.current.src)
                        .then( () => {
                            props.setNotifications([...props.notifications, {
                                id: generateUid(),
                                type: "success",
                                message: "画像のリンクをコピーしました。"
                            }])
                        })
                }} 
            >
                <BiLink />
            </div>

            <div className="img_public_button" onClick={ ()=> props.setIsPublicImage(props.image.id, !props.image.is_public)} >
                {props.image.is_public ? <BiLockOpenAlt /> : <BiLock />}
            </div>

            <div className="set_header_button" onClick={() => {props.editHeaderImage(props.image.id)}}>
                
                <FaRegWindowMaximize
                    style={{
                        color: (props.image.url === props.headerImageUrl) ? "#ffa801" :""
                    }}
                />
            </div>

            <div className="img_delete_button" onClick={ ()=> props.deleteImage(props.image.id)} >
                <BiTrash />
            </div>

            <img 
                src={props.image.url} 
                alt="uploaded_img" 
                className='img'
                ref={imageRef}
            />
        </div>
    )
};

export default ShowedImage;