import { Helmet } from 'react-helmet';

import Clip from '../../components/clip/Clip';
import GetMoreButton from '../../components/layout/GetMoreButton';
import SearchForm from '../../components/layout/SearchForm';
import UserList from '../../components/prof/UserList';
import VlideCard from '../../components/vlide/drafts/VlideCard';
import { siteTitle } from '../../constants/site';
import { useTag } from '../../hooks/useTag';

const Tag = () => {
    const {
        user,
        message,
        vlides,
        vlideNextPageLink,
        clips,
        clipNextPageLink,
        users,
        userNextPageLink,
        keyword, 
        setKeyword,
        order,
        setOrder,
        section,
        setSection,
        search,
        getMoreVlide,
        getMoreClip,
        getMoreUser,
        savedUnsaved,
        likeUnlike,
        shareClip,
        unShareClip,
        followUnfollow,
        destroy,
        deleteClip
        
    } = useTag(
        { 
            keyword: "", 
            order: "top", 
            section: "vlide", 
        }
    );

    return (
            <div className="search_container">

                <Helmet>
                    <meta charSet="utf-8" />
                    <title>検索 / {siteTitle}</title>
                    <meta
                        name="description"
                        content="検索"
                    />
                </Helmet>
                
                <div className="posts_list_container__header">
                    <SearchForm 
                        keyword={keyword}
                        setKeyword={setKeyword}
                        order={order} 
                        setOrder={setOrder}
                        section={section}
                        setSection={setSection}
                        search={search}
                    />
                </div>

                <section>
                    {message 
                        ?   <div style={{ 
                                display: "flex", 
                                justifyContent: "center",
                                alignItems: "center", 
                                height: "30vh",
                                fontWeight: "600" 
                            }}>
                                {message}
                            </div>
                        : null
                    }
                    {/* VLIDES */}
                    {vlides?.length 
                        ?   <div className="vlide_container">
                                <div className="sub_title"></div>

                                <ul className="vlide_list">
                                    {vlides.map(( vlide, i ) => 
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
                        : null
                    }
                    { ( vlides && vlideNextPageLink ) && 
                        <GetMoreButton nextPageLink={vlideNextPageLink} gerMoreFunc={getMoreVlide} />
                    }
                    {/* CLIPS */}
                    {clips?.length
                        ? <div style={{width: "100%"}}>
                                {clips && clips.map(( clip, i ) => 
                                    <li key={i} className="clip_card">
                                        <Clip
                                            clip={clip} 
                                            // user={user} 
                                            loginId={user ? user.id : ""}
                                            likeUnlike={likeUnlike} 
                                            shareClip={shareClip}
                                            unShareClip={unShareClip}
                                            deleteClip={deleteClip}
                                        /> 
                                    </li>
                                )}
                        </div>
                        : null
                    }
                    { ( clips && clipNextPageLink ) && 
                        <GetMoreButton nextPageLink={clipNextPageLink} gerMoreFunc={getMoreClip} />
                    }


                    {/* USER */}
                    {users?.length 
                        ?   <div>
                                <UserList 
                                    accountId={user?.id} 
                                    users={users} 
                                    followUnfollow={followUnfollow} 
                                    toggleUserList={()=>{}}
                                />
                            </div>
                        : null
                    }
                    { ( users && userNextPageLink ) && 
                        <GetMoreButton nextPageLink={userNextPageLink} gerMoreFunc={getMoreUser} />
                    }

                </section>
            </div>
    )
};

export default Tag;