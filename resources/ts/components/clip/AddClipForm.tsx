import React from 'react';
// import { BiImage, BiX } from 'react-icons/bi';
import TextareaAutosize from 'react-textarea-autosize';

import DecoratedInput from './DecoratedInput';



const AddClipForm:React.FC<{
    quote: string | null;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    image: File | null;
    setImage: React.Dispatch<React.SetStateAction<any>>;
    previewImage: string | ArrayBuffer | null;
    setPreviewImage: React.Dispatch<React.SetStateAction<any>>;
    addClip: (e: React.MouseEvent<HTMLElement>) => void;
    placeholder?: string;
    button?: string;
    autoFocus: boolean;
}> = (props) => {

    // const [height, setHeight] = useState(0);
    // useEffect(()=>{
    //     const textarea = document.getElementById('textarea')
    //     if(textarea){
    //         setHeight(textarea.clientHeight)
    //     }
    // }, [props.setImage])
    
    // const handleEditPicture = () => {
    //     const fileInput = document.getElementById("imageInput");
    //     fileInput?.click();
    // };

    // const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     props.setImage(e.target.files![0]);
    //     const reader = new FileReader();
    //     // if (e.target.files) {
    //         // fileの処理
    //         reader.readAsDataURL(e.target.files![0]);
    //         // reader.readAsDataURL(e.currentTarget.files[0])
    //         reader.onload = (readerEvent) => {
    //         //   if(reader.readyState === 2){
    //             props.setPreviewImage(reader.result)
    //             // props.setSelectedFile(readerEvent.target?.result)
    //         //   }
    //         }
    //     // }
    // }

    // const deleteImage = () => {
    //     const fileInput = document.getElementById("imageInput");
    //     // if(fileInput){
    //         // fileInput.value =null
    //         props.setImage(null);
    //         props.setPreviewImage(null);
    //     // }
    // }
    const maxLength = 400;

    
    return (
        // decorated_textとtextareaを重ね、入力値を装飾する
        <div className="decoTextarea">
            <div style={{maxHeight: "220px", overflow: "scroll", position: "relative"}}>
                <div className="decorated_text" >
                    <DecoratedInput input={props.text} />
                </div>

                {/* TextareaAutosizeを用いることで、decorated_textブロックとの整合性を保つ */}
                <TextareaAutosize
                    id="textarea"
                    className="textarea"
                    autoComplete="off"
                    spellCheck="false"
                    name="text" 
                    onChange={(e) => props.setText(e.target.value)} 
                    value={props.text} 
                    placeholder={props.placeholder ? props.placeholder :`ひとこと。`}
                    autoFocus={props.autoFocus}
                    minLength={1}
                    maxLength={maxLength}
                    // setText(e.target.value.replace(/(\r\n){2,}|\r{2,}|\n{2,}/, '\n'))}
                />
            </div>


            {/* {props.previewImage &&
                <div className="img_section">
                    <div 
                        className="img_section__x_icon"
                        onClick={deleteImage}
                    >
                        <BiX />
                    </div>
                    <img src={String(props.previewImage)} alt="selected image" className="img" />
                </div>
            } */}

            <div className="decoTextarea__options">
                <div className="decoTextarea__option">
                    <div>
                        {props.text.length} / {maxLength}
                    </div>
                    {/* <div className="add_img_button" onClick={handleEditPicture} >
                        <BiImage />
                        <input 
                            type="file" id="imageInput" accept="image/*"
                            onChange={(e) =>addImageToPost(e)} 
                            hidden 
                        />
                    </div> */}
                </div>

                <button 
                    className="add_clip_button"
                    onClick={(e) => {
                        props.addClip(e);
                    }}
                    disabled={!props.text.trim() && !props.quote}
                >
                    {props.button ? props.button :"クリップ"}
                </button>

            </div>

        </div>

    )
};

export default AddClipForm;