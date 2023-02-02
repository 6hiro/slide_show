import React from 'react';

import { handleFocus } from '../../../utils/markdown-wysiwyg/inputElements/event/onFocus';



type Props = {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    autoFocus: boolean;
}
const TitleInput = (props: Props) => {
    const maxLength = 50;
    return (
        <div className="title_input" >
            <input 
                type="text" 
                value={props.title}
                onChange={e => props.setTitle(e.target.value)}
                placeholder='タイトル' 
                required 
                autoFocus={props.autoFocus} 
                maxLength={maxLength}
                onFocus={()=>handleFocus("title")}
            />

            <div className="text_count" >
                {props.title.length} / {maxLength}
            </div>
        </div>
    )
}

export default TitleInput;