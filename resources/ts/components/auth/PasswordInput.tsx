import React from 'react';

import { PASSWORD_PATTERN } from '../../utils/regexps';



type Props = {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
};

const PasswordInput = (props: Props) => {
    const maxLength = 256;
    return (
        <div className="form_item">
            <input 
                type="text" 
                value={props.password}
                onChange={event => {
                    if( event.target.value.match(PASSWORD_PATTERN) || event.target.value==="" ) {
                        props.setPassword(event.target.value)
                    }
                }}
                placeholder={props.placeholder}
                required 
                // autoFocus 
                minLength={8}
                maxLength={maxLength}
            />
        </div>
    )
};

export default PasswordInput;