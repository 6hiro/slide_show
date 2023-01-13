import { useLayoutEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Clip from "../../components/clip/Clip";

import GetMoreButton from "../../components/layout/GetMoreButton";
import LoadingScreen from "../../components/layout/LoadingScreen";
import { siteTitle } from "../../constants/site";
import { useAuth } from "../../hooks/useAuth";
import { useClip } from "../../hooks/useClip";

type Props = {
    user: any;
}
const Clips = (props: Props) => {
    const { user } = props;

    const { 
        clips,
        clipNextPageLink,
        clipUsers, 
        clipUserNextPageLink,
        isLoadingClip,
        getMoreClip,
        getMoreClipUsers,
        getFollowings,
        getShareUsers,
        getlikeUsers,
        likeUnlike,
        shareClip,
        unShareClip,
        deleteClip,
        clipfollowUnfollow
    } = useClip();

    useLayoutEffect(() => {
        if(user) {
            getFollowings();
        }
    },[user]);

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>フィード - クリップ / {siteTitle}</title>
                <meta
                    name="description"
                    content="フィード Clips"
                />
            </Helmet>

            <div className="feed_clips_container">
                <div className="navigation" >
                    <Link to="/" className="nav_item" >
                        投稿
                    </Link>
                    
                    <Link to="/clips" className="nav_item active_nav_item" >
                        クリップ
                    </Link>
                </div>

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
                                                getShareUsers={getShareUsers}
                                                shareClip={shareClip} 
                                                unShareClip={unShareClip} 
                                                deleteClip={deleteClip}
                                                getlikeUsers={getlikeUsers}
                                                users={clipUsers}
                                                userNextPageLink={clipUserNextPageLink}
                                                getMoreUser={getMoreClipUsers}
                                                followUnfollow={clipfollowUnfollow}
                                            /> 
                                        </li>
                                    )
                                : <div className="clip_no_contents">
                                    {
                                        !isLoadingClip 
                                            ? "フォロー中のユーザーのクリップがありません。" 
                                            :  <LoadingScreen />
                                    }
                                </div>
                            }

                            { ( clips && clipNextPageLink ) && 
                                <GetMoreButton nextPageLink={clipNextPageLink} gerMoreFunc={getMoreClip} />
                            }
                    
                        </ul>
                    </div>
                </section>
            </div>  

        </div>
    )
};

export default Clips;
