import React from 'react';
import { Helmet } from 'react-helmet';

import { siteTitle } from '../../constants/site';
import ForgotPasswordCard from '../../components/auth/ForgotPasswordCard';
import { Navigate } from 'react-router-dom';

type Props = {
    user: any;
    forgotPassword: Function;
}
const ForgotPassword = (props: Props) => {
    const { user, forgotPassword } = props;

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
                <ForgotPasswordCard user={props.user} forgotPassword={forgotPassword} />
            </div>
        </React.Fragment>

    )
};

export default ForgotPassword;