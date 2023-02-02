import React, { useState } from 'react';
import { BiEnvelope, BiLock, BiLockOpen } from 'react-icons/bi';

import useToggle from '../../hooks/useToggle';
import { PASSWORD_PATTERN } from '../../utils/regexps';
import { Link } from 'react-router-dom';
import { siteTitle } from '../../constants/site';
import { generateUid } from '../../utils/uid';
import { ToastNotification } from '../../types/toast';



type LoginCardProps = {
    setToastNotifications: React.Dispatch<React.SetStateAction<[] | ToastNotification[]>>
    login: Function;
};

const LoginCard = (props:LoginCardProps) => {
    const { login, setToastNotifications } = props;

    const [isRevealed, toggle] = useToggle(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // const [remember, setRemember] = useState<boolean>(false);

    const submitForm = async (event: any) => {
        event.preventDefault();

        if( !password.match(PASSWORD_PATTERN) ) {

            setToastNotifications(prev => {
                return[
                    ...prev,
                    {id: generateUid(), type:"warning", message:"パスワードに使えるのは、半角英数字と記号（ @, $, !, %, *, ?, & ）のみです"},
                ];
            });
            return;
        }

        login({setToastNotifications: setToastNotifications, email, password, remember: false });
    };

    return (
        <div className="login_card_container" >
            <div className="login_card">
                <div className="login_card_header" >
                    <h1>{siteTitle} にログイン</h1>
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
                                setPassword(event.target.value)
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