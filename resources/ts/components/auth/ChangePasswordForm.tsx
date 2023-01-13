import { Dispatch, SetStateAction, useState } from 'react';

import { USER } from '../../types/user';
import PasswordInput from './PasswordInput';



type Props = {
    user: USER;
    changePassword: Function;
    togglPasswordForm: Dispatch<SetStateAction<boolean>>;
};

const ChangePasswordForm = (props: Props) => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');

    const submitForm = async (e: any) => {
        e.preventDefault();
        props.changePassword(newPassword, oldPassword, props.togglPasswordForm);
    };

    return (
        <form className="change_password_form" onSubmit={submitForm}>
            <PasswordInput 
                password={oldPassword} 
                setPassword={setOldPassword} 
                placeholder='元のパスワード' 
            />
            
            <PasswordInput 
                password={newPassword} 
                setPassword={setNewPassword} 
                placeholder='新しいパスワード' 
            />

            <button
                type='submit'
                className="btn"
                disabled={ 
                    newPassword.length <= 8 || 
                    oldPassword.length <= 8
                }
            >
                パスワードを変更
            </button>

        </form>
    )
};

export default ChangePasswordForm;