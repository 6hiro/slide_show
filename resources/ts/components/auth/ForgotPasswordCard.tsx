import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiEnvelope } from 'react-icons/bi';

import { EMAIL_REGEXP } from '../../utils/regexps';



const ForgotPasswordCard = (
    user: any, 
    forgotPassword: Function
) => {

    const [email, setEmail] = useState<string>("");
    const [status, setStatus] = useState<[string]>();


    const submitForm = async (event: any) => {
        event.preventDefault();
        await forgotPassword({setStatus, email});
    };

    if(status?.[0]==="passwords.sent"){
        return <div style={{margin: "0px auto", padding: "0px 20px"}}>
            パスワードリセットのメールを送信しました。ご確認ください。
        </div>
    }

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

                    <button 
                        type='submit'
                        disabled={
                            !email.match(EMAIL_REGEXP) ||
                            !email.length
                        }
                    >
                        送信
                    </button>
                </form>

                <div className="login_card_footer" >
                    アカウントをお持ちの方は
                    <Link to="/auth/login">ログイン</Link>
                    してください。
                </div>
                {/* <br /> */}
            </div>

        </div>
    )
};

export default ForgotPasswordCard;