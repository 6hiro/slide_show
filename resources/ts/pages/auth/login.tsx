import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import LoginCard from '../../components/auth/LoginCard';
import { siteTitle } from '../../constants/site';
import { useAuth } from '../../hooks/useAuth';


const Login = () => {
    const [errors, setErrors] = useState<any[]>([]);
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    });

    return (
        <React.Fragment>  
            <Helmet>
                <meta charSet="utf-8" />
                <title>Login / {siteTitle}</title>
                <meta
                    name="description"
                    content="ログインページ"
                />
            </Helmet>

            <div className="auth_page_container">
                <LoginCard errors={errors} setErrors={setErrors} login={login} />
            </div>
        </React.Fragment>

    )
};

export default Login;