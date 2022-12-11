import { useLayoutEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { AdmaxSwitch } from "../../components/Ad/AdMax";
import Clip from "../../components/clip/Clip";

import GetMoreButton from "../../components/layout/GetMoreButton";
import { admaxId, siteTitle } from "../../constants/site";
import { useAuth } from "../../hooks/useAuth";
import { useClip } from "../../hooks/useClip";

const Clips = () => {
    const { 
        user, 
    } = useAuth();

    const { 
        clips,
        clipNextPageLink,
        isLoadingClip,
        getMoreClip,
        getFollowings,
        likeUnlike,
        shareClip,
        unShareClip,
        deleteClip
    } = useClip();

    useLayoutEffect(() => {
        if(user) {
            getFollowings();
        }
    },[user]);



    // if ( isLoading || isLoadingClip ) {
    //     return <div style={{width: "100%", height: "calc(100vh -   120px)", display:"flex", alignItems: "center", justifyContent: "center"}}>
    //         <LoadingScreen />
    //     </div>
    // };
    

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>フィード Clips / {siteTitle}</title>
                <meta
                    name="description"
                    content="フィード Clips"
                />
            </Helmet>

            <div className="feed_clips_container">
                <div className="navigation" >
                    <div className="nav_item" >
                        <Link to="/">投稿</Link>
                    </div>
                    
                    <div className="nav_item active_nav_item" >
                        <Link to="/clips">クリップ</Link>
                    </div>
                </div>
                
                {/* { isLoadingClip 
                        ?   <div style={{ height:"100px", display:"flex", alignItems: "center", justifyContent: "center" }}>
                                <Loader />
                            </div>

                        : null
                } */}

                <section>
                    <div className="clips_container" >
                        <ul className="clip_list" >
                            { (clips && clips?.length > 0 && !isLoadingClip )
                                ?   clips.map(( clip, i ) => 
                                        <li key={i} >
                                            <Clip 
                                                clip={clip} 
                                                // user={user} 
                                                loginId={user ? user.id : ""}
                                                likeUnlike={likeUnlike} 
                                                shareClip={shareClip} 
                                                unShareClip={unShareClip} 
                                                deleteClip={deleteClip}
                                            /> 
                                            {/* {(i%6 === 0) && <div style={{margin: "15px auto", width: "300px"}} ><AdmaxSwitch id={admaxId} /></div>} */}
                                        </li>
                                    )
                                : <div className="clip_no_contents">
                                    フォロー中のユーザーのクリップがありません。
                                </div>
                            }

                            { ( clips && clipNextPageLink ) && 
                                <GetMoreButton nextPageLink={clipNextPageLink} gerMoreFunc={getMoreClip} />
                            }
                            <div style={{margin: "15px auto", width: "300px"}}>
                                <AdmaxSwitch id={admaxId} />
                            </div>
                    
                        </ul>
                    </div>
                </section>
            </div>  

        </div>
    )
};

export default Clips;
