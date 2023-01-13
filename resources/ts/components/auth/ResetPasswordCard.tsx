// https://github.com/Nilanth/laravel-breeze-react/blob/master/src/pages/password-reset.js
import { useEffect, useState } from 'react';
import { BiEnvelope, BiLock, BiLockOpen } from 'react-icons/bi';
import { useParams, useSearchParams } from 'react-router-dom';

import useToggle from '../../hooks/useToggle';
import { EMAIL_REGEXP, PASSWORD_PATTERN } from '../../utils/regexps';



type Props ={
    resetPassword: Function;
}

const ResetPasswordCard = (props: Props) => {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
  
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPasswordConfirmation] = useState('')
    const [isRevealed, toggle] = useToggle(false);
    
    const submitForm = async(e: any) => {
        e.preventDefault();
        const token = params.token;
        if(token) {
            await props.resetPassword({
                email,
                password,
                password_confirmation,
                token,
            })
        }
    }
    
    useEffect(() => {
        setEmail(searchParams.get("email") || '')
    }, [searchParams])

    return (
        <div className="login_card_container" >
        <div className="login_card">
            <div className="login_card_header" >
                <h1>パスワード再設定</h1>
            </div>
            <form className="login_card_form" onSubmit={submitForm}>
                <div className="form_item">
                    <span className={`form_item_icon`}>
                        <BiEnvelope />
                    </span>
                    <input 
                        type="email" 
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder='メールアドレス' 
                        required 
                        autoFocus 
                        maxLength={191}
                    />
                </div>


                     {/* Password */}
                    <div className="form_item">
                        <span 
                            className="form_item_icon"
                            onClick={toggle}
                        >
                            {isRevealed ? <BiLockOpen /> : <BiLock />}
                        </span>
                        <input 
                            type={isRevealed ? "text" : "password"} 
                            value={password}
                            onChange={event => {
                                // if( event.target.value.match(PASSWORD_PATTERN) || event.target.value==="" ) {
                                    setPassword(event.target.value);
                                // }
                            }}
                            placeholder='新しいパスワード' 
                            autoComplete="new-password"
                            required 
                            minLength={8}
                            maxLength={256}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="form_item" >
                        <span 
                            className="form_item_icon"
                            onClick={toggle}
                        >
                            {isRevealed ? <BiLockOpen /> : <BiLock />}
                        </span>
                        <input 
                            type={isRevealed ? "text" : "password"} 
                            value={password_confirmation}
                            onChange={event =>{
                                setPasswordConfirmation(event.target.value);
                            }}
                            placeholder='パスワード確認' 
                            required 
                            minLength={8}
                        />
                    </div>

                <button 
                    type='submit'
                    disabled={
                        !password.match(PASSWORD_PATTERN) ||
                        !password_confirmation.match(PASSWORD_PATTERN) ||
                        !email.match(EMAIL_REGEXP) ||
                        !email.length
                    }
                >
                    送信
                </button>
            </form>
        </div>

    </div>
    )
}

export default ResetPasswordCard;