import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiEnvelope } from 'react-icons/bi';
import { useAuth } from '../../hooks/useAuth';

const ForgotPasswordCard = () => {

    const [email, setEmail] = useState<string>('sunday6america@gmail.com');
    const [erros, setErrors] = useState<[]>();
    const [status, setStatus] = useState<[string]>();

    const { user, forgotPassword} = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    });

    const submitForm = async (event: any) => {
        event.preventDefault();
        // forgotPassword({setErrors, setStatus, email});
    };

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