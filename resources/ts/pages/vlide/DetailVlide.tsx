import React, { useContext, useEffect, useRef, useState, lazy } from 'react';
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
import {  BiCaretDown, BiCaretRight, BiCopy, BiPaperclip, BiX } from 'react-icons/bi';
import { FaRegBookmark, FaBookmark, FaTwitter, FaLine, FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { LineShareButton, TwitterShareButton } from "react-share";

import useToggle from '../../hooks/useToggle';
import { useGetVlide } from '../../hooks/useGetVlide';
import { useClip } from '../../hooks/useClip';
import Slide from '../../components/vlide/Slide';
import TimeController from '../../components/vlide/TimeController';
import AddClipForm from '../../components/clip/AddClipForm';
import LoadingScreen from '../../components/layout/LoadingScreen';
import { admaxId, admaxId2, siteTitle } from '../../constants/site';
import GetMoreButton from '../../components/layout/GetMoreButton';
import Clip from '../../components/clip/Clip';
import { convertToSeconds, parser } from '../../utils/TimeController';
import { slideRegExp } from '../../utils/regexps';
// import { AdmaxSwitch } from '../../components/ad/AdMax';
import DecoratedDescription from '../../components/prof/DecoratedDescription';
import TocContent from '../../components/vlide/TocContent';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import { generateUid } from '../../utils/uid';


type Props = {
    user: any
};
const Detail = (props: Props) => {
    const { user } = props;
    const { vlide_id } = useParams();
    // const { hash } = useLocation();

    const [on, toggleForm] = useToggle(false);
    const [isShowedPopUp, setIsShowedPopUp] = useToggle(false);

    const {
        retrieve,
        vlide,
        currentTime, 
        setCurrentTime,
        isRunning,
        setIsRunning,
        savedUnsaved
    } = useGetVlide();
    
    const { 
        clips,
        clipNextPageLink,
        text, 
        clipUsers, 
        clipUserNextPageLink,
        setText,
        create,
        getVlideClips,
        getMoreClip,
        getMoreClipUsers,
        getlikeUsers,
        getShareUsers,
        likeUnlike,        
        shareClip,
        unShareClip,
        deleteClip,
        clipfollowUnfollow
    } = useClip();

    const [_, setToastNotifications] = useContext(ToastNotificationsContext);

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

    }, [vlide_id]);
    

    useEffect(() => {
        Prism.highlightAll();
        // if(hash){
        //     document.getElementById(`${hash}`)?.scrollIntoView({ 
        //         behavior: 'smooth',
        //     });
        // }
    }, [vlide]);


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
        toggleForm(false);
    };

    const handleSelect = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // const handleSelect = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if( !(e.target instanceof HTMLElement) ) return;            
        // handleMouseUp(e);

        let sel = document.getSelection && document.getSelection();
        if(!sel || sel.rangeCount === 0) return; 

        const selection = document.getSelection();
        const range = selection?.getRangeAt(0);
        
        if( selection && selection.toString().trim().length >= 1){
            if(
                range 
                && e.currentTarget.contains(range.startContainer) 
                &&  e.currentTarget.contains(range.endContainer)
            ){
                setQuote(selection.toString().trim().slice(0, 300));
                // toggleForm(true);
                setIsShowedPopUp(true);
            }else{
                setIsShowedPopUp(false)
            }
        }else{
            setIsShowedPopUp(false)
        }
       
    };

    const descriptionMatch = vlide?.content?.match(slideRegExp);

    if ( !vlide?.id ) {
        return <div style={{width: "100%", height: "calc(100vh -   120px)", display:"flex", alignItems: "center", justifyContent: "center"}}>
            <LoadingScreen />
        </div>
    }

    return (
        <div className="detail_container_wrapper">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{vlide?.title ? vlide.title : "" } / {siteTitle}</title>
                <meta
                    name="description"
                    // content={vlide?.content?.slice(0,100) + "..."}
                    content={descriptionMatch && descriptionMatch[2] ? descriptionMatch[2]  : vlide?.title}
                />
            </Helmet>
            <div className="detail_container">
                <div  className="detail" >
                    <section 
                        ref={contentContainerRef} 
                        className="content_container"  
                        aria-label="記事" 
                    >
                        {isShowedPopUp 
                        ?
                                <div className="vlide_popup">
                                    <div 
                                        className="vlide_popup__item clip_button" 
                                        onClick={()=>{
                                            if(user){
                                                toggleForm(true);
                                            }else{
                                                setToastNotifications(prev => {
                                                    return[
                                                        {id: generateUid(), type:"error", message:"クリップするにはログインが必要です"},
                                                    ];
                                                });
                                            }
                                            setIsShowedPopUp(false);
                                        }}
                                    ><BiPaperclip /></div>
                                    <div 
                                        className="vlide_popup__item copy_button" 
                                        onClick={()=>{
                                            navigator.clipboard.writeText(quote);
                                            setIsShowedPopUp(false);
                                            setToastNotifications(prev => {
                                                return[
                                                    {id: generateUid(), type:"success", message:"選択内容がコピーされました"},
                                                ];
                                            });
                                        }}
                                    ><BiCopy /></div>
                                </div>

                        :null}
                        {vlide.header_file_name 
                            ?   <div
                                    className='vlid__header_img' 
                                >
                                    <img 
                                        src={vlide.header_file_name} 
                                        alt="header_img" 
                                        width= "1048px"
                                        height= "214px"
                                        // style={{width: "1048px", height: "214px"}} 
                                    />
                                    <div className="img_cover" 
                                        style={{
                                            bottom: "0",
                                            left: "0",
                                            position: "absolute",
                                            right: "0",
                                            top: "0"}}></div>
                                </div>
                            : null
                        }  
                        <header className='vlide__header'>
                            <div className="vlide__header__author">
                                <div className="vlide__header__author__icon">
                                    <Link to={`/prof/${vlide.user.name}`}>
                                        { vlide.user?.file_name 
                                            ? 
                                                <img 
                                                    src={vlide.user.file_name}
                                                    alt="user icon" 
                                                    className="img" 
                                                    style={{borderRadius: "50%"}}
                                                />

                                            : <> {[...vlide.user.nick_name][0]}</>

                                        }
                                    </Link> 

                                </div>
                                <div>
                                    <div className="vlide__header__author__name">
                                            <Link to={`/prof/${vlide.user.name}`}>
                                            {vlide.user.nick_name}
                                        </Link>
                                    </div>
                                    <time 
                                        className="vlide__header__author__dates"
                                        dateTime={vlide.published_at.slice(0,10)}
                                        itemProp="datepublished"
                                    >
                                        {vlide.published_at && 
                                            <div>{vlide.published_at.slice(0,10).replace(/-/g, ' / ')}</div>
                                        }
                                    </time>
                                </div>
                            </div>
                            <div className="vlide__header__action">
                                <li className="vlide__header__action__button twitter_icon">
                                    <TwitterShareButton
                                        url={`https://${window.location.hostname}/vlide/${vlide.id}`}
                                        title={vlide.title}
                                        className=""
                                        hashtags={["Vlides"]}
                                    >
                                        <FaTwitter size={28} className="" />
                                    </TwitterShareButton>
                                </li>
                                <li className="vlide__header__action__button line_icon">
                                    <LineShareButton
                                        url={`https://${window.location.hostname}/vlide/${vlide.id}`}
                                        title={vlide.title}
                                        className="" 
                                    >
                                        <FaLine size={28} className="" />
                                        {/* <LineIcon size={38} round /> */}
                                    </LineShareButton>
                                </li>
                                <li className="vlide__header__action__button" >
                                    <div 
                                        onClick={() => {
                                            if(props.user?.id){
                                                if(vlide_id) savedUnsaved(vlide_id);
                                            }else{
                                                setToastNotifications(prev => {
                                                    return[
                                                        // ...prev,
                                                        {id: generateUid(), type:"warning", message:"投稿を保存するにはログインが必要です"},
                                                    ];
                                                });
                                            }
                                        }}
                                    >
                                        {vlide.is_saved 
                                            ? <FaBookmark className="bookmarked_icon" size={22} />
                                            : <FaRegBookmark className="unbookmarked_icon" size={22} />
                                        }
                                    </div>
                                </li>
                                {vlide.user.id === user?.id
                                    ? <li className="vlide__header__action__button" >
                                            <div>
                                                <Link to={`/drafts/vlide/${vlide.id}`}  className="edit_icon" >
                                                    <FaEdit size={28}/>
                                                </Link>
                                            </div>
                                        </li>
                                    : null
                                }


                            </div>

                        </header>

                        <section>
                            <h1 className="vlide__title" >{vlide.title}</h1>

                                

                            <div 
                                // onPointerDown={(e) => {
                                //     setIsShowedPopUp(false)
                                // }}
                                onPointerUp={handleSelect} 
                            >
                                { contentArray?.map((t, index) => (
                                    <div 
                                        key={index+"slide"} 
                                        id={String(convertToSeconds(t.time)) + "s"}
                                        style={{ 
                                            // scrollMarginTop: vlide.duration ? "155px" : "65px",
                                            scrollMarginTop: "82px",
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
                                        onClick={e => {
                                            const {target} = e;
                                            if(target instanceof HTMLSpanElement && target.id === "slide_img_cover"){
                                                const previousSibling = target.previousSibling;
                                                if(previousSibling instanceof HTMLImageElement){
                                                    // if(previousSibling.src.slice(0,34)===`${siteURL}/api/v1/image?f=`){
                                                    if(previousSibling.src.slice(0,37)===`http://127.0.0.1:8000/api/v1/image?f=`){
                                                        const path = previousSibling.src.split("image?f=").length===2 
                                                            ? previousSibling.src.split("image?f=")[1]
                                                            : null;
                                                        if(path && path.length < 300){
                                                            setQuote("!"+path);
                                                            toggleForm(true);
                                                        }
                                                    }

                                                }
                                            }
                                        }}
                                    >
                                        <Slide type={t.type} content={t.content} time={t.time} toc={toc} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="tag_list_wrapper">
                            <ul className="tag_list">
                                {vlide.tags.map((tag, index) => {
                                    return (
                                        <li key={tag.id} className="tag">
                                            <Link to={`/tag?q=%23${tag.name}&f=vlide&o=top`} key={index} >
                                                <span>
                                                    #{tag.name}
                                                </span> 
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>



                        <div style={{margin: "15px auto", maxWidth: "650px", display: "flex",  flexWrap: "wrap"}} >
                            {/* <div style={{margin: "10px auto", width: "300px"}} >
                                <AdmaxSwitch id={admaxId} />
                            </div> */}
                            <div style={{margin: "10px auto", width: "300px"}} >
                                {/* <AdmaxSwitch id={admaxId2} /> */}
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
                            <button 
                                onClick={() => { 
                                    if(user?.id) {
                                        (vlide_id) && getVlideClips(vlide_id) 
                                    }else{
                                        setToastNotifications(prev => {
                                            return[
                                                // ...prev,
                                                {id: generateUid(), type:"warning", message:"クリップを表示するにはログインが必要です"},
                                            ];
                                        });
                                    }
                                }}>
                                {clips?.length 
                                    ? <BiCaretDown />
                                    : <BiCaretRight />
                                }
                                クリップ ({vlide.count_clips})
                            </button>

                            {clips?.length 
                                ? 
                                    <ul className="clips_wrapper" >
                                        {
                                            clips?.map((clip, i) => (
                                                <li key={clip.id}>
                                                    <Clip 
                                                        clip={clip}
                                                        loginId={user ? user.id : ""}
                                                        likeUnlike={likeUnlike} 
                                                        shareClip={shareClip}
                                                        unShareClip={unShareClip}
                                                        deleteClip={deleteClip}
                                                        getlikeUsers={getlikeUsers}
                                                        getShareUsers={getShareUsers}
                                                        users={clipUsers}
                                                        userNextPageLink={clipUserNextPageLink}
                                                        getMoreUser={getMoreClipUsers}
                                                        followUnfollow={clipfollowUnfollow}
                                                    /> 
                                                </li>
                                            ))
                                        }
                                    </ul>
                                : null
                            }

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

                    { (on && quote) ? 
                        <div>
                            <div className="clip_form">
                                <div className="clip_quote" >
                                    {   (
                                            quote.length>33 &&
                                            quote[0]==="!" && 
                                            (quote.slice(33) ===".jpeg" || quote.slice(33) ===".png" || quote.slice(33) ===".gif" || quote.slice(33) ===".jpg" )
                                        )
                                        ? <img src={`/api/v1/image?f=${quote.slice(1)}`} alt="quote img" style={{maxHeight: "300px"}}/>
                                        :  <>{quote}</>
                                    }
                                </div>

                                <AddClipForm
                                    text={text} 
                                    quote={quote}
                                    setText={setText} 
                                    image={image}
                                    setImage={setImage}
                                    previewImage={previewImage}
                                    setPreviewImage={setPreviewImage}
                                    addClip={addClip}
                                    autoFocus={false}
                                    placeholder="ひとこと。"
                                />
                            </div>
                            <div 
                                className={`button new_clip_button ${on ? "new_clip_button_pushed" : ""}`} 
                                onClick={toggleForm}
                            >
                                <BiX />  
                            </div>
                        </div>
                        : null
                    }
                </div>

                <div className='about_author_wrapper'>
                    <div className='about_author'>
                        <div className="about_author__header">
                            <div className="about_author__header__icon">
                                <Link to={`/prof/${vlide.user.name}`}>
                                    {/* {[...vlide.user.nick_name][0]} */}
                                    { vlide.user?.file_name 
                                        ? 
                                            <img 
                                                src={vlide.user.file_name}
                                                alt="user icon" 
                                                className="img" 
                                                style={{borderRadius: "50%"}}
                                            />
                                        : <> {[...vlide.user.nick_name][0]}</>
                                    }
                                </Link> 
                            </div>
                            <div>
                                <div className="about_author__header__username">
                                    <Link to={`/prof/${vlide.user.name}`}>
                                        {vlide.user.nick_name}
                                    </Link>
                                </div>
                                <div className="about_author__header__nickname">
                                    <Link to={`/prof/${vlide.user.name}`}>
                                        {vlide.user.name}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="about_author__description">
                            <DecoratedDescription content={vlide.user.description} />
                        </div>
                        
                        {toc 
                            ?   <div className="about_toc">
                                    <TocContent toc={toc} />                        
                                </div>
                            :null
                        }
                        

                    </div>
                </div>
            </div>
            
        </div>
    )
};

export default Detail;
