import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { siteTitle } from '../../constants/site';
import Header from './Header';

const Footer = memo(() => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="logo" >
                &copy; {year} {siteTitle}. 
                {/* All rights reserved. */}
            </div>
            <div className="privacy">
                プライバシー
            </div>
            <div className="tos">
                 {/* Terms of service */}
                {/* <Link to=""> */}
                    利用規約
                {/* </Link> */}
            </div>
        </footer>
    )
});

const Layout = () => {

    const { user, logout } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    })

    return (
        <React.Fragment>

            <Header 
                isAuth={user?.id ? true :false} 
                username={user?.name ? user.name : ""}
                logout={logout} 
                // nickName={user.nick_name} 
            />

            <main className="main">
                {/* <Suspense fallback={<LoadingScreen />}> */}
                    <Outlet /> 
                {/* </Suspense> */}
            </main>

            <Footer />
            
        </React.Fragment>
    )
};

export default Layout;