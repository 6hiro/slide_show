import React, { useState } from 'react';

import { BiEnvelope, BiLock, BiLockOpen } from 'react-icons/bi';
import useToggle from '../../hooks/useToggle';
import { PASSWORD_PATTERN } from '../../utils/regexps';
import { Link } from 'react-router-dom';
import AuthValidationErrors from './AuthValidationErrors';
import { siteTitle } from '../../constants/site';

type LoginCardProps = {
    errors: any[];
    setErrors: React.Dispatch<React.SetStateAction<any[]>>;
    login: Function;
};

const LoginCard = (props:LoginCardProps) => {

    const [isRevealed, toggle] = useToggle(false);
    // const [email, setEmail] = useState<string>('ofujimoto@example.org');
    // const [password, setPassword] = useState<string>('password');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);



    const submitForm = async (event: any) => {
        event.preventDefault();
        await props.setErrors([]);

        if( !password.match(PASSWORD_PATTERN) ) {

            props.setErrors(
                [ ["password.match"] ]
            );
            return;
        }
        props.login({setErrors: props.setErrors, email, password, remember });
    };

    return (
        <div className="login_card_container" >
            <AuthValidationErrors errors={props.errors} />

            <div className="login_card">
                <div className="login_card_header" >
                    <h1>{siteTitle}にログイン</h1>
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
                    <div className="form_item">
                        <span 
                            className={`form_item_icon`} 
                            onClick={toggle}
                        >
                            {isRevealed ? <BiLockOpen /> : <BiLock />}
                        </span>
                        <input 
                            type={isRevealed ? "text" : "password"} 
                            value={password}
                            onChange={event =>{
                                // if( event.target.value.match(PASSWORD_PATTERN) || event.target.value==="" ) {
                                    setPassword(event.target.value)
                                // }
                            }}
                            placeholder='パスワード' 
                            // autoComplete="new-password"
                            required 
                            minLength={8}
                        />
                    </div>
                    {/* <div className={styles.form_item_other}>
                        <div className={styles.checkbox}>
                            <input 
                                type="checkbox" 
                                id="remenberMeCheckbox"
                                name="remember"
                                checked={remember}
                                onChange={event => setRemember(!remember)}
                            />
                            <label htmlFor="remenberMeCheckbox">ログイン状態を保存する</label>
                        </div>
                    </div> */}
                    <button 
                        type='submit'
                        disabled={
                            !email.length || password.length < 8
                        }
                    >ログイン</button>

                </form>
                <div className="login_card_footer" >
                    アカウントをお持ちでない場合は
                    <Link to="/auth/register" >登録</Link>
                </div>

                <div className="login_card_footer" >
                    パスワードをお忘れた場合は
                    <Link to="/auth/forgot-password" >こちら</Link>
                </div>
            </div>

        </div>
    )
};

export default LoginCard;