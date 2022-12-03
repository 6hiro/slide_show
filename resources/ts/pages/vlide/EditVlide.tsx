import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import TextareaAutosize from 'react-textarea-autosize';
import { BiHeadphone, BiMessageError } from 'react-icons/bi';
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
import Slide from '../../components/vlide/drafts/Slide';
import TitleInput from '../../components/vlide/drafts/TitleInput';
import TagForm from '../../components/vlide/drafts/TagForm';
import TimeController from '../../components/vlide/drafts/TimeController';

const EditVlide = () => {
    let navigate = useNavigate();

    const { vlide_id } = useParams();

    const {
        user,
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
        currentTime, 
        setCurrentTime,
        isRunning, 
        setIsRunning,
        isLoading,
        setIsLoading,
        retrieveForDraft,
        deleteAudio,
        update,
        uploadAudio
    } = useDraftVlide();

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const contentContainerRef = useRef<HTMLDivElement | null>(null);
    const audioInputRef = useRef<HTMLInputElement | null>(null);
    const vlideIdRef = useRef<string | null>(null);
    const [audio, setAudio] = useState<File | null>(null);
    
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

    // ファイルがアップロードされたときの処理
    const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => { 
        setIsLoading(true);

        const { currentTarget } = e;

        if( !currentTarget.files ){
            // setSrc("");
            setIsLoading(false);
            return;
        }

        setAudio( currentTarget.files[0]);
        
        const extension = currentTarget.files[0].name.split('.').pop();

        if(extension === "mp3" || extension === "aac"){

            // https://stackoverflow.com/questions/3717793/javascript-file-upload-size-validation
            if(!vlide_id || currentTarget.files[0].size/1024/1024 > 15){ // .size: バイト単位
                // alert('File size exceeds 15 MiB');
            }else{
                const packet = { id: vlide_id, audio: currentTarget.files[0] };
                const res = await uploadAudio(packet);

                const filePath = "/api/v1/audio?f=" + res.data.filePath;

                setSrc(filePath);
            }

        }

        setIsLoading(false);
    };

    const handleEditAudio = () => {
        audioInputRef.current?.click();
    };

    const submit =  async (e: any) => {
        
        e.preventDefault();

        if(typeof vlideIdRef.current === "string"){
            setIsLoading(true);

            await update({ 
                vlide_id: vlideIdRef.current, 
                title, 
                content, 
                tag_list: tagList, 
                duration: durationTime, 
                is_public: isPublic,
            });

            setIsLoading(false);

            if(isPublic) {
                navigate(`/vlide/${vlide_id}`);
            }else{
                navigate(`/prof/${user.name}`);

            }
        }
    };



    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>下書き / {siteTitle}</title>
                <meta
                    name="description"
                    content="下書き"
                />
            </Helmet>

            <div 
                className="newPostContainer"
                style={{ 
                    marginTop: durationTime ? "120px" : "0px"
                }}
            >
                <form className="inputCotnainer" onSubmit={submit}>
                    
                    
                    <TitleInput title={title} setTitle={setTitle} autoFocus={false} />

                    <div style={{ margin: "0 0 0 auto", width: "142px" }}>
                        <RadioButton isPublic={isPublic} setIsPublic={setIsPublic} />
                    </div>                        

                    <div className="textareaWrapper">
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
                            minLength={1}
                            maxLength={2500}
                            minRows={1}
                            ref={textareaRef}

                            onHeightChange={(height) => {
                                if(height > window.innerHeight * 0.62){
                                    if(textareaRef.current ){
                                        textareaRef.current.style.height = "0px";
                                        textareaRef.current.style.height =window.innerHeight * 0.62 + "px";
                                    }
                                }
                            }}
                        />

                        <div className="text_count" >
                            {/* <BiMessageError /> */}
                            {content.length} / {2500}
                            {/* <span> テキストは 2,000 文字以内で入力できます</span> */}
                        </div>     
                    </div>

                    <div style={{ margin: "0 0 0 auto", width: "120px" }}>
                        <DurationPicker durationTime={durationTime} setDurationTime={setDurationTime} />
                    </div>

                    <div>
                        <AudioInput 
                            isLoading={isLoading} 
                            handleEditAudio={handleEditAudio} 
                            audioInputRef={audioInputRef}  
                            handleChangeFile={handleChangeFile}
                        />
                                        {/* { src?.split("=")[1]} */}

                        {src && src.length > 106 && vlide_id
                            ?   <div className='audio_delete_button_wrapper'>

                                    <div
                                        onClick={() => {
                                            // const audioId = src.split("=")[1];
                                            deleteAudio(vlide_id ,src.split("=")[1], setSrc);
                                        }}
                                        className="audio_delete_button"
                                    >
                                        <BiHeadphone />
                                        音声を削除する
                                    </div>
                                </div>
                            : null                                        
                        }
    
                        <div className="rule" >
                            <BiMessageError />
                            <span> ファイルサイズは10メガバイトまでです</span>
                        </div>    
                        <div className="rule" >
                            <BiMessageError />
                            <span> mpeg, mpga, mp3, wav に対応しています</span>
                        </div>    
                    </div>

                    <TagForm tagList={tagList} setTagList={setTagList} />

                    <button 
                        className="submit_button"
                        disabled={ (!title.length || !content) && !isLoading }
                    >
                        {isPublic ? "公開する" : "下書きとして保存"}
                    </button>

                </form>

                <div ref={contentContainerRef} className="contentContainer" >
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

                    <ul>
                        { contentArray?.map((t, index) => (
                            <li 
                                key={index} 
                                id={String(convertToSeconds(t.time)) + "s"}
                                style={{ 
                                    // scrollMarginTop: "150px",
                                    scrollMarginTop: durationTime ? "140px" : "65px",
                                    // scrollSnapAlign:"start",
                                    opacity: ( Math.floor(currentTime) >= convertToSeconds(t.time) || !isRunning ) 
                                        ? "1" 
                                        : "0.05" ,
                                    filter: ( Math.floor(currentTime) >= convertToSeconds(t.time) || !isRunning )  
                                        ? "unset" 
                                        : "blur(2px)",
                                    // transform: 
                                    //     ( Math.floor(currentTime) >= convertToSeconds(t.time) || !isRunning ) 
                                    //         ? "scale(1)" 
                                    //         : " scale(0.9)" ,
                                }}
                            >
                                <Slide type={t.type} content={t.content} time={t.time} toc={toc} />
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            <Help />
        </>
    )
};

export default EditVlide;
