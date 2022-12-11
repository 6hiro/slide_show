import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BiX } from 'react-icons/bi';

import useToggle from '../../hooks/useToggle';
import { useProf } from '../../hooks/useProf';
import { admaxId, siteTitle } from '../../constants/site';
import EditProfileForm from '../../components/user/EditProfileForm';
import GetMoreButton from '../../components/layout/GetMoreButton';
import VlideCard from '../../components/vlide/drafts/VlideCard';
import LoadingScreen from '../../components/layout/LoadingScreen';
import Clip from '../../components/clip/Clip';
import UserList from '../../components/prof/UserList';
import DecoratedDescription from '../../components/prof/DecoratedDescription';
import Loader from '../../components/layout/Loader';
import { AdmaxSwitch } from '../../components/Ad/AdMax';

const Profile = () => {
    const [openEditForm, toggleEditForm] = useToggle(false);
    const [openUserList, toggleUserList] = useToggle(false);
    // const profCard = useRef<HTMLDivElement | null>(null);

    const { username } = useParams();

    const { 
        user,
        isLoading,
        prof,
        isLoadingProf,
        isLoadingContents,
        section,
        vlides,
        clips,
        users,
        vlideNextPageLink,
        clipNextPageLink,
        userNextPageLink,
        changeSection, 
        getFollowers,
        getFollowings,
        followUnfollow,
        getMoreVlides,
        getMoreClips,
        getMoreUsers,
        updateProf,
        destroy,
        deleteClip,
        savedUnsaved,
        likeUnlike,
        shareClip,
        unShareClip
    } = useProf({
        username,
    });

    const updateProfile = async (nick_name:string, descirption:string) => {
        updateProf(nick_name, descirption);
        toggleEditForm(false);
    }

    useEffect(() => {
        toggleEditForm(false);
        toggleUserList(false);
    }, [username]);

    if(isLoading) {
        return <div style={{ height:"100vh", display:"flex", alignItems: "center", justifyContent: "center" }}>
                    <LoadingScreen/>
                </div>
    }


    if (!prof) {
        if(isLoadingProf) {
            return <div style={{ height:"100vh", display:"flex", alignItems: "center", justifyContent: "center" }}>
                        <LoadingScreen/>
                    </div>
        }else{
            return <div style={{ height:"50vh", display:"flex", alignItems: "center", justifyContent: "center" }}>
                        {/* <div style={{fontWeight: "600"}}>ユーザが存在しません</div> */}
                    </div>
        }
    }

    return (
        <div 
            className="prof_container"
            // onClick={() =>profCard.current?.focus()}
        >
            <Helmet>
                <meta charSet="utf-8" />
                <title>アカウント / {siteTitle}</title>
                <meta
                    name="description"
                    content="アカウント"
                />
            </Helmet>

            <div 
                className="prof_card"
                id="prof_card"
            >
                <div className="header_section">
                    <div className="nickname">
                        {prof.nick_name}
                    </div>                    
                </div>

                <div className="profile">
                    <div 
                        className="img_box" 
                    >
                        {[...prof.nick_name][0]}
                    </div>
                    <h3 className="username">
                        @{prof.name} 
                    </h3>
                    {
                        prof.description
                        ?   <div className="descirption">
                                <DecoratedDescription content={prof.description} />
                            </div>
                        : null
                    }


                    <div className="middle_info">
                        {openUserList && users?.length
                            ? <div className="user_list" >
                                    <div className="overlay" onClick={toggleUserList}></div>
                                    <div className="formContainer" >
                                        <div className="closeForm" onClick={toggleUserList} ><BiX/></div>
                                        <div className="form" >
                                            {users?.length 
                                                ?   <div>
                                                        <UserList
                                                            accountId={user?.id} 
                                                            users={users} 
                                                            followUnfollow={followUnfollow} 
                                                            toggleUserList={toggleUserList}
                                                        />
                                                    </div>
                                                : null
                                            }
                                            { ( users && userNextPageLink ) && 
                                                <GetMoreButton nextPageLink={userNextPageLink} gerMoreFunc={getMoreUsers} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            : null
                        }
                        <div className="post_followers_following">
                            <div className="post">
                                <h2>{Number(prof.count_vlides).toLocaleString()}</h2>
                                <p>投稿</p>
                            </div>
                            <div 
                                className="followers"
                                onClick={()=>{
                                    if(prof.count_followers) {
                                        getFollowers(prof.id)
                                        toggleUserList(true);
                                    }
                                }}
                            >
                                <h2>{Number(prof.count_followers).toLocaleString()}</h2>
                                <p>フォロワー</p>
                            </div>
                            <div 
                                className="following"
                                onClick={()=>{
                                    if(prof.count_followings) {
                                        getFollowings(prof.id)
                                        toggleUserList(true);
                                    }
                                }}
                            >
                                <h2>{Number(prof.count_followings).toLocaleString()}</h2>
                                <p>フォロー中</p>
                            </div>
                        </div>
                    </div>

                    {user?.id === prof?.id
                        ?   <div className="follow_button">
                                {openEditForm 
                                    ? <div className="editForm" >
                                            <div className="overlay" onClick={toggleEditForm}></div>
                                            <div className="formContainer" >
                                                <div className="closeForm" onClick={toggleEditForm} ><BiX/></div>
                                                <div className="form" >
                                                    <EditProfileForm user={prof} updateProf={updateProfile} />
                                                </div>
                                            </div>
                                        </div>
                                    : null
                                }
                                <button onClick={toggleEditForm}>プロフィールを編集</button>
                            </div>
                        :   <div className="follow_button">
                                {prof.isFollowed 
                                    ?  <button onClick={() => followUnfollow(prof.id) } className="followed">フォロー中</button>
                                    :  <button onClick={() => followUnfollow(prof.id) }>フォローする</button>
                                }
                            </div>
                    }
                </div>
   

                <div className="nav" >
                    <p 
                        className={`nav_item ${section==='vlides' && "active_nav_itme"}`}
                        onClick={() => changeSection('vlides')}
                    >
                        投稿
                    </p>
                    <p 
                        className={`nav_item ${section==='clips' && "active_nav_itme"}`}
                        onClick={() => changeSection('clips')}
                    >
                        クリップ
                    </p>
                    <p 
                        className={`nav_item ${section==='bookmarks' && "active_nav_itme"}
                        `}
                        onClick={() => changeSection('bookmarks')}
                    >
                        保存
                    </p>
                    <p 
                        className={`nav_item ${section==='likes' && "active_nav_itme"}
                        `}
                        onClick={() => changeSection('likes')}
                    >
                        いいね
                    </p>
                </div>

                <div className="lower_section">
                    { isLoadingContents 
                        ?   <div style={{ height:"100px", display:"flex", alignItems: "center", justifyContent: "center" }}>
                                <Loader />
                            </div>

                        : null
                    }


                    { ( !vlides?.length && !clips?.length && !isLoadingContents ) && 
                        <div className="prof_content_container">
                            <div className="prof_content">
                                {section==="vlides" ? "まだ投稿がありません" : null}
                                {section==="clips" ? "まだクリップがありません" : null}
                                {section==="bookmarks" ? "まだ保存がありません" : null}
                                {section==="likes" ? "まだいいねがありません" : null}
                            </div>
                        </div>
                    }

                    {/* Clips */}
                    {clips?.length
                        ? <div style={{width: "100%"}}>
                                {clips && clips.map(( clip, i ) => 
                                    <li key={i} className="clip_card">
                                        <Clip 
                                            clip={clip} 
                                            loginId={user ? user.id : ""}
                                            likeUnlike={likeUnlike} 
                                            shareClip={shareClip}
                                            unShareClip={unShareClip}
                                            deleteClip={deleteClip}
                                        /> 
                                        {(i%6 === 0) && <div style={{margin: "15px 0"}} ><AdmaxSwitch id={admaxId} /></div>}
                                    </li>
                                )}
                        </div>
                        : null
                    }
                    { ( clips && clipNextPageLink ) && 
                        <GetMoreButton nextPageLink={clipNextPageLink} gerMoreFunc={getMoreClips} />
                    }

                    {/* Vlides */}
                    {vlides?.length 
                        ?  <div className="vlide_container">
                            <ul className="vlide_list">
    
                                {vlides && vlides.map(( vlide, i ) => 
                                    <li key={i} className="vlide_card">
                                        <VlideCard vlide={vlide} loginId={user ? user.id : ""} savedUnsaved={savedUnsaved} destroy={destroy} /> 
                                    </li>
                                )}
                            </ul>
                        </div>
                        : null
                    }
                    { ( vlides && vlideNextPageLink ) && 
                        <GetMoreButton nextPageLink={vlideNextPageLink} gerMoreFunc={getMoreVlides} />
                    }
                    { vlides && <div style={{margin: "15px 0"}} ><AdmaxSwitch id={admaxId} /></div> }
                </div>



            </div>
            
        </div>
    )
};

export default Profile;