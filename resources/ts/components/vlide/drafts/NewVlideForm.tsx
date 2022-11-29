// import React from 'react';
import TagForm from './TagForm';
import { useDraftVlide } from '../../../hooks/useDraftVlide';
import TitleInput from './TitleInput';
import { useNavigate } from 'react-router-dom';

type Props = {
    toggleForm: Function;
};

const NewVlideForm = (props: Props) => {
    let navigate = useNavigate();

    const {title, setTitle , tagList, setTagList, create} = useDraftVlide();

    const submitForm = async (e: any) => {
        e.preventDefault();
        const res = await create({title: title , tag_list: tagList, is_public: false});
        props.toggleForm(false);

        res.data.id && navigate(`/drafts/vlide/${res.data.id}`);
    };

    return (
        <form className="new_vlide_form" onSubmit={submitForm}>

            <TitleInput title={title} setTitle={setTitle} autoFocus={true} />

            <TagForm tagList={tagList} setTagList={setTagList} />

            <button
                type='submit'
                disabled={ !title.length }
            >
                次へ
            </button>

        </form>
    )
};

export default NewVlideForm;