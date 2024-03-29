import { useState } from 'react';

import { USER } from '../../types/user';
import DescriptionTextarea from './DescriptionTextarea';
import NickNameInput from './NickNameInput';



type Props = {
    user: USER;
    updateProf: Function;
};

const EditProfileForm = (props: Props) => {
    const [nickName, setNickName] = useState<string>(props.user.nick_name);
    const [description, setDescription] = useState<string>(props.user.description ? props.user.description : "");
    const maxLength = 160;

    const submitForm = async (e: any) => {
        e.preventDefault();
        props.updateProf(nickName, description);
    };

    return (
        <div className="edit_profile_form" >
            <NickNameInput nickName={nickName} setNickName={setNickName} />

            <div>
                <div style={{maxHeight: "45vh", overflow: "scroll", border:" 1px solid #bfbfbf",  borderRadius: "4px"}} >
                    <DescriptionTextarea maxLength={maxLength} description={description} setDescription={setDescription}  />
                </div>
                <div className="text_count" >
                    {description.length} / {maxLength}
                </div>
            </div>

            <button
                type='submit'
                disabled={ !nickName.length }
                onClick={submitForm}
            >
                プロフィールを変更
            </button>

        </div>
    )
};

export default EditProfileForm;