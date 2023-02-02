import TextareaAutosize from 'react-textarea-autosize';

import { CONTENT_EDITOR_ACTIONS } from "../../../hooks/useContentEditor";
import { DecoratedTextInput } from "../markdown/Render";
import { handleFocus } from "./event/onFocus";



type Props = {
    id: string;
    text: string;
    placeholder?: string;
    color?: string;
    actions: CONTENT_EDITOR_ACTIONS;
};

const Text = (props: Props) => {
    return (
        <div className={`text_element`}>
            <div className="decoTextarea">
                <div style={{position: "relative"}}>
                    <div className="decorated_text">
                        <DecoratedTextInput content={props.text}  />
                    </div>

                    <TextareaAutosize 
                        id="text"
                        className="text"
                        autoComplete="off" 
                        spellCheck="false"
                        name="text" 
                        value={props.text} 
                        onChange={(e) => {
                            const value = e.target.value ? e.target.value : "";
                            props.actions.changeContent(props.id, value)
                        }}
                        placeholder={props.placeholder ? props.placeholder : "テキスト"}
                        autoFocus={false} 
                        onFocus={()=>{handleFocus(props.id)}}
                    />
                </div>
            </div>
        </div>
    )
};

export default Text;