import React from 'react';
import { BiCopy, BiMessageSquareError } from 'react-icons/bi';
import { DecoratedText } from '../../../utils/markdown-inline/Render';
import Toc from './Toc';

type SlideProps = {
    type: string;
    content: string;
    time: string;
    toc: {
        type: string;
        content: string;
        time: string;
    }[] | undefined;
};

const Slide = ( props:SlideProps ) => {

    const render = (t:SlideProps) => {
        if(t.type==='text' || t.type === ''){
            return (
                <p className='slide'>
                    {/* {t.content} */}
                    <DecoratedText content={t.content} />
                </p>
            )
        }else if(t.type==='toc'){
            return (
                <div className='slide'>
                    <Toc toc={props.toc}/>
                </div>
            )
        }else if(t.type==='h1'){
            return (
                <h1 className='slide'>
                    {t.content}
                </h1>
            )
        }else if(t.type==='h2'){
            return (
                <h2 className='slide'>
                    {t.content}
                </h2>
            )
        // }else if(t.type==='h3'){
        //     return (
        //         <h3 className='slide'>
        //             {t.content}
        //         </h3>
        //     )
        }else if(t.type==='hr'){
            return (
                <div className='slide_separator' role="separator">
                    <span className='slide_separator_dot' ></span>
                    <span className='slide_separator_dot' ></span>
                    <span className='slide_separator_dot' ></span>
                </div>
            )
        }else if(t.type==='point'){
            return (
                <div className='slide point'>
                    <div className='point_title'>ポイント</div>
                    <div className='point_content'>
                        <DecoratedText content={t.content} />
                    </div>
                </div>
            )
        }else if(t.type==='message'){
            return (
                <aside className='slide message' role="note">
                    <BiMessageSquareError className='message_icon' />
                    <div className='message_content'>
                        {/* <p>{t.content}</p> */}
                        <DecoratedText content={t.content} />
                    </div>
                </aside>
            )
        }else if(t.type==='alert'){
            return (
                <aside className='slide alert' role="alert">
                    <BiMessageSquareError className='message_icon' />
                    <div className='message_content'>
                        {/* <p>{t.content}</p> */}
                        <DecoratedText content={t.content} />
                    </div>
                </aside>
            )
        }else if(t.type=="youtube"){
            if(t.content.slice(0, 32)==='https://www.youtube.com/watch?v=' || 
                t.content.slice(0, 30)==='https://m.youtube.com/watch?v=' || 
                t.content.slice(0, 17)==='https://youtu.be/'){

            if(t.content.indexOf('&')!==-1){
                t.content=t.content.split('&')[0]
            }
        
                return <div className='slide youtube' style={{padding: "0 auto"}} >
                    <iframe 
                        id="inline-frame" 
                        width="360" height="216" 
                        // width="560"
                        // height="315"
                        title="YouTube video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        frameBorder="0"
                        // src={`https://www.youtube.com/embed/${t.content.split('/watch?v=')[1]}?rel=0`}
                        src={`https://www.youtube-nocookie.com/embed/${t.content.split('/watch?v=')[1]}?rel=0`}
                        allowFullScreen={true}
                        // key={}
                    ></iframe>
                </div>

            }
        
        }else if(t.type.split(":")[0]==='blockquote'){
            return (
                <>
                    <blockquote className='slide'>
                        <p>
                            {/* {t.content} */}
                            <DecoratedText content={t.content} />
                        </p>
                        { t.type.split(":")[1] && 
                            <figcaption>— <cite>{t.type.split(":")[1]}</cite></figcaption>
                        }
                    </blockquote>
                </>
            )
        }else if(t?.type.split("-")[0].split(":")[0]==='code'){
            // code-js:.app.js
            // const focus = t.split(" ")[0]
            // const meta =  t.split(" ")[0]
            const language = t.type.split("-")[1] 
                ? "language-"+t.type.split("-")[1].split(":")[0]
                : ""
                
            const fileName =  t.type.split(":")[1] 
                ?  t.type.split(":")[1].split("-")[0]
                : ""
            // console.log(escapeText(t.content.trim()))
            const content = (t.content.trim())
            return (
                <>
                    <div className="code-block-container slide">
                        {fileName && 
                            <div className="code-block-filename-container">
                                <span className="code-block-filename">{fileName}</span>
                            </div>
                        }
                        <pre 
                            tabIndex={0} 
                            data-language={language} 
                            data-start="0" 
                            className={`${language}`} 
                            // className="line-numbers"
                        > 
                        {/* <pre className="line-numbers language-python"> */}
                            <code 
                                className={`code-block ${language}`}
                                // className="language-jsx"
                                // dangerouslySetInnerHTML={{ __html: content }}
                            >
                                {t?.content.trim()}
                            </code>
                        </pre>
    
                        {/* <pre className="language-javascript line-numbers" style={{ backgroundColor: "#272822", fontSize: "0.8em" }}>
                            <code
                                style={{ fontFamily: "Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace" }}
                                dangerouslySetInnerHTML={{
                                    __html: Prism.highlight(content, Prism.languages.javascript, "javascript"),
                                }}
                            />
                        </pre> */}
    
                        <button 
                            className="copyButton" 
                            style={{top: fileName ? "28px" : "0px"}}
                            aria-label="クリップボードにコピー"
                            onClick={ (e) => {
                                e.preventDefault();
                                const { currentTarget } = e;
                                if (!(currentTarget instanceof HTMLElement)) {
                                    return;
                                }
                                const previousSibling = currentTarget.previousSibling;
                                if (!(previousSibling instanceof HTMLElement)) {
                                    return;
                                }
                                
                                currentTarget.style.animation = "";
    
                                navigator.clipboard.writeText(previousSibling.innerText).then(
                                    () => {
                                        currentTarget.style.animation = "animate 2s";
                                    }
                                )                            
                            }}
                        >
                            {/* <div className='copyMessage'>コピーしました</div> */}
                            <BiCopy className="copyIcon" />
                        </button>
                    </div>
                </>
            )
        }
    };

    return (
        <>
            { render(props) }
        </>
    )
};

export default Slide;