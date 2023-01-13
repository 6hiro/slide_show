import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';

import RegisterCard from '../../components/auth/RegisterCard';
import { siteTitle } from '../../constants/site';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';


type Props = {
    user: any, 
    register: any,
}
const Register = (props: Props) => {
    const {user, register} = props;

    const [_, setToastNotifications] = useContext(ToastNotificationsContext);


    if(user?.id) return (<Navigate to="/" replace={true} />)

    return (
        <React.Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Register / {siteTitle}</title>
                <meta
                    name="description"
                    content="ユーザー登録ページ"
                />
            </Helmet>

            <div className="auth_page_container">
                <RegisterCard setToastNotifications={setToastNotifications} register={register} />
            </div>
        </React.Fragment>

    )
};

export default Register;