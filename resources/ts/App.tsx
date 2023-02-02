import React, { lazy } from "react";
import { Routes, Route, } from "react-router-dom";

// import { siteASCIIArt } from "./constants/site";
// import { safari } from "./utils/browser";
import { ToastNotificationsContext, useToastNotifications } from "./hooks/useToastNotifications";
import ToastNotifications from "./components/toastNotification/ToastNotifications";
import { useQueryUser } from "./hooks/useQueryUser";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Search from "./pages/search";
import Settings from "./pages/settings";
// import Detail from "./pages/vlide/DetailVlide";
import Home from "./pages/home/Home";
import Clips from "./pages/home/Clips";
import Tag from "./pages/tag";
import DetailClip from "./pages/clip/DetailClip";
import Profile from "./pages/prof";
import ScrollToTop from "./components/layout/ScrollToTop";
import DetailBook from "./pages/book/DetailBook";
import SubscriptionPlans from "./pages/subscription/SubscriptionPlan";
import SubscriptionSuccess from "./pages/subscription/SubscriptionSuccess";
import SubscriptionCancel from "./pages/subscription/SubscriptionCancel";

// const Subscription  = lazy(() => import("./pages/subscription"));


// コード分割
import VerificationLinkSent from "./pages/auth/VerificationLinkSent";
// const VerificationLinkSent = lazy(() => import("./pages/auth/VerificationLinkSent"));
import ForgotPassword from "./pages/auth/ForgotPassword";
// const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
import ResetPassword from "./pages/auth/ResetPassword";
// const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
// const Search = lazy(() => import("./pages/search"));
// const Settings = lazy(() => import("./pages/settings"));
import PageBook from "./pages/book/PageBook";
// const PageBook = lazy(() => import("./pages/book/PageBook"));

import Detail from "./pages/vlide/DetailVlide";
// const Detail = lazy(() => import("./pages/vlide/DetailVlide"));
import DraftVlide from "./pages/vlide/DraftVlide";
// const DraftVlide  = lazy(() => import("./pages/vlide/DraftVlide"));
import About from "./pages/about";
// const About = lazy(() => import("./pages/about"));
import Notifications from "./pages/notifications";
// const Notifications = lazy(() => import("./pages/notifications"));
import NotFound from "./pages/NotFound";
// const NotFound = lazy(() => import("./pages/NotFound"));
import Terms from "./pages/terms";
// const Terms = lazy(() => import("./pages/terms"));
import Privacy from "./pages/terms/Privacy";
// const Privacy = lazy(() => import("./pages/terms/Privacy"));
import Protected from "./components/Protected";
// const Protected = lazy(() => import("./components/Protected"));
import DraftBook from "./pages/book/DraftBook";
// const DraftBook = lazy(() => import("./pages/book/DraftBook"))
import AdminPlan from "./pages/admin/Plan";
// const AdminPlan = lazy(() => import("./pages/admin/Plan"));


const App: React.FC = () => {
    // if(!safari) console.log(siteASCIIArt);
    const {toastNotifications, setToastNotifications} = useToastNotifications();
    const { data:user, error, isLoading, refetch } = useQueryUser();
    const { 
        register,
        login,
        forgotPassword,
        resetPassword,
        // resendEmailVerification,
        logout,
        deleteAccount,
        changeUserName,
        changePassword
    } = useAuth(
        user, 
        error,
        isLoading,
        refetch,
        {
            middleware: 'guest',
            redirectIfAuthenticated: '/'
        }
    );

    return (
        <ToastNotificationsContext.Provider value={[toastNotifications, setToastNotifications]}>

            {/* ページ遷移時にスクロール位置をトップに */}
            <ScrollToTop />

            <ToastNotifications notifications={toastNotifications} setNotifications={setToastNotifications} />


            <Routes>
                {/* Subscription */}

                <Route path="/" element={<Layout user={user} isLoading={isLoading} logout={logout} />}>
                    <Route path="/subscription/plan" element={<SubscriptionPlans user={user} />} />

                    <Route path='/payment' element={<Protected />}>
                        <Route path="/payment/success" element={<SubscriptionSuccess />} />
                        <Route path="/payment/cancellation" element={<SubscriptionCancel />} />
                    </Route>


                    <Route path='/' element={<Protected />}>
                        {/* Settings */}
                        <Route path="/settings" element={<Settings user={user} isLoading={isLoading} deleteAccount={deleteAccount} changeUserName={changeUserName} changePassword={changePassword} />} />
                    </Route>

                    {/* Home Page */}
                    <Route index element={<Home user={user} isLoading={isLoading} />} />
                    <Route path="/clips" element={<Clips user={user} />} />

                    {/* Prof */}
                    <Route path="/prof/:username" element={<Profile user={user} isLoading={isLoading} refetch={refetch} />} />
                    
                    {/* Auth Page */}
                    <Route path="/auth/register" element={<Register user={user} register={register}  />} />
                    <Route path="/auth/login" element={<Login user={user} login={login} />} />
                    <Route path="/verification-link-sent" element={<VerificationLinkSent />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword user={user} forgotPassword={forgotPassword} />} />
                    <Route path="/auth/reset-password/:token" element={<ResetPassword user={user} resetPassword={resetPassword} />} />


                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />


                    {/* <Route path="/subscription" element={<StripWrapper />}> */}
                        {/* <Route index element={<Subscription />} /> */}
                    {/* </Route> */}

                    
                    {/* Search */}
                    <Route path="/search" element={<Search user={user} />} />
                    {/* Tag */}
                    <Route path="/tag" element={<Tag user={user} />} />

                    {/* About */}
                    <Route path="/about" element={<About />} />

                    {/* Notifications */}
                    <Route path="/notifications" element={<Notifications />} />
                    {/* book */}
                    <Route path="/drafts/book/:book_id" element={<DraftBook user={user} isLoadingUser={isLoading} />} />
                    <Route path="/book/:book_id" element={<DetailBook user={user} isLoadingUser={isLoading} />} />
                    <Route path="/book/:book_id/page/:page_index" element={<PageBook  user={user} />} />

                    {/* Vlide */}
                    <Route path="/drafts/vlide/:vlide_id" element={<DraftVlide user={user} isLoadingUser={isLoading} />} />
                    {/* <Route path="/demo/vlide/:vlide_id" element={<Demo user={user} isLoadingUser={isLoading} />} /> */}
                    <Route path="/vlide/:vlide_id" element={<Detail  user={user} />} />
                    

                    {/* clip */}
                    <Route path="/clip/:clip_id" element={<DetailClip user={user} />} />


                    <Route path="/admin/s/plan" element={<AdminPlan user={user} />} />

                    

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </ToastNotificationsContext.Provider>
    )
};

export default App;