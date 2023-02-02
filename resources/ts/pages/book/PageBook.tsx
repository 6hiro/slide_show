import { useContext, useEffect, useRef } from 'react';
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
import 'prismjs/components/prism-swift'; // Language
import 'prismjs/components/prism-typescript'; // Language
import 'prismjs/components/prism-markup'; // Language
import 'prismjs/components/prism-markdown'; // Language
import 'prismjs/components/prism-nginx'; // Language
import 'prismjs/components/prism-apacheconf'; // Language
import 'prismjs/components/prism-css'; // Language
import 'prismjs/components/prism-sass'; // Language
import 'prismjs/components/prism-scss'; // Language
import 'prismjs/components/prism-graphql'; // Language
import 'prismjs/components/prism-plsql' ;// Language
import { FaRegBookmark, FaBookmark, FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import useToggle from '../../hooks/useToggle';
import Slide from '../../components/vlide/Slide';
import TimeController from '../../components/vlide/TimeController';
import LoadingScreen from '../../components/layout/LoadingScreen';
import { siteTitle, siteURL } from '../../constants/site';
import { convertToSeconds, parser } from '../../utils/TimeController';
import { slideRegExp } from '../../utils/regexps';
// import { AdmaxSwitch } from '../../components/ad/AdMax';
import DecoratedDescription from '../../components/prof/DecoratedDescription';
import TocContent from '../../components/vlide/TocContent';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import { generateUid } from '../../utils/uid';
import { useBook } from '../../hooks/useBook';
import { MdToc } from 'react-icons/md';



type Props = {
    user: any
};

const PageBook = (props: Props) => {
    const { user } = props;
    const { book_id, page_index } = useParams();
    // const { hash } = useLocation();

    const { 
        book, 
        page, 
        retrieve, 
        retrievePage, 
        savedUnsaved,
        currentTime, 
        setCurrentTime,
        isRunning,
        setIsRunning,
    } = useBook();

    const [_, setToastNotifications] = useContext(ToastNotificationsContext);

    const contentContainerRef = useRef<HTMLDivElement | null>(null);
    const vlideIdRef = useRef<string | null>(null);
    const [isShowedMenu, setIsShowedMenu] = useToggle(false);

    const contentArray = page?.content ?  parser(page.content) : [];
    const timeStamps = contentArray?.map((content) => { return convertToSeconds(content.time) });
    const toc = contentArray?.filter(content => content.type==='h1' || content.type=='h2');
    
    useEffect(() => {
        if(typeof book_id === "string" && user) {
            retrieve(book_id);
        } 
    }, [book_id]);

    useEffect(() => {
        if(typeof page_index === "string" && book) {
            if(!book.pages?.length) return;
            if(( Number(page_index) > book.pages.length) ) return;

            const vlide_id = book.pages[Number(page_index)-1].id
            vlideIdRef.current = vlide_id;

            retrievePage(book.id, vlide_id);
        } 
    }, [book, page_index]);
    

    useEffect(() => {
        Prism.highlightAll();
    }, [page]);

    const descriptionMatch = page?.content?.match(slideRegExp);

    if ( !page?.id ) {
        return <div style={{width: "100%", height: "calc(100vh -   120px)", display:"flex", alignItems: "center", justifyContent: "center"}}>
            <LoadingScreen />
        </div>
    }

    return (
        <div className="detail_container_wrapper">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{page?.title ? page.title : "" } / {siteTitle}</title>
                <meta
                    name="description"
                    // content={vlide?.content?.slice(0,100) + "..."}
                    content={descriptionMatch && descriptionMatch[2] ? descriptionMatch[2]  : page?.title}
                />
            </Helmet>
            <div className="detail_container">
                <div  className="detail" >
                    <div className={`detail__toc_menu ${isShowedMenu ? "is_showed_menu" : ""}`}>
                        <div className='site_name_container'>
                            <Link to={`/`} style={{display: "block"}} className="site_name">
                                Vlide
                            </Link>
                        </div>
                        <div className="book__pages">
                            {book?.pages.map((page,i) => (
                                <div key={i+"page"} className="book__page">
                                    <Link
                                        to={`/book/${book.id}/page/${i+1}`}
                                        className="page_link"
                                        onClick={()=>{setIsShowedMenu(false)}}
                                    >
                                        <div className="page_link__count">
                                            {i+1 < 10 ? "0"+(i+1) : i+1}
                                        </div>
                                        <div className="page_link__title">
                                            {page.title}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isShowedMenu ? <div className="detail__toc_menu__overlay" onClick={() => setIsShowedMenu(false)}></div> : null }

                    <div className="detail__header">
                        <div 
                            className='detail__header__toc'
                            onClick={() => setIsShowedMenu(true)}
                        >
                             <MdToc />
                        </div>
                        <div className="detail__header__title">
                            <Link
                                to={`/book/${book?.id}`}
                                className="page_link"
                            >
                                {book?.title}
                            </Link>
                        </div>
                        <div style={{width: "40px"}}></div>
                    </div>

                    <section 
                        ref={contentContainerRef} 
                        className="content_container"  
                        aria-label="記事" 
                    >
                        {page.header_file_name 
                            ?   <div
                                    className='vlid__header_img' 
                                >
                                    <img 
                                        src={page.header_file_name} 
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
                                    <Link to={`/prof/${page.user.name}`}>
                                        { page.user?.file_name 
                                            ? 
                                                <img 
                                                    src={page.user.file_name}
                                                    alt="user icon" 
                                                    className="img" 
                                                    style={{borderRadius: "50%"}}
                                                />

                                            : <> {[...page.user.nick_name][0]}</>

                                        }
                                    </Link> 

                                </div>
                                <div>
                                    <div className="vlide__header__author__name">
                                            <Link to={`/prof/${page.user.name}`}>
                                            {page.user.nick_name}
                                        </Link>
                                    </div>
                                    <time 
                                        className="vlide__header__author__dates"
                                        dateTime={page.published_at && page.published_at.slice(0,10)}
                                        itemProp="datepublished"
                                    >
                                        {page.published_at && 
                                            <div>{page.published_at?.slice(0,10).replace(/-/g, ' / ')}</div>
                                        }
                                        {(!page.published_at && page.created_at) &&
                                            <div>{page.created_at?.slice(0,10).replace(/-/g, ' / ')}</div>
                                        }
                                    </time>
                                </div>
                            </div>
                            <div className="vlide__header__action" style={{width: "unset"}}>
                            {page.is_public 
                                ?   <li className="vlide__header__action__button" >
                                        <div 
                                            onClick={() => {
                                                if(props.user?.id){
                                                    if(!page.is_public) {
                                                        setToastNotifications(prev => {
                                                            return[ {id: generateUid(), type:"warning", message:"非公開の投稿のため、保存できません"},];
                                                        });
                                                    }else if(page.is_public) {
                                                        savedUnsaved(page.id);
                                                    }
                                                }else{
                                                    setToastNotifications(prev => {
                                                        return[ {id: generateUid(), type:"warning", message:"投稿を保存するにはログインが必要です"},];
                                                    });
                                                }
                                            }}
                                        >
                                            {page.is_saved 
                                                ? <FaBookmark className="bookmarked_icon" size={22} />
                                                : <FaRegBookmark className="unbookmarked_icon" size={22} />
                                            }
                                        </div>
                                    </li>
                                : null
                            }
                                {page.user.id === user?.id
                                    ? <li className="vlide__header__action__button" >
                                            <div>
                                                <Link to={`/drafts/vlide/${page.id}`}  className="edit_icon" >
                                                    <FaEdit size={28}/>
                                                </Link>
                                            </div>
                                        </li>
                                    : null
                                }


                            </div>

                        </header>

                        <section>
                            <h1 className="vlide__title" >{page.title}</h1>

                            <div>
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
                                    >
                                        <Slide type={t.type} content={t.content} time={t.time} toc={toc} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="tag_list_wrapper">
                            <ul className="tag_list">
                                {page.tags.map((tag, index) => {
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

                    {page.duration
                        ?<TimeController 
                            durationTime={page.duration} 
                            currentTime={currentTime} 
                            setCurrentTime={setCurrentTime} 
                            isRunning={isRunning}
                            setIsRunning={setIsRunning}
                            timeStamps={timeStamps}
                            src={
                                (page.audio_file_name?.slice(0,16) === "/api/v1/audio?f="  && page.audio_file_name.length > 16)
                                    ? page.audio_file_name 
                                    : ""
                            }
                            />
                        : null
                    }

                </div>

                <div className='about_author_wrapper'>
                    <div className='about_author'>
                        <div className="about_author__header">
                            <div className="about_author__header__icon">
                                <Link to={`/prof/${page.user.name}`}>
                                    {/* {[...vlide.user.nick_name][0]} */}
                                    { page.user?.file_name 
                                        ? 
                                            <img 
                                                src={page.user.file_name}
                                                alt="user icon" 
                                                className="img" 
                                                style={{borderRadius: "50%"}}
                                            />
                                        : <> {[...page.user.nick_name][0]}</>
                                    }
                                </Link> 
                            </div>
                            <div>
                                <div className="about_author__header__nickname">
                                    <Link to={`/prof/${page.user.name}`}>
                                        {page.user.nick_name}
                                    </Link>
                                </div>
                                <div className="about_author__header__username">
                                    <Link to={`/prof/${page.user.name}`}>
                                        @{page.user.name}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="about_author__description">
                            <DecoratedDescription content={page.user.description} />
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

export default PageBook;