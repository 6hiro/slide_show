import React, { useEffect, useRef } from 'react';


type AutoSizeTextareaProps = {
    content:string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

const AutoSizeTextarea = ( props: AutoSizeTextareaProps) => {
    // const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    
    return (
        <div className="textareaWrapper">
            <textarea 
                id='textarea'
                className="textarea"
                style={{
                    resize:"none"
                }}
                spellCheck="false" 
                autoComplete="off"
                placeholder="Type something here..." 
                required
                autoFocus={false}
                value={props.content}
                // ref={textareaRef}
                
                onChange={e => {
                    props.setContent(e.target.value);
                }}
                minLength={1}
                maxLength={3000}
            ></textarea>
        </div>
    )
};

export default AutoSizeTextarea;