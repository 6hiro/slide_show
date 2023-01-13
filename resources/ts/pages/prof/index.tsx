import { SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BiX } from 'react-icons/bi';

import useToggle from '../../hooks/useToggle';
import { useProf } from '../../hooks/useProf';
import { siteTitle } from '../../constants/site';
import EditProfileForm from '../../components/prof/EditProfileForm';
import GetMoreButton from '../../components/layout/GetMoreButton';
import LoadingScreen from '../../components/layout/LoadingScreen';
import Clip from '../../components/clip/Clip';
import UserList from '../../components/prof/UserList';
import DecoratedDescription from '../../components/prof/DecoratedDescription';
import Loader from '../../components/layout/Loader';
import ImageGallery from '../../components/prof/ImageGallery';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import DraggableTabs from '../../components/tab/DraggableTabs';
import { generateUid } from '../../utils/uid';
import Vlide from '../../components/vlide/vlideCard/Vlide';
import EditIconForm from '../../components/prof/EditIconForm';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';

type Props ={ 
    user: any;
    isLoading: boolean;
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>
}
const Profile = (props: Props) => {
    const [openIconForm, toggleIconForm] = useToggle(false);
    const [openEditForm, toggleEditForm] = useToggle(false);
    const [openUserList, toggleUserList] = useToggle(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

    const profCard = useRef<HTMLDivElement | null>(null);

    const { username } = useParams();
    const {user, isLoading} = props;
    const { 
        prof,
        isLoadingProf,
        isLoadingContents,
        section,
        vlides,
        clips,
        users,
        clipUsers,
        images,
        vlideNextPageLink,
        clipNextPageLink,
        userNextPageLink,
        clipUserNextPageLink,
        imageNextPageLink,
        changeSection, 
        getlikeUsers,
        getShareUsers,
        getFollowers,
        getFollowings,
        followUnfollow,
        clipfollowUnfollow,
        getMoreVlides,
        getMoreClips,
        getMoreUsers,
        getMoreClipUsers,
        getMoreImages,
        uploadImage,
        deleteImage,
        updateProf,
        deleteVlide,
        deleteClip,
        savedUnsaved,
        likeUnlike,
        shareClip,
        unShareClip
    } = useProf({
        user,
        isLoading,
        username,
    });
    const [toastNotifications, setToastNotifications] = useContext(ToastNotificationsContext);


    const updateProfile = async (nick_name:string, descirption:string) => {
        updateProf(nick_name, descirption, setToastNotifications);
        toggleEditForm(false);
    }

    useEffect(() => {
        toggleEditForm(false);
        toggleUserList(false);

    }, [username]);

    // ロード時に、profCard にフォーカスを当てる
    useEffect(() => {
        if( profCard.current ) {
            profCard.current.focus();
        } 
    },[profCard.current]);

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
            id="prof_container"
            onClick={(e) =>  {
                const { target } = e;
                // prof_container内の全ての要素で、クリック時にフォーカスを当てると、inputなどができなくなるので、
                // target を prof_containerだけに限定する
                if( profCard.current && target instanceof HTMLElement && target.id === "prof_container") {
                   profCard.current?.focus()
                }
            }}
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
                ref={profCard}
                tabIndex={0} 
            >
                <div className="profile">
                    <div className="profile__header">
                        <div className="img_box__wrapper">
                            <div 
                                className="img_box" 
                                onClick={toggleIconForm}
                            >
                                { prof?.file_name 
                                    ? 
                                        <img 
                                            src={prof.file_name}
                                            alt="user icon" 
                                            className="img" 
                                        />

                                    : <>{[...prof.nick_name][0]}</>

                                }
                            </div>
                            {openIconForm && (props.user?.id === prof.id)
                                ?   <EditIconForm 
                                        user={prof}
                                        image={image}
                                        setImage={setImage}
                                        previewImage={previewImage}
                                        setPreviewImage={setPreviewImage}
                                        notifications={toastNotifications}     
                                        setNotifications={setToastNotifications}
                                        uploadImage={uploadImage}
                                        deleteImage={deleteImage}      
                                        toggleIconForm={toggleIconForm}        
                                        refetch={props.refetch}                           
                                    />
                                : null
                            }
                        </div>

                        <div className='name'>
                            <div className="nickname">
                                {prof.nick_name}
                            </div>
                            <h3 className="username">
                                @{prof.name} 
                            </h3>
                        </div>

                    </div>

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
                                    <div className="overlay" onClick={()=>toggleUserList(false)}></div>
                                    <div className="formContainer" tabIndex={0} onClick={(e) => {e.currentTarget.focus()}}  style={{outline: "none"}}>
                                        <div className="closeForm" onClick={()=>toggleUserList(false)} ><BiX/></div>
                                        <div className="form" >
                                            {users?.length 
                                                ?   <div>
                                                        <UserList
                                                            loginId={user?.id} 
                                                            users={users} 
                                                            followUnfollow={followUnfollow} 
                                                            toggleUserList={()=>toggleUserList(false)}
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
                                    if(prof.count_followers && user?.id) {
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
                                    if(prof.count_followings && user?.id) {
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
                                    ?  <button 
                                            onClick={() => {
                                                if(user?.id) {
                                                    followUnfollow(prof.id, user.id);
                                                }
                                            }} 
                                            className="followed">フォロー中</button>
                                    :  <button 
                                            onClick={() => {
                                                if(user?.id) {
                                                    followUnfollow(prof.id, user.id); 
                                                }else{
                                                    setToastNotifications(prev => {
                                                        return[
                                                            // ...prev,
                                                            {id: generateUid(), type:"warning", message:"フォローするにはログインが必要です"},
                                                        ];
                                                    });
                                                }
                                            }}
                                        >フォローする</button>
                                }
                            </div>
                    }
                </div>
   
                <div className="content">
                    <div className="nav" >
                        <DraggableTabs loginId={user ? user.id : ""} isOwnProfile={prof?.id===user?.id} section={section} changeSection={changeSection} setToastNotifications={setToastNotifications} />
                    </div>

                    <div className="lower_section">
                        { isLoadingContents 
                            ?   <div style={{ height:"100px", display:"flex", alignItems: "center", justifyContent: "center" }}>
                                    <Loader />
                                </div>
                            : null
                        }

                        { ( !vlides?.length && !clips?.length && !images?.length && !isLoadingContents ) && 
                            <div className="prof_content_container">
                                <div className="prof_content">
                                    {section==="vlides" ? "まだ投稿がありません" : null}
                                    {section==="clips" ? "まだクリップがありません" : null}
                                    {section==="bookmarks" ? "まだ保存がありません" : null}
                                    {section==="likes" ? "まだいいねがありません" : null}
                                    {section==="images" ? "まだ画像がありません" : null}
                                    {section==="replies" ? "まだ返信がありません" : null}
                                </div>
                            </div>
                        }

                        {/* Clips */}
                        {clips?.length
                            ? <div style={{width: "100%"}} >
                                    {clips && clips.map(( clip, i ) => 
                                        <li key={i} className="clip_card">
                                            <Clip 
                                                clip={clip} 
                                                getShareUsers={getShareUsers}
                                                getlikeUsers={getlikeUsers}
                                                loginId={user ? user.id : ""}
                                                likeUnlike={likeUnlike} 
                                                shareClip={shareClip}
                                                unShareClip={unShareClip}
                                                deleteClip={deleteClip}
                                                users={clipUsers}
                                                userNextPageLink={clipUserNextPageLink}
                                                getMoreUser={getMoreClipUsers}
                                                followUnfollow={clipfollowUnfollow}
                                            /> 
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
                                            <Vlide vlide={vlide} loginId={user ? user.id : ""} savedUnsaved={savedUnsaved} destroy={deleteVlide} /> 
                                        </li>
                                    )}
                                </ul>
                            </div>
                            : null
                        }
                        { ( vlides && vlideNextPageLink ) && 
                            <GetMoreButton nextPageLink={vlideNextPageLink} gerMoreFunc={getMoreVlides} />
                        }

                        {images?.length
                        
                            ?  <div className="">
                                    <ImageGallery imageGallery={images} />
                            </div>
                            : null
                        }
                        {( images && imageNextPageLink ) && 
                            <GetMoreButton nextPageLink={imageNextPageLink} gerMoreFunc={getMoreImages} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Profile;