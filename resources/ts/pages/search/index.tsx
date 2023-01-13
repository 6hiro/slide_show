import { Helmet } from 'react-helmet';

import Clip from '../../components/clip/Clip';
import GetMoreButton from '../../components/layout/GetMoreButton';
import SearchForm from '../../components/layout/SearchForm';
import UserList from '../../components/prof/UserList';
import Vlide from '../../components/vlide/vlideCard/Vlide';
import { siteTitle } from '../../constants/site';
import { useSearch } from '../../hooks/useSearch';

type Props = {
    user: any;
}
const Search = (props: Props) => {
    const { user } = props;

    const {
        message,
        vlides,
        vlideNextPageLink,
        clips,
        clipNextPageLink,
        users,
        userNextPageLink,
        clipUsers, 
        clipUserNextPageLink,
        keyword, 
        setKeyword,
        order,
        setOrder,
        section,
        setSection,
        search,
        getlikeUsers,
        getShareUsers,
        getMoreVlide,
        getMoreClip,
        getMoreUser,
        getMoreClipUsers,
        savedUnsaved,
        likeUnlike,
        shareClip,
        unShareClip,
        followUnfollow,
        clipfollowUnfollow,
        deleteVlide,
        deleteClip
    } = useSearch(
        { 
            user,
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
                                            <Vlide 
                                                vlide={vlide} 
                                                loginId={user ? user.id : ""} 
                                                savedUnsaved={savedUnsaved} 
                                                destroy={deleteVlide}
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
                                            loginId={user ? user.id : ""}
                                            likeUnlike={likeUnlike} 
                                            shareClip={shareClip}
                                            unShareClip={unShareClip}
                                            deleteClip={deleteClip}
                                            getShareUsers={getShareUsers}
                                            getlikeUsers={getlikeUsers}
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
                        <GetMoreButton nextPageLink={clipNextPageLink} gerMoreFunc={getMoreClip} />
                    }

                    



                    {/* USER */}
                    {users?.length 
                        ?   <div 
                                style={{maxWidth: "800px", margin: "0 auto"}}
                            >
                                <div style={{ margin: "0 10px"}}>
                                    <UserList 
                                        loginId={user?.id} 
                                        users={users} 
                                        followUnfollow={followUnfollow} 
                                        toggleUserList={()=>{}}
                                    />
                                </div>
                            </div>
                        : null
                    }
                    
                    { ( users && userNextPageLink ) && 
                        <GetMoreButton nextPageLink={userNextPageLink} gerMoreFunc={getMoreUser} />
                    }

                    {/* <div style={{margin: "15px auto", maxWidth: "650px", display: "flex",  flexWrap: "wrap"}} >
                        <div style={{margin: "10px auto", width: "300px"}} >
                            <AdmaxSwitch id={admaxId} />
                        </div>
                        <div style={{margin: "10px auto", width: "300px"}} >
                            <AdmaxSwitch id={admaxId2} />
                        </div>
                    </div> */}
                </section>
            </div>

            
    )
};

export default Search;