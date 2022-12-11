import React, { useLayoutEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { AdmaxSwitch } from '../../components/Ad/AdMax';

import GetMoreButton from '../../components/layout/GetMoreButton';
import Loader from '../../components/layout/Loader';
import VlideCard from '../../components/vlide/drafts/VlideCard';
import { admaxId, admaxId2, siteTitle } from '../../constants/site';
import { useGetVlide } from '../../hooks/useGetVlide';

const Home = () => {

    const { 
        user,
        vlides, 
        vlideNextPageLink,
        isLoadingVlide,
        savedUnsaved,
        getTrend,
        getFollowings,
        getMoreVlide,
        destroy
    } = useGetVlide();



    useLayoutEffect(() => {
        if(user) {
            getFollowings();
        }else{
            getTrend();
        }
    },[user]);

    // if ( isLoadingVlide ) {
    //     return <div style={{width: "100%", height: "calc(100vh -   120px)", display:"flex", alignItems: "center", justifyContent: "center"}}>
    //         <LoadingScreen />
    //     </div>
    // }

    if(!user) {
        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Home / {siteTitle}</title>
                    <meta
                        name="description"
                        content="ホーム"
                    />
                </Helmet>
    
                <div className="home_container">
                    
                    <h1 className="title">{siteTitle}へ、ようこそ。</h1>
                    <div className="description">
                        <p>
                            {siteTitle}は、<strong>音声 ( Voice )</strong> と <strong>スライド ( Slide )</strong> を掛け合わせたコンテンツを投稿できるサービスです。
                        </p>
                    </div>

                    { isLoadingVlide 
                        ?   <div style={{ height:"100px", display:"flex", alignItems: "center", justifyContent: "center" }}>
                                <Loader />
                            </div>

                        : null
                    }
                    
                    { (!isLoadingVlide && vlides) &&
                        <section>
                            <div className="sub_title">今週のトップ</div>
        
                            <div className="vlide_container" >
                                <ul className="vlide_list" >
        
                                    { vlides.map(( vlide, i ) => 
                                        <li key={i} className="vlide_card">
                                            <VlideCard 
                                                vlide={vlide} 
                                                loginId={user ? user.id : ""} 
                                                savedUnsaved={savedUnsaved}
                                                destroy={destroy}
                                             /> 
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </section>
                    }
                    <div style={{margin: "15px auto", maxWidth: "700px"}} >
                        <AdmaxSwitch id={admaxId} />
                        <AdmaxSwitch id={admaxId2} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>フィード Vlide / {siteTitle}</title>
                <meta
                    name="description"
                    content="フィード"
                />
            </Helmet>

            <div className="home_container">
                <div className="navigation" >
                    <div className="nav_item active_nav_item" >
                        <Link to="/">投稿</Link>
                    </div>
                    
                    <div className="nav_item" >
                        <Link to="/clips">クリップ</Link>
                    </div>
                </div>

                {/* { isLoadingVlide 
                    ?   <div style={{ height:"100px", display:"flex", alignItems: "center", justifyContent: "center" }}>
                            <Loader />
                        </div>

                    : null
                } */}

                <section>
                    <div className="vlide_container" >
                        <ul className="vlide_list" >

                            { (vlides && vlides?.length > 0 && !isLoadingVlide )
                                ? vlides.map(( vlide, i ) => 
                                    <li key={i} className="vlide_card">
                                        <VlideCard 
                                            vlide={vlide} 
                                            loginId={user ? user.id : ""} 
                                            savedUnsaved={savedUnsaved} 
                                            destroy={destroy}
                                        /> 
                                    </li>
                                )
                                : <div className="vlide_no_contents">
                                    フォロー中のユーザーの投稿がありません。
                                </div>
                            }

                            { ( vlides && vlideNextPageLink ) && 
                                <GetMoreButton nextPageLink={vlideNextPageLink} gerMoreFunc={getMoreVlide} />
                            }

                            <div style={{margin: "15px auto", width: "300px"}} >
                                <AdmaxSwitch id={admaxId} />
                                {/* <AdmaxSwitch id={admaxId2} /> */}
                            </div>

                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
};

export default Home;