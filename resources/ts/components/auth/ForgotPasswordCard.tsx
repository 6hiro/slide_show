import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiEnvelope } from 'react-icons/bi';
import { useAuth } from '../../hooks/useAuth';
import { EMAIL_REGEXP } from '../../utils/regexps';

const ForgotPasswordCard = () => {

    const [email, setEmail] = useState<string>("");
    const [erros, setErrors] = useState<[]>();
    const [status, setStatus] = useState<[string]>();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const { user, forgotPassword} = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    });

    const submitForm = async (event: any) => {
        event.preventDefault();
        await setIsProcessing(true);
        await forgotPassword({setErrors, setStatus, email});
        setIsProcessing(false);
    };
    if(status?.[0]==="passwords.sent"){
        return <div style={{margin: "0px auto", padding: "0px 20px"}}>
            パスワードリセットのメールを送信しました。ご確認ください。
        </div>
    }

    return (
        // <div style={{ width: "100vw", marginTop: "50px", display: "flex", justifyContent: "center"}}>
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
                                !email.length || 
                                isProcessing
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
        // </div>
    )
};

export default ForgotPasswordCard;