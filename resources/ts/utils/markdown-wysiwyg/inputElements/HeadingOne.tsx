import { CONTENT_EDITOR_ACTIONS } from "../../../hooks/useContentEditor";
import { handleFocus } from "./event/onFocus";



type Props = {
    id: string;
    headingText: string;
    actions: CONTENT_EDITOR_ACTIONS;
};

function HeadingOne(props: Props) {
    return (
        <div className="heading_container">
            <input 
                // ref={inputRef}
                autoComplete="off" 
                onChange={(e) => props.actions.changeContent(props.id, e.target.value)} 
                name="heading_1" 
                className={`user_input heading_1`}
                // className={`user_input heading_1 ${props.page_element.color}`}
                placeholder="見出し 1" 
                value={props.headingText} 
                onFocus={()=>{handleFocus(props.id)}}
                // onBlur={()=> props.edit_H1(props.page_element.heading_1[0].id, heading_1)} 
                // style={{ opacity: props.snapshot.isDragging? '0.5': '1' }}
            />
        </div>
    )
};

export default HeadingOne;