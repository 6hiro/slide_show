import { Dispatch, SetStateAction, useState } from 'react';
import { USER } from '../../types/user';
import UsernameInput from './UsernameInput';

type Props = {
    user: USER;
    changeUserName: Function;
    toggleEditForm: Dispatch<SetStateAction<boolean>>;
};

const EditUserForm = (props: Props) => {
    const [username, setUsername] = useState<string>(props.user.name);

    const submitForm = async (e: any) => {
        e.preventDefault();
        props.changeUserName(username, props.toggleEditForm);
    };

    return (
        <form className="edit_profile_form" onSubmit={submitForm}>
            <UsernameInput username={username} setUsername={setUsername} />


            <button
                type='submit'
                disabled={ username.length === 0 }
            >
                ユーザーネームを変更
            </button>

        </form>
    )
};

export default EditUserForm;