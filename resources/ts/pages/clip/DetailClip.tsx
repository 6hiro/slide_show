import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { AdmaxSwitch } from '../../components/ad/AdMax';

import AddClipForm from '../../components/clip/AddClipForm';
import Clip from '../../components/clip/Clip';
import { admaxId, admaxId2, siteTitle } from '../../constants/site';
import { useClip } from '../../hooks/useClip';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import { generateUid } from '../../utils/uid';


type Props = {
    user: any;
}

const DetailClip = (props: Props) => {
    const { clip_id } = useParams();
    const clipIdRef = useRef<string | null>(null);
    const [toastNotifications, setToastNotifications] = useContext(ToastNotificationsContext);

    const { user } = props;
    const { 
        clip,
        clips,
        text, 
        clipUsers,
        clipUserNextPageLink,
        setText,
        retrieve,
        getShareUsers,
        getlikeUsers,
        getMoreClipUsers,
        likeUnlike,
        shareClip,
        unShareClip,
        deleteClip,
        addReply,
        followUnfollow,
        clipfollowUnfollow
    } = useClip();

    useEffect(() => {
        if(typeof clip_id === "string") {
            clipIdRef.current = clip_id;
            retrieve(clip_id);
        } 
    }, [clip_id]); // router.queryの取得はuseEffectの発火タイミングより後?

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

    const addClip = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        if(loading) return;

        if(!props.user?.id) {
            setToastNotifications(prev => {
                return[
                    // ...prev,
                    {id: generateUid(), type:"warning", message:"リプライを追加するにはログインが必要です"},
                ];
            });
        }

        setLoading(true);

        if(typeof clipIdRef.current === "string") {

            const data = {
                id: clipIdRef.current,
                content: text.replace(/(\r\n){3,}|\r{3,}|\n{3,}/, '\n\n'),
            };

            addReply(data);
        }

        setLoading(false);
    };
    useEffect(() => {
        document.getElementById("main_clip")?.scrollIntoView({ 
            // behavior: 'auto',
        });
    },[clip?.id]);

    if(!clip) return null;


    return (
        <div className='clip_detail_container'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{clip.user?.nick_name + " / " + clip.content} / {siteTitle}</title>
                <meta
                    name="description"
                    content={clip.content.slice(0,100)}
                />
            </Helmet>
            <div>
                {clip.parent
                    ?   
                        <div className='parent_clip'>
                            <Clip
                                clip={clip.parent}
                                loginId={user ? user.id : ""}
                                getShareUsers={getShareUsers}
                                getlikeUsers={getlikeUsers}
                                likeUnlike={likeUnlike} 
                                shareClip={shareClip}
                                unShareClip={unShareClip}
                                deleteClip={deleteClip}
                                users={clipUsers}
                                userNextPageLink={clipUserNextPageLink}
                                getMoreUser={getMoreClipUsers}
                                followUnfollow={followUnfollow}
                            />
                        </div>

                    : null
                }
                <div 
                    className='main_clip parent_clip' 
                    id="main_clip"
                    style={{ scrollMarginTop: "70px"}}
                >
                    <Clip
                        clip={clip}
                        loginId={user ? user.id : ""}
                        getShareUsers={getShareUsers}
                        getlikeUsers={getlikeUsers}
                        likeUnlike={likeUnlike} 
                        shareClip={shareClip}
                        unShareClip={unShareClip}
                        deleteClip={deleteClip}
                        users={clipUsers}
                        userNextPageLink={clipUserNextPageLink}
                        getMoreUser={getMoreClipUsers}
                        followUnfollow={followUnfollow}
                    />
                </div>
                
                <div className="reply_form">
                    <AddClipForm
                        text={text} 
                        setText={setText} 
                        quote={null}
                        image={image}
                        setImage={setImage}
                        previewImage={previewImage}
                        setPreviewImage={setPreviewImage}
                        addClip={addClip}
                        placeholder="リプライを追加"
                        button='追加する'
                        autoFocus={false}
                    />
                </div>
            </div>

            <div>

                <ul className='replies_container'>
                    {clips?.map((clip, i) => (
                        <li key={i} className="reply_clip" >
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
                            {i===5 
                                ? <div style={{margin: "15px auto", width: "300px"}} ><AdmaxSwitch id={admaxId} /></div>
                                : null
                            }
                        </li>
                    ))}
                
                </ul>
                {/* <div style={{margin: "15px auto", width: "300px"}} ><AdmaxSwitch id={admaxId2} /></div>  */}

            </div>
            

        </div>
    )
};

export default DetailClip;