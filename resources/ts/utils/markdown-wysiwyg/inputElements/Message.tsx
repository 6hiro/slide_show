import { BiMessageSquareError } from 'react-icons/bi'

import { CONTENT_EDITOR_ACTIONS } from '../../../hooks/useContentEditor';
import Text from './Text';



type Props = {
    id: string;
    text: string;
    actions: CONTENT_EDITOR_ACTIONS;
};

const Message = (props: Props) => {
    return (
        <aside className='message_element' role="note">
            <BiMessageSquareError className='message_icon' />
            <div className='message_content'>
                <Text text={props.text} id={props.id} actions={props.actions} />
            </div>
        </aside>
    )
};

export default Message;