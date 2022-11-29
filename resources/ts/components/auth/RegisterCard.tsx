import React, { useState } from 'react';
import { BiEnvelope, BiLock, BiLockOpen, BiUser } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { siteTitle } from '../../constants/site';
import useToggle from '../../hooks/useToggle';
import { PASSWORD_PATTERN, USERNAME_PATTERN } from '../../utils/regexps';
import AuthValidationErrors from './AuthValidationErrors';


type RegisterCardProps = {
    errors: any[];
    setErrors: React.Dispatch<React.SetStateAction<any[]>>;
    register: Function;
};

const RegisterCard = (props:RegisterCardProps) => {
    const [isRevealed, toggle] = useToggle(false);

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password_confirmation, setPasswordConfirmation] = useState<string>('');
    const [isRegisting, seIsRegisting] = useToggle(false);

    const submitForm = async(event: any) => {
        event.preventDefault();
        await props.setErrors([]);

        if( !name.match(USERNAME_PATTERN) ) {

            props.setErrors(
                [ ["username.match"] ]
            );
            return;
        }
        if( !password.match(PASSWORD_PATTERN) ) {

            props.setErrors(
                [ ["password.match"] ]
            );
            return;
        }

        if(password !== password_confirmation) {
            return;
        }
        props.register({ setErrors: props.setErrors, name, email, password, password_confirmation })
    };


    return (
        <div className="login_card_container">
            <AuthValidationErrors errors={props.errors} />

            <div className="login_card" >
                <div className="login_card_header" >
                    <h1>{siteTitle}をはじめる</h1>
                </div>

                <form className="login_card_form" onSubmit={submitForm} >
                    <div className="form_item" >
                        <span className="form_item_icon" >
                            <BiUser />
                        </span>
                        <input 
                            className=""
                            type="text" 
                            value={name}
                            onChange={event => {
                                // if( event.target.value.match(USERNAME_PATTERN) || event.target.value==="" ) {
                                    setName(event.target.value);
                                // }
                            }}
                            placeholder='ユーザー名' 
                            required 
                            autoFocus 
                            maxLength={40}
                        />
                    </div>
                    {/* Email Address */}
                    <div className="form_item">
                        <span className="form_item_icon">
                            <BiEnvelope />
                        </span>
                        <input 
                            type="email" 
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            placeholder='メールアドレス' 
                            required 
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
                            placeholder='パスワード' 
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
                                seIsRegisting(true);
                                // if( event.target.value.match(PASSWORD_PATTERN) || event.target.value==="" ) {
                                    setPasswordConfirmation(event.target.value);
                                // }
                                seIsRegisting(false);
                            }}
                            placeholder='パスワード確認' 
                            required 
                            minLength={8}
                        />
                    </div>
                    
                    <button 
                        type='submit'
                        disabled={
                            !name.length || 
                            !email.length || 
                            !(password.length>=8) || 
                            !(password_confirmation.length>=8) || 
                            password !== password_confirmation ||
                            isRegisting
                        }

                    >
                        ユーザー登録
                    </button>

                </form>
                <div className="login_card_footer" >
                    アカウントをお持ちの方は
                    <Link to="/auth/login">ログイン</Link>
                    してください。
                </div>
            </div>
        </div>
    )
};

export default RegisterCard;