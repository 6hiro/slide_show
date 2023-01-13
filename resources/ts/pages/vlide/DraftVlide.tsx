import React, { useContext, useEffect, useRef, useState, lazy } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import TextareaAutosize from 'react-textarea-autosize';
import { BiImage } from 'react-icons/bi';
import Prism from "prismjs";
// https://github.com/PrismJS/prism/blob/master/components.json
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

import { useDraftVlide } from '../../hooks/useDraftVlide';
import { siteTitle } from '../../constants/site';
import { convertToSeconds, parser } from '../../utils/TimeController';
import AudioInput from '../../components/vlide/drafts/AudioInput';
import DurationPicker from '../../components/vlide/drafts/DurationPicker';
import Help from '../../components/vlide/drafts/Help';
import RadioButton from '../../components/vlide/drafts/RadioButton';
import Slide from '../../components/vlide/Slide';
import TitleInput from '../../components/vlide/drafts/TitleInput';
import TagForm from '../../components/vlide/drafts/TagForm';
import TimeController from '../../components/vlide/TimeController';
import { useWindowSize } from '../../hooks/useWindowSize';
import useToggle from '../../hooks/useToggle';
import LoadingScreen from '../../components/layout/LoadingScreen';
import ImageMenu from '../../components/vlide/drafts/ImageMenu';
import ToastNotifications from '../../components/toastNotification/ToastNotifications';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import AudioMenu from '../../components/vlide/drafts/AudioMenu';
import { useMousePosition } from '../../hooks/useMousePosition';



