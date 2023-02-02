import React, { memo, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { siteTitle } from '../../constants/site';
import Header from './Header';
import { Link } from 'react-router-dom';
import useToggle from '../../hooks/useToggle';
import { delay } from '../../utils/delay';
import InitialLoadingScreen from './InitialLoadingScreen';
// import LoadingScreen from './LoadingScreen';



const Footer = memo(() => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="logo" >
                &copy; {year} {siteTitle}. 
            </div>
            <div className="privacy">
                <Link to="/privacy">
                    プライバシーポリシー
                </Link>
            </div>
            <div className="tos">
                <Link to="/terms">
                    利用規約
                </Link>
            </div>

        </footer>
    )
});

const Layout = ({user, isLoading, logout}: {
    user: any, 
    isLoading: boolean,
    logout: () => Promise<void>,
}) => {
    const [isInitialLoading, setIsInitialLoading] = useToggle(true);

    const pathname = window.location.pathname;
    const needFooterUrlList = ["privacy", "terms", "about", "notifications", "settings", "auth"];
   
    useEffect(() => {
        const hideInitialLoadingScreen = async () => {
            await delay(700);
            setIsInitialLoading(false)
        };
        hideInitialLoadingScreen();
    }, []);

    if(isLoading || isInitialLoading) return (
        <InitialLoadingScreen />
    )
    return (
        <React.Fragment>

            <Header 
                isAuth={user?.id ? true :false} 
                username={user?.name ? user.name : ""}
                logout={logout} 
            />

            <main className="main">
                <Suspense fallback={<></>}>
                    <Outlet /> 
                </Suspense>
            </main>
            {
                ( needFooterUrlList.includes(pathname.split("/").filter(Boolean)[0]) )
                    ? <Footer />
                    : null
            }
            
        </React.Fragment>
    )
};

export default Layout;