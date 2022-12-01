import React, {  } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
//   ScrollRestoration,
} from "react-router-dom";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
  
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
// import ForgotPassword from "./pages/auth/ForgotPassword";
import Search from "./pages/search";
import Settings from "./pages/settings";
import EditVlide from "./pages/vlide/EditVlide";
import Detail from "./pages/vlide/DetailVlide";
import About from "./pages/about";
import Notifications from "./pages/notifications";
import Home from "./pages/Home/Home";
import Clips from "./pages/Home/Clips";
import Tag from "./pages/tag";
import DetailClip from "./pages/clip/DetailClip";
import Profile from "./pages/prof";
import VerificationLinkSent from "./pages/auth/VerificationLinkSent";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/layout/ScrollToTop";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // fetch に失敗した時に自動的にリトライするか
            refetchOnWindowFocus: false, // フォーカス時に再検証するか
            // suspense: true, // susupense と組み合わせる
        }
    }
});

const App: React.FC = () => {
    return (
        <div>

            <QueryClientProvider client={queryClient}>


                <BrowserRouter>
                    {/* ページ遷移時にスクロール位置をトップに */}

                    <ScrollToTop />
                    {/* <ScrollRestoration /> */}

                    <Routes>
                        <Route path="/" element={<Layout />}>
                            {/* Home Page */}
                            <Route index element={<Home />} />
                            <Route path="/clips" element={<Clips />} />

                            {/* Prof */}
                            <Route path="/prof/:username" element={<Profile />} />
                            
                            {/* Auth Page */}
                            <Route path="/auth/register" element={<Register />} />
                            <Route path="/auth/login" element={<Login />} />
                            <Route path="/verification-link-sent" element={<VerificationLinkSent />} />
                            {/* <Route path="/auth/forgot-password" element={<ForgotPassword />} /> */}

                            {/* Settings */}
                            <Route path="/settings" element={<Settings />} />
                            
                            {/* Clip */}
                            {/* <Route path="/clip/new" element={<AddClip />} /> */}

                            {/* Search */}
                            <Route path="/search" element={<Search />} />
                            {/* Tag */}
                            <Route path="/tag" element={<Tag />} />


                            {/* About */}
                            <Route path="/about" element={<About />} />

                            {/* Notifications */}
                            <Route path="/notifications" element={<Notifications />} />


                            {/* Vlide */}
                            <Route path="/drafts/vlide/:vlide_id" element={<EditVlide />} />
                            <Route path="/vlide/:vlide_id" element={<Detail />} />

                            {/* clip */}
                            <Route path="/clip/:clip_id" element={<DetailClip />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>

                </BrowserRouter>
           </QueryClientProvider>
        </div>

    )
};

export default App;