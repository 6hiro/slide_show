import { useState } from 'react';
import { BiUserCircle } from 'react-icons/bi';

import { USER } from '../../types/user';



type Props = {
    user: USER;
    toggle:  (nextValue?: any) => void;
    deleteAccount: Function;
};

const DeleteAccountForm = (props: Props) => {
    const [username, setUsername] = useState<string>("");

    return (
        <div className="delete_account_form" >
            <h3 className="delete_account_form_title">
                アカウントを削除しますか？
            </h3>

            <div className="delete_account_form_content" >
                <p style={{color: "#f42115", fontWeight: "600"}}>
                    一度削除されたアカウントは、回復できません。
                </p>
                <br />
                <p>
                    アカウント名を入力し、削除ボタンをクリックしてください。
                </p>
                
            </div>

            <div className="delete_account_form__input">
                <span 
                    className={`form_item_icon`} 
                >
                    <BiUserCircle />
                </span>
                <input 
                    type="text"
                    value={username}
                    onChange={event =>{
                        setUsername(event.target.value)
                    }}
                    placeholder='アカウント名' 
                    required 
                    minLength={1}
                />
            </div>

            <div className="button_container" >
                <button
                    type='submit'
                    className="no_button"
                    onClick={props.toggle}
                >
                    キャンセル
                </button>

                <button
                    type='submit'
                    className="yes_button"
                    disabled={ props.user.name !== username }
                    onClick={() => {
                        if(props.user.name === username) props.deleteAccount();
                    }}
                >
                    削除
                </button>

            </div>

        </div>
    )
};

export default DeleteAccountForm;