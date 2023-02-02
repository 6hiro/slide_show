import { CONTENT_EDITOR_ACTIONS } from "../../../hooks/useContentEditor";
import useToggle from "../../../hooks/useToggle";
import { handleFocus } from "./event/onFocus";


type Props = {
    id: string;
    text: string;
    actions: CONTENT_EDITOR_ACTIONS;
};

const YoutubeURL = (props: Props) => {
    const isYouTubeURL = (txt: string) => {
        if(
            (
                (txt.slice(0, 32)==='https://www.youtube.com/watch?v=') || 
                (txt.slice(0, 30)==='https://m.youtube.com/watch?v=') || 
                (txt.slice(0, 17)==='https://youtu.be/' && txt.length > 17) ||
                (txt.slice(0, 31)==='https://www.youtube.com/shorts/' && txt.length > 32) ||
                (txt.slice(0, 29)==='https://m.youtube.com/shorts/' && txt.length > 31)
            ) && !txt.match(/ /g) && !txt.match(/　/g)
        ){
            return true;
        } else {
            return false;
        }
    };
    const [isValid, setIsValid] = useToggle(isYouTubeURL(props.text));


    return (
        <div className="youtube_url">
            <input 
                id="text"
                className={`text ${isValid ? "is_valid" : ""}`}
                autoComplete="off" 
                spellCheck="false"
                name="text" 
                value={props.text} 
                onChange={(e) => {
                    props.actions.changeContent(props.id, e.target.value);
                    (!isValid && isYouTubeURL(e.target.value) )&& setIsValid(true);
                    (isValid && !isYouTubeURL(e.target.value) ) && setIsValid(false);
                }} 
                onFocus={()=>{handleFocus(props.id)}}
                placeholder="Youtube URL"
                autoFocus={false} 
            />
        </div>
    )
};

export default YoutubeURL;