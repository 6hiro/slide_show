import { CONTENT_EDITOR_ACTIONS } from "../../../hooks/useContentEditor";
import { handleFocus } from "./event/onFocus";



type Props = {
    id: string;
    headingText: string;
    // time: number;
    actions: CONTENT_EDITOR_ACTIONS;
};

function HeadingTwo(props: Props) {

    return (
        <div className="heading_container">
            <input 
                autoComplete="off" 
                onChange={(e) => props.actions.changeContent(props.id, e.target.value)} 
                name="heading_2" 
                // className={`user_input heading_2 ${props.page_element.color}`} 
                className={`user_input heading_2`} 
                placeholder="見出し 2" 
                value={props.headingText} 
                onFocus={()=>{handleFocus(props.id)}}
                // axios.patch
                // onBlur={()=> props.edit_H2(props.page_element.heading_2[0].id, heading_2)} 
                // style={{opacity: props.snapshot.isDragging? '0.5': '1'}}
            />
        </div>
    )
};

export default HeadingTwo;