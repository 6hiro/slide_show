import React, { useState } from 'react'
import { Helmet } from 'react-helmet';

import RegisterCard from '../../components/auth/RegisterCard';
import { siteTitle } from '../../constants/site';
import { useAuth } from '../../hooks/useAuth';


const Register = () => {
    const {register} = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: '/',
    });

    const [errors, setErrors] = useState<any[]>([]);


    return (
        <React.Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Register / {siteTitle}</title>
                <meta
                    name="description"
                    content="ユーザー登録ページ"
                />
                {/* <link rel="canonical" href="http://mysite.com/example" /> */}
            </Helmet>

            <div className="auth_page_container">
                <RegisterCard  errors={errors} setErrors={setErrors} register={register} />
            </div>
        </React.Fragment>

    )
};

export default Register;