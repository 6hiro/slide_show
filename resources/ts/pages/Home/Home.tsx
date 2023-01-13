import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { BiArrowToTop } from 'react-icons/bi';
import { FaPaperclip } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import GetMoreButton from '../../components/layout/GetMoreButton';
import LoadingScreen from '../../components/layout/LoadingScreen';
import ScrollDownAnimation from '../../components/layout/ScrollDownAnimation';
import Phone from '../../components/phone';
import Vlide from '../../components/vlide/vlideCard/Vlide';
import { siteTitle } from '../../constants/site';
import { useGetVlide } from '../../hooks/useGetVlide';

type Props = {
    user: any;
    isLoading: boolean;
}
const Home = (props: Props) => {
    const { user, isLoading } = props;
    const [ isShowedToTopButon, setIsShowedGoToTop ] = useState(false);

    const stickyOneRef = useRef<HTMLDivElement | null>(null);
    const stickyTwoRef = useRef<HTMLDivElement | null>(null);
    const stickyThreeRef = useRef<HTMLDivElement | null>(null);
    const stickyFourRef = useRef<HTMLDivElement | null>(null);

    const { 
        vlides, 
        vlideNextPageLink,
        isLoadingVlide,
        savedUnsaved,
        getFollowings,
        getMoreVlide,
        deleteVlide
    } = useGetVlide();

    useLayoutEffect(() => {
        if(user?.id && !isLoading) {
            getFollowings();
        // }else if(!user?.id && !isLoading){
        //     getTrend();
        }
    },[user]);

    function goToTop() {
        stickyOneRef.current?.parentElement?.scrollIntoView({ 
            behavior: 'smooth',
        });
    }

    function goToSecound() {
        stickyTwoRef.current?.parentElement?.scrollIntoView({ 
            behavior: 'smooth',
        });
    }

    function handleScroll() {
        const refList = [stickyOneRef, stickyTwoRef, stickyThreeRef, stickyThreeRef];
        const headerHeight = 50; // px

        if(refList[0].current?.parentElement) {
            const { top } = refList[0].current.parentElement.getBoundingClientRect(); // 画面より上ならマイナス、下ならプラス
            if(top < -900){
                setIsShowedGoToTop(true);
            }else{
                setIsShowedGoToTop(false);
            }
            // console.log(top)
            refList.forEach((ref, i) => {
                if(ref.current) {    
                    if(headerHeight <= top){ // 一番上まで戻った時、cssがズレることがあるため、明示的に初期化する
                        resetStyle(ref.current)
                    }else{
                        const isLast = i === (refList.length-1);
                        setStyle(ref.current, isLast);
                    }
                }
            });
        }
    }
    function resetStyle(ref: HTMLDivElement){
        if(ref.parentElement) {
            ref.style.filter = `unset`;
            ref.style.transform = `unset`;
            ref.style.opacity = `unset`;
        }
    }
    function setStyle(ref: HTMLDivElement, isLast: boolean) {
        if(ref.parentElement) {
            let { top } = ref.parentElement.getBoundingClientRect();
            let transTop = top > 0 ? 0 : top * -1;
            // if(!isLast)console.log(top)
            if(transTop >= 1000) transTop = 1000;
            if(top <= 0 && !isLast) {
                ref.style.filter = `blur(${0 + (transTop * .01)}px)`;
                ref.style.transform = `scale3d(${1 - (transTop * .001)}, ${1 - (transTop * .001)}, 1)`;
                ref.style.opacity = `${1 - transTop * 0.0015}`;
            }
        }
    }

    useEffect(() => {
        document.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, []);

    if(isLoading) {
        return null;
    }

    if(!user && !isLoading) {
        return (
            <>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Home / {siteTitle}</title>
                    <meta
                        name="description"
                        content="ホーム"
                    />
                </Helmet>
                {/* <div style={{height: "400vh", overflow: "hidden"}}> */}
                    <div className="home_container">
                        <section className='section'>
                            <div className="content-wrapper" ref={stickyOneRef}>
                                <div className="content" style={{background: ""}}>
                                    <div className="content__header">
                                        <h2>{siteTitle}</h2>
                                        <div>
                                            {/* <img src='/images/Logo.png' width={40} height={40} alt="vlides_logo" /> */}
                                        </div>
                                    </div>
                                    <div className="content__main">
                                        <img src='/images/Logo.png' width={320} height={320} alt="vlides_logo" />
                                        <div className="img_cover"></div>
                                    </div>
                                    <div className="content__footer">
                                        <div className="title">Slides With Voice</div>
                                        <div className="description">
                                            <p>
                                                <>{siteTitle}</>では、<strong>音声</strong>と<strong>スライド</strong>を掛け合わせたコンテンツを投稿できます。
                                            </p>
                                        </div>
                                    </div>

                                    <div className="scrolldown-wrapper" onClick={goToSecound} >
                                        <ScrollDownAnimation />
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className='section'>
                            <div className="content-wrapper" ref={stickyTwoRef}>
                                <div className="content">
                                    <div className="content__header">
                                        <h2>クリップ</h2>
                                        {/* <div className="clip_icon"><BiPaperclip /></div> */}
                                    </div>
                                    <div className="content__main">
                                        <div className="icon_wrapper">
                                            <FaPaperclip />
                                        </div>
                                    </div>
                                    <div className="content__footer">
                                        <p>投稿の内容を切り抜き、メモを残せる<strong>クリップ機能</strong>を提供しています。</p>
                                        <p> 他のユーザーのクリップをシェアすることもできます。</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className='section'>
                            <div className="content-wrapper" ref={stickyThreeRef}>
                                <div className="content">
                                    <div className="content__header">
                                        <h2>新たな発見、体験</h2>
                                    </div>
                                    <div className="content__main">
                                        <div className="phone_bottom">
                                            {/* <Phone imgSrc="/images/vlidesDetail.png" /> */}
                                            <Phone imgSrc={"/images/vlidesProf.png"} />
                                        </div>
                                        <div className="phone__top_container" >
                                            <div className="phone__top">
                                                <Phone imgSrc="/images/vlidesDetail.png" />
                                                {/* <Phone imgSrc={"/images/vlidesProf.png"} /> */}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="content__footer"></div> */}
                                </div>
                            </div>
                        </section>
                        <section className='section'>
                            <div className="content-wrapper" ref={stickyFourRef}>
                                <div className="content">
                                    <h2 className='content__header'>{siteTitle} をはじめる</h2>
                                    <div className="content__main">
                                        <div>無料で、参加できます</div>
                                        <Link to="/auth/register" >
                                            <div className='to_registeration_page'>
                                                新規登録
                                            </div>
                                        </Link>
                                        
                                        <div>アカウントをお持ちの方</div>
                                        <Link to="/auth/login" >
                                            <div className="to_login_page">
                                                ログイン
                                            </div>
                                        </Link>
                                        <div className="content__main__footer">

                                        </div>

                                    </div>
                                    <div className="content__footer">
                                        <div className="privacy">
                                            <Link to="/privacy">
                                                プライバシー
                                            </Link>
                                        </div>
                                        <div className="tos">
                                            <Link to="/terms">
                                                利用規約
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                {/* </div> */}
                
                {isShowedToTopButon
                    ?   <div 
                            className="go_to_top_button"
                            onClick={goToTop}
                        >
                            <BiArrowToTop />
                        </div>
                    : null
                }
            </>
        )
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>フィード - 投稿 / {siteTitle}</title>
                <meta
                    name="description"
                    content="フィード"
                />
            </Helmet>

            <div className="feed_container">
                <div className="navigation" >
                    <Link to="/" className="nav_item active_nav_item" >
                        投稿
                    </Link>
                    
                    <Link to="/clips" className="nav_item" >
                        クリップ
                    </Link>
                </div>

                <section>
                    <div className="vlide_container" >
                        <ul className="vlide_list" >
                        { (vlides && vlides?.length > 0 && !isLoadingVlide)
                                ? vlides.map(( vlide, i ) => 
                                    <li key={i} className="vlide_card">
                                        <Vlide 
                                            vlide={vlide} 
                                            loginId={user ? user.id : ""} 
                                            savedUnsaved={savedUnsaved} 
                                            destroy={deleteVlide}
                                        />

                                    </li>
                                )
                                : <div className="vlide_no_contents">
                                    {
                                        !isLoadingVlide 
                                            ? "フォロー中のユーザーの投稿がありません。" 
                                            :  <LoadingScreen />
                                    }
                                    
                                </div>
                            }
                            { ( vlides && vlideNextPageLink ) && 
                                <GetMoreButton nextPageLink={vlideNextPageLink} gerMoreFunc={getMoreVlide} />
                            }

                        </ul>
                    </div>
                </section>
            </div>
        </>
    )
};

export default Home;