type Props = {
    user: any;
    isLoadingUser: boolean;
};
const DraftVlide = (props: Props) => {
    const { user, isLoadingUser } = props;
    let navigate = useNavigate();

    const { vlide_id } = useParams();

    const {
        title,
        setTitle,
        content, 
        setContent,
        tagList,
        setTagList,
        isPublic,
        setIsPublic,
        durationTime,
        setDurationTime,
        src, 
        setSrc,
        headerImageUrl,
        setHeaderImageUrl,
        imageGallery,
        setImageGallery,
        currentTime, 
        setCurrentTime,
        isRunning, 
        setIsRunning,
        isLoading,
        setIsLoading,
        retrieveForDraft,
        uploadImage,
        deleteImage,
        editHeaderImage,
        setIsPublicImage,
        update,
        uploadAudio,
        deleteAudio,
    } = useDraftVlide();

    const {
        isScrubbingRef,
        isScrubbing,
        setIsScrubbing,
        mousePosition,
        handleMouseUp
    } = useMousePosition();
    
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const mainContainerRef = useRef<HTMLDivElement | null>(null);
    const sectionOneRef = useRef<HTMLFormElement | null>(null);
    const sectionTwoRef = useRef<HTMLDivElement | null>(null);

    const vlideIdRef = useRef<string | null>(null);
    const [audio, setAudio] = useState<File | null>(null);

    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
    const [isShowedImgMenu, setIsShowedImgMenu] = useToggle(false);
    const [isShowedAudioMenu, setIsShowedAudioMenu] = useToggle(false);

    const [toastNotifications, setToastNotifications] = useContext(ToastNotificationsContext);
    const contentArray = parser(content);
    const timeStamps = contentArray?.map((content) => { return convertToSeconds(content.time) });
    const toc = contentArray?.filter(content => content.type==='h1' || content.type=='h2');
    
    useEffect(() => {
        if(typeof vlide_id === "string") {
            vlideIdRef.current = vlide_id;
            retrieveForDraft(vlide_id);
        } 
    }, [vlide_id]); // router.queryの取得はuseEffectの発火タイミングより後?

    useEffect(() => {
        Prism.highlightAll();
    }, [content]);


    const submit =  async (e: any) => {
        
        e.preventDefault();

        if(typeof vlideIdRef.current === "string"){
            setIsLoading(true);

            await update(
                setToastNotifications,
                { 
                    vlide_id: vlideIdRef.current, 
                    title, 
                    content, 
                    tag_list: tagList, 
                    duration: durationTime, 
                    is_public: isPublic,
                }
            );

            setIsLoading(false);

            if(isPublic) {
                navigate(`/vlide/${vlide_id}`);
            }else{
                navigate(`/prof/${user.name}`);

            }
        }
    };


    useEffect(() =>{
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
          };
    }, []);


    useEffect(() =>{
            if( !sectionOneRef.current || !sectionTwoRef.current) return;
            if( !isScrubbing) return;
            const sectionMinWidth = 280 // px
            const borderWidth = 8 // px
            if(
                !mousePosition.x || 
                mousePosition.x > (window.innerWidth - sectionMinWidth - borderWidth) ||
                mousePosition.x < sectionMinWidth
            ) return;
            
            // draft_vlid__main__section_two に flex: 1;を指定
            sectionOneRef.current.style.width = mousePosition.x + "px"
            // draft_vlid__main__section_two に flex: 1;を指定をしない場合
            // minWidth を設定しないと挙動がおかしくなる 親要素でflexを指定しているから？
            // sectionOneRef.current.style.minWidth = mousePosition.x + "px"
    }, [mousePosition]);

    // 
    const [width, _] = useWindowSize();
    useEffect(() => {
        if( sectionOneRef.current instanceof HTMLElement ){
            const width  = window.innerWidth;
            if(width < 550){
                sectionOneRef.current.style.width = width + 'px'
            }
        }
    }, [width]);

    // login していない場合
    if(!isLoadingUser && !user.id) return (<Navigate to="/auth/login" replace={true} />)
    
    if(!title && isLoading) return (
        <div style={{ height:"100vh", display:"flex", alignItems: "center", justifyContent: "center" }}>
            <LoadingScreen/>
        </div>
    );


    return (
        <React.Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>下書き / {siteTitle}</title>
                <meta
                    name="description"
                    content="下書き"
                />
            </Helmet>
            <div 
                className="draft_vlide_container" 
                onPointerUp={handleMouseUp}
                style={isScrubbing
                    ? {userSelect: "none", MozUserSelect: "none", WebkitUserSelect: "none", msUserSelect: "none"} 
                    : {userSelect: "unset", MozUserSelect: "unset", WebkitUserSelect: "unset", msUserSelect:"unset"}
                }
            >
                <ToastNotifications notifications={toastNotifications} setNotifications={setToastNotifications} />

                {vlide_id ?
                    <ImageMenu 
                        image={image} 
                        setImage={setImage}  
                        previewImage={previewImage} 
                        setPreviewImage={setPreviewImage}
                        imageGallery={imageGallery} 
                        setImageGallery={setImageGallery}
                        headerImageUrl={headerImageUrl}
                        setHeaderImageUrl={setHeaderImageUrl}
                        isShowedImgMenu={isShowedImgMenu} 
                        setIsShowedImgMenu={setIsShowedImgMenu} 
                        notifications={toastNotifications} 
                        setNotifications={setToastNotifications}
                        uploadImage={uploadImage}
                        deleteImage={deleteImage}
                        editHeaderImage={editHeaderImage}
                        setIsPublicImage={setIsPublicImage}
                        vlideId={vlide_id}
                    />
                    : null 
                }
                {vlide_id ? 
                    <AudioMenu 
                        isShowedAudioMenu={isShowedAudioMenu}
                        setIsShowedAudioMenu={setIsShowedAudioMenu}
                        vlide_id={vlide_id}
                        src={src}
                        setSrc={setSrc}
                        // handleChangeFile={handleChangeFile} 
                        deleteAudio={deleteAudio}
                        notifications={toastNotifications}
                        setNotifications={setToastNotifications} 
                        setAudio={setAudio} 
                        uploadAudio={uploadAudio}                    />
                    : null
                }

                <div className="draft_vlid__main" ref={mainContainerRef} >

                    <form 
                        className="draft_vlid__main__section draft_vlid__main__section_one"
                        ref={sectionOneRef}
                        style={{width:"100%", scrollMarginTop: "110px"}}
                        id="edition_area"
                        onSubmit={submit}
                    >
                            <div className="draft_vlid__main__section__header" >
                                <div className="draft_vlid__main__section__header__title">
                                    編集
                                </div>
                                <div className="draft_vlid__main__section__header__action">
                                    <AudioInput setIsShowedAudioMenu={setIsShowedAudioMenu} />
                                    
                                    <div className="img_button" >
                                        <BiImage onClick={setIsShowedImgMenu} />
                                    </div>

                                    <button 
                                        className="submit_button"
                                        disabled={ (!title.trim().length || !content.trim()) && !isLoading }
                                    >
                                        {isPublic ? "公開する" : "下書きとして保存"}
                                    </button>
                                </div>
                            </div>

                            <div className="draft_vlid__main__section__content">
                                <div className="inputCotnainer" >
                                    <TitleInput title={title} setTitle={setTitle} autoFocus={false} />

                                    <div style={{ margin: "20px 0 20px auto", width: "142px" }}>
                                        <RadioButton isPublic={isPublic} setIsPublic={setIsPublic} />
                                    </div>      
 
                                

                                    <div className="textareaWrapper">
                                        <div 
                                            style={{
                                                maxHeight: "62vh", 
                                                overflow: "scroll", 
                                                border: "2px solid #dedede",
                                                borderRadius: "4px",
                                                lineHeight: "0px",
                                                position: "relative"
                                            }}
                                        >
                                            <TextareaAutosize
                                                id="textarea"
                                                className="textarea"
                                                autoComplete="off"
                                                spellCheck="false"
                                                name="text" 
                                                onChange={(e) => setContent(e.target.value)} 
                                                value={content} 
                                                placeholder="内容" 
                                                // autoFocus 
                                                // minLength={1}
                                                maxLength={5000}
                                                minRows={1}
                                                ref={textareaRef}
                                            />
                                        </div>     

                                        <div className="text_count" >
                                            {content.length} / {5000}
                                        </div>     
                                    </div>
                                            
                                    <div style={{ margin: "10px 0 10px auto", width: "120px" }}>
                                        <DurationPicker durationTime={durationTime} setDurationTime={setDurationTime} />
                                    </div>
                                    {/* <div style={{ margin: "10px 0 10px auto", width: "120px" }}> */}


                                    <TagForm tagList={tagList} setTagList={setTagList} />


                                </div>

                            </div>
                    </form>
                    <div 
                        className="draft_vlid__main__border draft_vlid__main__border_one" 
                        onPointerDown={(e) => {
                            isScrubbingRef.current = true;
                            setIsScrubbing(true);
                        }}
                    ></div>
                    <div 
                        className="draft_vlid__main__section draft_vlid__main__section_two"
                        ref={sectionTwoRef}
                        style={{width:"100%"}}
                        id="preview_area"
                    >
                        <div className="draft_vlid__main__section__header">
                            <div 
                                className="draft_vlid__main__section__header__title"
                            >
                                プレビュー
                            </div>
                            <div>
                                <button 
                                    className="to_edition_button"
                                    onClick={()=>{
                                        document.getElementById("edition_area")?.scrollIntoView({ 
                                            behavior: 'smooth',
                                        });
                                    }}
                                >
                                    編集画面に戻る
                                </button>
                            </div>
                        </div>
                        <div 
                            className="draft_vlid__main__section__content"
                        >
                            {headerImageUrl 
                                ?   <div
                                        className='draft_vlid__main__section__content__header_img' 
                                    >
                                        <img 
                                            src={headerImageUrl} 
                                            alt="header_img" 
                                            width= "1048px"
                                            height= "214px"
                                        />
                                    </div>
                                : null
                            }  
                                
                            <div className='draft_vlid__main__section__content__title' >
                                <div className='draft_vlid__main__section__content__title__text' >
                                    {title}
                                </div>
                            </div>

                            {contentArray?.length 
                                ? <div className="draft_vlid__main__section__content__slides">
                                        { contentArray?.map((t, index) => (
                                            <div 
                                                key={index} 
                                                id={String(convertToSeconds(t.time)) + "s"}
                                                style={{ 
                                                    scrollMarginTop: (width < 550) ? "110px" : "70px",
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
                                : <div></div>
                            }
                        </div>

                        {durationTime
                            ?<TimeController 
                                    durationTime={durationTime} 
                                    currentTime={currentTime} 
                                    setCurrentTime={setCurrentTime} 
                                    isRunning={isRunning}
                                    setIsRunning={setIsRunning}
                                    timeStamps={timeStamps}
                                    // src={src}
                                    src={
                                        (src && src.slice(0,16) === "/api/v1/audio?f="  && src.length > 16)
                                            ? src 
                                            : ""
                                    }
                                />
                            : null
                        }
                    </div>
                </div>

            </div>
            <Help />

        </React.Fragment>
    )
};

export default DraftVlide;