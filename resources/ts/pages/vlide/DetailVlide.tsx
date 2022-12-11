import React, { useEffect, useRef, useState } from 'react';
import Prism from "prismjs";
import 'prismjs/components/prism-bash' // Language
import 'prismjs/components/prism-c' // Language
import 'prismjs/components/prism-csharp' // Language
import 'prismjs/components/prism-cpp' // Language
import 'prismjs/components/prism-dart' // Language
import 'prismjs/components/prism-docker' // Language
import 'prismjs/components/prism-go' // Language
import 'prismjs/components/prism-java' // Language
import 'prismjs/components/prism-javascript' // Language
import 'prismjs/components/prism-json' // Language
import 'prismjs/components/prism-jsx.js' //
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-python'; // Language
import 'prismjs/components/prism-r'; // Language
import 'prismjs/components/prism-ruby'; // Language
import 'prismjs/components/prism-rust'; // Language
import 'prismjs/components/prism-sql'; // Language
import 'prismjs/components/prism-typescript'; // Language
import 'prismjs/components/prism-markup'; // Language
import 'prismjs/components/prism-markdown'; // Language
import 'prismjs/components/prism-nginx'; // Language
import 'prismjs/components/prism-css'; // Language
import 'prismjs/components/prism-sass'; // Language
import 'prismjs/components/prism-scss'; // Language
import 'prismjs/components/prism-graphql'; // Language
import 'prismjs/components/prism-plsql' ;// Language
import {  BiCaretDown, BiCaretRight, BiPaperclip, BiX } from 'react-icons/bi';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import useToggle from '../../hooks/useToggle';
import { useGetVlide } from '../../hooks/useGetVlide';
import { useClip } from '../../hooks/useClip';
import Slide from '../../components/vlide/drafts/Slide';
import TimeController from '../../components/vlide/drafts/TimeController';
import AddClipForm from '../../components/clip/AddClipForm';
import LoadingScreen from '../../components/layout/LoadingScreen';
import { admaxId, admaxId2, siteTitle, siteURL } from '../../constants/site';
import GetMoreButton from '../../components/layout/GetMoreButton';
import Clip from '../../components/clip/Clip';
import { convertToSeconds, parser } from '../../utils/TimeController';
import { slideRegExp } from '../../utils/regexps';
import { AdmaxSwitch } from '../../components/Ad/AdMax';

