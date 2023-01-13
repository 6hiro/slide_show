import React, { useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import DecoratedInput from '../clip/DecoratedInput';



type Props = {
    description: string;
    maxLength: number;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
};

const DescriptionTextarea = (props: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    return (
        <div className="desciption_textarea_container">

            <div className="decorated_textarea">
                <div className="decorated_desciption" >
                    <DecoratedInput input={props.description} />
                </div>

                {/* TextareaAutosizeを用いることで、decorated_textブロックとの整合性を保つ */}
                <TextareaAutosize
                    id="textarea"
                    className="desciption_textarea"
                    autoComplete="off"
                    spellCheck="false"
                    name="text" 
                    onChange={(e) => props.setDescription(e.target.value)}
                    value={props.description}
                    placeholder="内容" 
                    minLength={1}
                    maxLength={props.maxLength}
                    minRows={1}
                    ref={textareaRef}
                />
            </div>

        </div>
    )
};

export default DescriptionTextarea;