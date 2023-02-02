import { BiMessageSquareError } from 'react-icons/bi'

import { CONTENT_EDITOR_ACTIONS } from '../../../hooks/useContentEditor';
import Text from './Text';



type Props = {
    id: string;
    text: string;
    actions: CONTENT_EDITOR_ACTIONS;
};

const Alert = (props: Props) => {
    return (
        <aside className='alert_element message_element' role="alert">
            <BiMessageSquareError className='message_icon' />
            <div className='message_content'>
                <Text text={props.text} id={props.id} actions={props.actions}/>
            </div>
        </aside>
    )
};

export default Alert;