const Detail = () => {
    const { vlide_id } = useParams();
    const { hash } = useLocation();

    const [on, toggle] = useToggle(false);

    const {
        user,
        retrieve,
        vlide,
        currentTime, 
        setCurrentTime,
        isRunning,
        setIsRunning,
        savedUnsaved
    } 
    = useGetVlide();
    
    const { 
        clips,
        clipNextPageLink,
        text, 
        setText,
        create,
        getVlideClips,
        getMoreClip,
        likeUnlike,
        shareClip,
        unShareClip,
        deleteClip
    } = useClip();

    const contentContainerRef = useRef<HTMLDivElement | null>(null);
    const vlideIdRef = useRef<string | null>(null);

    const contentArray = vlide?.content ?  parser(vlide.content) : [];
    const timeStamps = contentArray?.map((content) => { return convertToSeconds(content.time) });
    const toc = contentArray?.filter(content => content.type==='h1' || content.type=='h2');
    

    useEffect(() => {
        if(typeof vlide_id === "string") {
            vlideIdRef.current = vlide_id;
            retrieve(vlide_id);
        } 
    }, [vlide_id]); // router.queryの取得はuseEffectの発火タイミングより後?

    useEffect(() => {
        Prism.highlightAll();
    }, [vlide?.content]);

    useEffect(() => { // urlからこのページに遷移してきた場合
        if(hash){
            document.getElementById(`${hash}`)?.scrollIntoView({ 
                behavior: 'smooth',
            });
        }
    }, [hash]);

    const [loading, setLoading] = useState(false);
    const [quote, setQuote] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

    const addClip = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        if(loading) return;

        setLoading(true);

        if(typeof vlideIdRef.current === "string") {

            const data = {
                id: vlideIdRef.current,
                content: text,
                quote: quote,
            };

            create(data);
        }

        setLoading(false);
    };

    const handleSelect = (e: React.TouchEvent | React.MouseEvent) => {

        const selection = document.getSelection();
        const range = selection?.getRangeAt(0);
        
        if( selection && selection.toString().trim().length >= 10 && user){
            if(
                range 
                && e.currentTarget.contains(range.startContainer) 
                &&  e.currentTarget.contains(range.endContainer)
            ){
                setQuote(selection.toString().trim().slice(0, 180));
                toggle(true);
            }
        }
    };

    const descriptionMatch = vlide?.content.match(slideRegExp);

    if ( !vlide?.id ) {
        return <div style={{width: "100%", height: "calc(100vh -   120px)", display:"flex", alignItems: "center", justifyContent: "center"}}>
            <LoadingScreen />
        </div>
    }


    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{vlide?.title ? vlide.title : "" } / {siteTitle}</title>
                <meta
                    name="description"
                    // content={vlide?.content?.slice(0,100) + "..."}
                    content={descriptionMatch && descriptionMatch[2] ? descriptionMatch[2]  : vlide?.title}

                    
                />


                {/* <meta property="og:url" content={`${siteURL}/vlide/${vlide_id}`} />

                <meta property="og:type" content="article" />

                <meta property="og:title" content={`${vlide?.title ? vlide.title : "" } / ${siteTitle}`} />
                <meta property="og:description" content={`${vlide?.title ? vlide.title : "" }`} />
                <meta property="og:image" content="https://vlides.com/images/LogoOGP.png"/>
                <meta property="og:image:secure_url" content="https://vlides.com/images/LogoOGP.png"/>
                <meta property="og:url" content={`https://vlides.com/${vlide_id}`} />
                <meta property="og:site_name" content="Vlides"/>
                <meta property="og:image:width" content="300"/>
                <meta property="og:image:height" content="300"/>

                <meta name="twitter:title" content={`${vlide?.title ? vlide.title : "" } / ${siteTitle}`}/>
                <meta name="twitter:description" content={`${vlide?.title ? vlide.title : "" }`} />
                <meta name="twitter:image" content="https://vlides.com/images/LogoOGP.png"/>
                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:site" content="@Vlides_" /> */}

            </Helmet>
            
            <div 
                className="detailContainer" 
                style={{ 
                    marginTop: vlide.duration ? "90px" : "20px"
                }}
            >
                <section 
                    ref={contentContainerRef} 
                    className="contentContainer"  
                    aria-label="記事" 
                >

                    <ul>
                        <li className="vlide__dates">
                            {vlide.published_at && 
                                <div>公開日 {vlide.published_at.slice(0,10)}</div>
                            }
                        </li>

                        <li>
                            <h1 className="vlide__title" >{vlide.title}</h1>
                        </li>


                        
                        <li className="vlide__author" >
                            <div className="vlide__author__icon">
                                <Link to={`/prof/${vlide.user.name}`} style={{display: "block"}}>
                                    {[...vlide.user.nick_name][0]}
                                </Link> 
                            </div>

                            <div className="vlide__author__name">
                                <Link to={`/prof/${vlide.user.name}`} style={{display: "block"}}>
                                    {vlide.user.nick_name}
                                </Link>
                            </div>
                        </li>

                        <li>
                            <div onPointerUp={handleSelect} >
                                { contentArray?.map((t, index) => (
                                    <div 
                                        key={index} 
                                        id={String(convertToSeconds(t.time)) + "s"}
                                        style={{ 
                                            scrollMarginTop: vlide.duration ? "140px" : "65px",
                                            // scrollSnapAlign:"start",
                                            pointerEvents: ( Math.floor(currentTime) >= convertToSeconds(t.time) || !isRunning ) 
                                                ? "unset" 
                                                : "none" ,
                                            opacity: ( Math.floor(currentTime) >= convertToSeconds(t.time) || !isRunning ) 
                                                ? "1" 
                                                : "0.05" ,
                                            filter: ( Math.floor(currentTime) >= convertToSeconds(t.time) || !isRunning )  
                                                ? "unset" 
                                                : "blur(2px)",
                                        }}
                                    >
                                        <Slide type={t.type} content={t.content} time={t.time} toc={toc} />
                                    </div>
                                ))}
                            </div>
                        </li>

                        <li className="tag_list_wrapper">
                            <ul className="tag_list">
                                {vlide.tags.map((tag, index) => {
                                    return (
                                        <li key={index} className="tag">
                                            <Link to={`/tag?q=%23${tag.name}&f=vlide&o=top`} key={index} >
                                                <span>
                                                    #{tag.name}
                                                </span> 
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>


                    </ul>

                    <div style={{margin: "15px auto", maxWidth: "650px", display: "flex",  flexWrap: "wrap"}} >
                        <div style={{margin: "10px auto", width: "300px"}} >
                            <AdmaxSwitch id={admaxId} />
                        </div>
                        <div style={{margin: "10px auto", width: "300px"}} >
                            <AdmaxSwitch id={admaxId2} />
                        </div>
                    </div>

                </section>



                <section
                    aria-label="クリップ一覧" 
                    id='clips' 
                    className="clips_container"
                    style={{ 
                        scrollMarginTop: "140px",
                    }}
                >
                    <div  className="clips_title">
                        <button onClick={() => { vlide_id && getVlideClips(vlide_id) }}>
                            {clips?.length 
                                ? <BiCaretDown />
                                : <BiCaretRight />
                            }
                            クリップ ({vlide.count_clips})
                        </button>

                        <ul className="clips_wrapper" >
                            {
                                clips?.map((clip, i) => (
                                    <li key={i}>
                                        <Clip 
                                            clip={clip}
                                            loginId={user ? user.id : ""}
                                            likeUnlike={likeUnlike} 
                                            shareClip={shareClip}
                                            unShareClip={unShareClip}
                                            deleteClip={deleteClip}
                                        /> 
                                    </li>
                                ))
                            }
                        </ul>
                        { ( clips && clipNextPageLink ) && 
                            <GetMoreButton nextPageLink={clipNextPageLink} gerMoreFunc={getMoreClip} />
                        }

                        {/* <div style={{margin: "15px auto" , width: "300px"}} ><AdmaxSwitch id={admaxId2} /></div> */}

                        
                    </div>

                </section>

                {vlide.duration
                    ?<TimeController 
                        durationTime={vlide.duration} 
                        currentTime={currentTime} 
                        setCurrentTime={setCurrentTime} 
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        timeStamps={timeStamps}
                        src={
                            (vlide.audio_file_name.slice(0,16) === "/api/v1/audio?f="  && vlide.audio_file_name.length > 16)
                                ? vlide.audio_file_name 
                                : ""
                        }
                        // src={vlide.audio_file_name}
                        />
                    : null
                }



                { (on && quote) && 
                    <div className="clip_form">
                        <div className="clip_quote" >
                            {quote}
                        </div>

                        <AddClipForm
                            text={text} 
                            setText={setText} 
                            image={image}
                            setImage={setImage}
                            previewImage={previewImage}
                            setPreviewImage={setPreviewImage}
                            addClip={addClip}
                            autoFocus={true}
                            placeholder="ひとこと。"
                        />

                    </div>
                }

                { (on && quote) &&
                    <div 
                        className={`button new_clip_button ${on ? "new_clip_button_pushed" : ""}`} 
                        onClick={toggle}
                    >
                        <BiX />  
                    </div>
                }

                <div 
                    className={`button clips_button`} 
                    onClick={()=>{
                        // Link では遷移しないので
                        document.getElementById("clips")?.scrollIntoView({ 
                            behavior: 'smooth',
                        });
                    }}
                >
                    <BiPaperclip /> 
                </div>

                <div 
                    className={`button bookmark_button`}
                    onClick={() => {
                        if(vlide_id) savedUnsaved(vlide_id)
                    }}
                >
                    {vlide.is_saved 
                        ? <FaBookmark className="bookmarked" />
                        : <FaRegBookmark />
                    }
                </div>

            </div>
        </>
    )
};

export default Detail;
