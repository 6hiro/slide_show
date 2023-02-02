import React from 'react'
import { BiCloudUpload, BiX } from 'react-icons/bi';

import { ToastNotification } from '../../../types/toast';
import { UPLOADED_IMAGE } from '../../../types/vlide';
import { generateUid } from '../../../utils/uid';
import ShowedImage from './ShowedImage';



type Props = {
    image: File | null;
    setImage: React.Dispatch<React.SetStateAction<any>>;
    previewImage: string | ArrayBuffer | null;
    setPreviewImage: React.Dispatch<React.SetStateAction<any>>;
    imageGallery: UPLOADED_IMAGE[];
    setImageGallery: React.Dispatch<React.SetStateAction<UPLOADED_IMAGE[]>>;
    headerImageUrl: string;
    setHeaderImageUrl: React.Dispatch<React.SetStateAction<string>>;
    isShowedImgMenu: boolean;
    setIsShowedImgMenu: React.Dispatch<React.SetStateAction<boolean>>;
    notifications: ToastNotification[];
    setNotifications: React.Dispatch<React.SetStateAction<ToastNotification[]>>;
    uploadImage: Function;
    deleteImage: Function;
    editHeaderImage: Function;
    setIsPublicImage: Function;
    vlideId: string;
}

const ImageMenu = (props: Props) => {

    const handleEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };

    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { currentTarget } = e;

        if( !currentTarget.files ) return;
        console.log(currentTarget.files[0].size/1024/1024)
        if(currentTarget.files[0].size/1024/1024 > 8) { // .size: バイト単位
            props.setNotifications([...props.notifications ,{
                id: generateUid(), 
                type:"error", 
                message: "画像のサイズは 8 MB 未満にしてください。"
            }] );

            return;
        };
        
        const extension = currentTarget.files[0].name.split('.').pop();
        
        if(extension === "jpeg" || extension === "png" || extension === "gif" || extension === "jpg"){
            props.setImage(e.target.files![0]);
            const reader = new FileReader();
            if (e.target.files) {
                // fileの処理
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = (readerEvent) => {
                //   if(reader.readyState === 2){
                    // console.log(reader.result)
                    props.setPreviewImage(reader.result)
                    // props.setSelectedFile(readerEvent.target?.result)
                //   }
                }
            }
        }else {
            props.setNotifications([...props.notifications ,{
                id: generateUid(), 
                type:"error", 
                message: "画像の種類は jpeg, png, jpg, gif のいずれかにしてください"
            }] );

        }
    }
    const uploadImage = async() => {
        await props.uploadImage(
            props.notifications,
            props.setNotifications,
            props.setImage,
            props.setPreviewImage,
            {id: props.vlideId, image: props.image }
        )
    }

    const deleteUploadingImage = () => {
        props.setImage(null);
        props.setPreviewImage(null);
    }

    const deleteImage = async(imageId: string) => {
        props.deleteImage(
            imageId,
            props.vlideId,
            props.notifications,
            props.setNotifications,
        )
    }

    const editHeaderImage = async(imageId: string) => {
        props.editHeaderImage(
            imageId,
            props.vlideId,
            props.notifications,
            props.setNotifications,
        )

    }
    const setIsPublicImage = async(imageId: string, is_public: boolean) => {
        props.setIsPublicImage(
            imageId,
            is_public,
            props.notifications,
            props.setNotifications,
        )
    }


    return (
        <div className='image_menu_container'>
            
            <div className={`${props.isShowedImgMenu ? "overlay" : ""}`} onClick={() =>props.setIsShowedImgMenu(false)}></div>
            {props.isShowedImgMenu 
                ? <div className="img_menu" >
                    <div className='img_menu__reference'>
                        <div className='img_menu__reference__x' onClick={() => props.setIsShowedImgMenu(false)}>
                            <BiX />
                        </div>

                        {props.previewImage &&
                            <div className="img_preview_container">

                                <div className="img_preview">
                                    <div 
                                        className="img_preview__x_icon"
                                        onClick={deleteUploadingImage}
                                    >
                                        <BiX />
                                    </div>
                                    <img src={String(props.previewImage)} alt="selected image" className="img" />
                                </div>
                                <div 
                                    className="upload__image_button" 
                                    onClick={uploadImage}
                                >
                                    画像をアップロードする
                                </div>
                            </div>
                        }

                        <div className='img_menu__reference__gallery'>
                            <div className='img_wrapper add_img' onClick={handleEditPicture} >
                                <div>
                                    <BiCloudUpload />
                                </div>
                                <div>
                                    <div className='text' >画像を追加</div>
                                    <div className='rules'>
                                        <div className="rule" >
                                                <span> ファイルサイズは 8 MB までです</span>
                                            </div>    
                                            <div className="rule" >
                                                <span> jpeg, png, jpg, gif に対応しています</span>
                                            </div>    
                                        </div>
                                    </div>

                                <input 
                                    type="file" id="imageInput" accept="image/*"
                                    onChange={(e) =>addImage(e)} 
                                    hidden 
                                />
                            </div>

                            {props.imageGallery.map((image, i) => 
                                <ShowedImage
                                    key={i} 
                                    image={image} 
                                    notifications={props.notifications}
                                    setNotifications={props.setNotifications} 
                                    headerImageUrl={props.headerImageUrl}
                                    editHeaderImage={editHeaderImage}
                                    setIsPublicImage={setIsPublicImage}
                                    deleteImage={deleteImage}
                                />
                            )}
                        </div>
                    </div>
                </div>
                :null
            }

        </div>
    )
};

export default ImageMenu;
