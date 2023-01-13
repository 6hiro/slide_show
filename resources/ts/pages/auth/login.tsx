import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';

import LoginCard from '../../components/auth/LoginCard';
import { siteTitle } from '../../constants/site';
import { Navigate } from 'react-router-dom';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';

type Props = {
    user: any, 
    login: any,
}
const Login = (props: Props) => {
    const {user, login} = props;
    const [_, setToastNotifications] = useContext(ToastNotificationsContext);

    if(user?.id) return (<Navigate to="/" replace={true} />)

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
                <LoginCard setToastNotifications={setToastNotifications} login={login} />
            </div>
        </React.Fragment>

    )
};

export default Login;