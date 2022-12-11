import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { AdmaxSwitch } from '../../components/Ad/AdMax';

import AddClipForm from '../../components/clip/AddClipForm';
import Clip from '../../components/clip/Clip';
import { admaxId, siteTitle } from '../../constants/site';
import { useAuth } from '../../hooks/useAuth';
import { useClip } from '../../hooks/useClip';



const DetailClip = () => {
    const { clip_id } = useParams();
    const clipIdRef = useRef<string | null>(null);

    const { user } = useAuth();
    const { 
        clip,
        clips,
        text, 
        setText,
        retrieve,
        likeUnlike,
        shareClip,
        unShareClip,
        deleteClip,
        addReply
    } = useClip();

    useEffect(() => {
        if(typeof clip_id === "string") {
            clipIdRef.current = clip_id;
            retrieve(clip_id);
        } 
    }, [clip_id]); // router.queryの取得はuseEffectの発火タイミングより後?

    const [loading, setLoading] = useState(false);
    // const [quote, setQuote] = useState("")
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

    const addClip = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        if(loading) return;

        setLoading(true);

        if(typeof clipIdRef.current === "string") {

            const data = {
                id: clipIdRef.current,
                content: text,
            };

            addReply(data);
        }

        setLoading(false);
    };


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
                <Clip
                    clip={clip}
                    loginId={user ? user.id : ""}
                    likeUnlike={likeUnlike} 
                    shareClip={shareClip}
                    unShareClip={unShareClip}
                    deleteClip={deleteClip}
                />

                <div style={{margin: "15px auto"}} ><AdmaxSwitch id={admaxId} /></div>

                
                <div style={{ }} className="reply_form">
                    <AddClipForm
                        text={text} 
                        setText={setText} 
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
                        <li key={i} >
                            <Clip
                                clip={clip}
                                loginId={user ? user.id : ""}
                                likeUnlike={likeUnlike} 
                                shareClip={shareClip}
                                unShareClip={unShareClip}
                                deleteClip={deleteClip}
                            />
                            {/* {(i%6 === 0) && <div style={{margin: "15px auto"}} ><AdmaxSwitch id={admaxId} /></div>} */}
                        </li>
                    ))}
                </ul>
            </div>



        </div>
    )
};

export default DetailClip;