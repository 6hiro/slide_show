import React, { useContext, useState } from 'react'

import { useDraftBook } from '../../hooks/useDraftBook';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import TitleInput from '../vlide/drafts/TitleInput';



type Props = {
    toggleForm: (nextValue?: any) => void
};

const NewBookForm = (props: Props) => {
    const [_, setToastNotifications] = useContext(ToastNotificationsContext);
    const [isLoading, setIsLoading] = useState(false);
    const {title, setTitle, create} = useDraftBook();

    const addClip = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        if(isLoading) return;

        setIsLoading(true);

        const data = {
            id: "",
            title: title,
            is_public: false
        }
        create(data, setToastNotifications, props.toggleForm);
        
        setIsLoading(false);
    };


    return (
        <div className="new_vlide_form">
            <TitleInput title={title} setTitle={setTitle} autoFocus={true} />

            <button
                type='submit'
                disabled={ !title.length || isLoading }
                onClick={addClip}
            >
                次へ
            </button>

        </div>
    )
};

export default NewBookForm;