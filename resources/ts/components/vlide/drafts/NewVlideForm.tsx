import { useContext } from 'react';

import TagForm from './TagForm';
import { useDraftVlide } from '../../../hooks/useDraftVlide';
import TitleInput from './TitleInput';
import { ToastNotificationsContext } from '../../../hooks/useToastNotifications';



type Props = {
    toggleForm: Function;
};

const NewVlideForm = (props: Props) => {

    const {title, setTitle , tagList, setTagList, create} = useDraftVlide();
    const [_, setToastNotifications] = useContext(ToastNotificationsContext);

    const submitForm = async (e: any) => {
        e.preventDefault();
        await create(setToastNotifications, {title: title , tag_list: tagList, is_public: false});
        props.toggleForm(false);
    };

    return (
        <div className="new_vlide_form">

            <TitleInput title={title} setTitle={setTitle} autoFocus={true} />

            <TagForm tagList={tagList} setTagList={setTagList} />

            <button
                type='submit'
                disabled={ !title.length }
                onClick={submitForm}
            >
                次へ
            </button>

        </div>
    )
};

export default NewVlideForm;