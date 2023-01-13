import { useEffect } from 'react';
import { BiImageAdd, BiX } from 'react-icons/bi';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';

import { USER } from '../../types/user';
import { generateUid } from '../../utils/uid';
import { ToastNotification } from '../toastNotification/ToastNotifications';
import useToggle from '../../hooks/useToggle';



type Props = {
    user: USER;
    image: File | null;
    setImage: React.Dispatch<React.SetStateAction<any>>;
    previewImage: string | ArrayBuffer | null;
    setPreviewImage: React.Dispatch<React.SetStateAction<any>>;
    notifications: ToastNotification[];
    setNotifications: React.Dispatch<React.SetStateAction<ToastNotification[]>>;
    uploadImage: Function;
    deleteImage: Function;
    toggleIconForm:(nextValue?: any) => void;
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>
};

const EditIconForm = (props: Props) => {
    const [hasCurrentImg, toggleHasCurrentImg] = useToggle(props.user.file_name ? true : false); // Icon が削除予定か判断するため


    const handleEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };

    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { currentTarget } = e;

        if( !currentTarget.files ) return;
        if(currentTarget.files[0].size/1024/1024 > 2) { // .size: バイト単位
            props.setNotifications([...props.notifications ,{
                id: generateUid(), 
                type:"error", 
                message: "画像のサイズは 2mb 未満にしてください。"
            }] );

            return;
        };
        
        const extension = currentTarget.files[0].name.split('.').pop();
        
        if(extension === "jpeg" || extension === "png" || extension === "jpg"){
            props.setImage(e.target.files![0]);
            const reader = new FileReader();
            // fileの処理
            reader.readAsDataURL(e.target.files![0]);
            reader.onload = (readerEvent) => {
                props.setPreviewImage(reader.result)
            }
            toggleHasCurrentImg(true);
        }else {
            props.setNotifications([...props.notifications ,{
                id: generateUid(), 
                type:"error", 
                message: "画像の種類は jpeg, png, jpg のいずれかにしてください"
            }] );

        }
    }

    const deleteUploadingImage = () => {
        props.setImage(null);
        props.setPreviewImage(null);
        toggleHasCurrentImg(false);
    }

    const submit = async(e: any) => {
        e.preventDefault();

        if(!props.image && props.user.file_name) {
            props.deleteImage(
                props.user.id,
                props.setNotifications,
                props.refetch
            );
        }else{
            await props.uploadImage(
                props.setNotifications,
                props.refetch,
                {id: props.user.id, image: props.image }
            )
        }
    }

    useEffect(() => {
    }, [props.user]);

    return (
        <div className="editIconForm" >
            <div className="overlay" onClick={props.toggleIconForm}></div>
            <div className="formContainer" >
                <div className="closeForm" onClick={props.toggleIconForm} ><BiX/></div>
                <div className="form" >
                    <div className='img_container' >
                        {(props.user.file_name || props.previewImage) && hasCurrentImg
                            ?   <div className='img_preview_container'>
                                    <div className="img_preview">
                                        <div 
                                            className="img_preview__x_icon"
                                            onClick={deleteUploadingImage}
                                        >
                                            <BiX />
                                        </div>
                                        <img 
                                            onClick={handleEditPicture} 
                                            src={  props.previewImage ? String(props.previewImage) : `${props.user.file_name}` } 
                                            alt="preview image" 
                                            className="img" 
                                        />
                                    </div>
                                </div>
                            : null
                        }
                        <div className="img_add" onClick={handleEditPicture} >
                            <BiImageAdd />
                        </div> 
                        <input 
                            type="file" id="imageInput" accept="image/*"
                            onChange={(e) =>addImage(e)} 
                            hidden 
                        />
                    </div>
                    <div className='rules'>
                        <div className="rule" >
                            <span> ファイルサイズは 2 MB までです</span>
                        </div>    
                        <div className="rule" >
                            <span> jpeg, png, jpg に対応しています</span>
                        </div>    
                    </div>



                    <button
                        type='submit'
                        disabled={ !props.image && !props.user.file_name }
                        onClick={(e)=>submit(e)}
                    >
                        アイコンを変更
                    </button>
                </div>
            </div>
        </div>
    )
};

export default EditIconForm;