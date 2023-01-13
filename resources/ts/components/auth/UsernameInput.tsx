import React from 'react';

import { USERNAME_PATTERN } from '../../utils/regexps';



type Props = {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const UsernameInput = (props: Props) => {
    const maxLength = 40;
    return (
        <div className="user_name_input">
            <input 
                type="text" 
                value={props.username}
                onChange={e => {
                    if( e.target.value.match(USERNAME_PATTERN) || e.target.value==="" ) {
                        props.setUsername(e.target.value)}
                    }
                }
                placeholder='ユーザーネーム' 
                required 
                autoFocus 
                maxLength={40}
            />

            <div className="text_count" >
                {props.username.length} / {maxLength}
            </div>
        </div>
    )
};

export default UsernameInput;