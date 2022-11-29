import React, { useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type Props = {
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
};

const DescriptionTextarea = (props: Props) => {
    const maxLength = 160;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    return (
        <div className="desciption_textarea_container">

            <TextareaAutosize
            // <textarea
                id="textarea"
                className="desciption_textarea"
                autoComplete="off"
                spellCheck="false"
                name="text" 
                onChange={(e) => props.setDescription(e.target.value)}
                value={props.description}
                placeholder="内容" 
                minLength={1}
                maxLength={maxLength}
                minRows={1}
                ref={textareaRef}

                onHeightChange={(height) => {
                    if(height > window.innerHeight * 0.35){
                        if(textareaRef.current ){
                            textareaRef.current.style.height = "0px";
                            textareaRef.current.style.height =window.innerHeight * 0.35 + "px";
                        }
                    }
                }}
            />

            <div className="text_count" >
                {props.description.length} / {maxLength}

            </div>
        </div>
    )
};

export default DescriptionTextarea;