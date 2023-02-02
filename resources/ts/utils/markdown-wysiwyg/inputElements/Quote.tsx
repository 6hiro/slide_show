import { CONTENT_EDITOR_ACTIONS } from "../../../hooks/useContentEditor";
import Text from "./Text";



type Props = {
    id: string;
    text: string;
    actions: CONTENT_EDITOR_ACTIONS;
};

function Quote(props: Props) {
    return (
        <div className="quote_element">
            <Text text={props.text} id={props.id} placeholder="引用文" actions={props.actions} />
        </div>
    )
};

export default Quote;