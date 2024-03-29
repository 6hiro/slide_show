import React from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { siteTitle } from '../../constants/site';
import ForgotPasswordCard from '../../components/auth/ForgotPasswordCard';



type Props = {
    user: any;
    forgotPassword: Function;
}
const ForgotPassword = (props: Props) => {
    const { user, forgotPassword } = props;
    // console.log(forgotPassword)

    if(user?.id) return (<Navigate to="/" replace={true} />)
    
    return (
        <React.Fragment>  
            <Helmet>
                <meta charSet="utf-8" />
                <title>Forgot Password / {siteTitle}</title>
                <meta
                    name="description"
                    content="パスワード再設定"
                />
            </Helmet>

            <div className="auth_page_container">
                <ForgotPasswordCard forgotPassword={forgotPassword} />
            </div>
        </React.Fragment>

    )
};

export default ForgotPassword;