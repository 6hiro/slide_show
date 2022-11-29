import React from 'react';
import { Helmet } from 'react-helmet';

import { siteTitle } from '../../constants/site';
// import ForgotPasswordCard from '../../components/auth/ForgotPasswordCard';


const ForgotPassword = () => {

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
                {/* <ForgotPasswordCard /> */}
            </div>
        </React.Fragment>

    )
};

export default ForgotPassword;