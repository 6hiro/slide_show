import React from 'react';
import { BiCopy, BiMessageSquareError } from 'react-icons/bi';
import Table from '../../../components/vlide/Table';
import Toc from '../../../components/vlide/Toc';
import { DecoratedText } from '../../markdown-inline/Render';



type SlideProps = {
    type: string;
    content: string;
    time: string;
    toc: {
        type: string;
        content: string;
        time: string | number;
    }[] | undefined;
};

const Slide = ( props:SlideProps ) => {
    // console.log(props)

    const render = (t:SlideProps) => {
        if(t.type==='text' || t.type === ''){
            return (
                <div className='slide paragraph'>
                    <DecoratedText content={t.content} />
                </div>
            )
        }else if(t.type==='toc'){
            return (
                <div className='slide'>
                    <Toc toc={props.toc}/>
                </div>
            )
        }else if(t.type==='h1'){
            return (
                <h2 className='slide'>
                    {t.content}
                </h2>
            )
        }else if(t.type==='h2'){
            return (
                <h3 className='slide'>
                    {t.content}
                </h3>
            )
        }else if(t.type==='hr'){
            return (
                <div className='slide_separator' role="separator">
                    <span className='slide_separator_dot' ></span>
                    <span className='slide_separator_dot' ></span>
                    <span className='slide_separator_dot' ></span>
                </div>
            )
        // }else if(t.type.split(":")[0]==='point'){
        //     const title = t.type.split(":")[1]
        //         ? t.type.split(":")[1]
        //         : "Point";
        //     return (
        //         <div className='slide point'>
        //             <div className='point_title'>{title}</div>
        //             <div className='point_content'>
        //                 <DecoratedText content={t.content} />
        //             </div>
        //         </div>
        //     )
        }else if(t.type==='message'){
            return (
                <aside className='slide message' role="note">
                    <BiMessageSquareError className='message_icon' />
                    <div className='message_content'>
                        <DecoratedText content={t.content} />
                    </div>
                </aside>
            )
        }else if(t.type==='alert'){
            return (
                <aside className='slide alert' role="alert">
                    <BiMessageSquareError className='message_icon' />
                    <div className='message_content'>
                        <DecoratedText content={t.content} />
                    </div>
                </aside>
            )
        }else if(t.type=="youtube"){
            if(t.content.slice(0, 32)==='https://www.youtube.com/watch?v=' || 
                t.content.slice(0, 30)==='https://m.youtube.com/watch?v=' || 
                (t.content.slice(0, 17)==='https://youtu.be/' && t.content.length > 17) ||
                (t.content.slice(0, 31)==='https://www.youtube.com/shorts/' && t.content.length > 32) ||
                (t.content.slice(0, 29)==='https://m.youtube.com/shorts/' && t.content.length > 31)
                
            ){     
                let id;
                // if(t.content.indexOf('&')!==-1){
                if(t.content.slice(0, 32)==='https://www.youtube.com/watch?v='){
                    id=t.content.split('&')[0].split('/watch?v=')[1];
                } else if (t.content.slice(0, 17)==='https://youtu.be/') {
                    id=t.content.slice(17,).split('?')[0];
                } else if(t.content.slice(0, 32)==='https://www.youtube.com/watch?v=') {
                    id=t.content.slice(32,).split('&')[0];
                } else if (t.content.slice(0, 31)==='https://www.youtube.com/shorts/' && t.content.length > 32) {
                    id=t.content.slice(31,).split('?')[0];
                } else if (t.content.slice(0, 29)==='https://m.youtube.com/shorts/' && t.content.length > 31) {
                    id=t.content.slice(29,).split('?')[0];
                }

  
                return <div className='slide youtube' style={{padding: "0 auto"}} >
                    <iframe 
                        id="inline-frame" 
                        width="360" height="216" 
                        //  width="390" height="693"
                        // width="560"
                        // height="315"
                        title="YouTube video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        frameBorder="0"
                        // src={`https://www.youtube.com/embed/${t.content.split('/watch?v=')[1]}?rel=0`}
                        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                        allowFullScreen={true}
                    ></iframe>
                </div>
            }
        }else if(t.type==="table"){
            // const title = t.type.split(":")[1]
            //     ? t.type.split(":")[1]
            //     : "";
            return (
                <div className='slide'>
                    {/* {title ? <div className='table_title'>{title}</div> : null} */}
                    <Table content={t.content} />
                </div>
            )
        }else if(t.type==='quote'){
            return (
                <>
                    <blockquote className='slide'>
                        <div>
                            <DecoratedText content={t.content} />
                        </div>
                        {/* { t.type.split(":")[1] && 
                            <figcaption>— <cite>{t.type.split(":")[1]}</cite></figcaption>
                        } */}
                    </blockquote>
                </>
            )
        }else if(t.type.split("?")[0].split(":")[0] && t.type.split("?")[0].split(":")[0]==='code'){ // code-js:.app.js
            const language = t.type.split("?")[1] 
                ? "language-"+t.type.split("?")[1].split(":")[0]
                : "";
                
            const fileName =  t.type.split(":")[1] 
                ?  t.type.split(":")[1].split("?")[0]
                : "";
            const content = (t.content.trim())
            return (
                <>
                    <div className="code-block-container slide">
                        {fileName && 
                            <div className="code-block-filename-container">
                                <div className="code-block-filename">{fileName}</div>
                            </div>
                        }
                        <pre 
                            tabIndex={0} 
                            data-language={language} 
                            data-start="0" 
                            className={`${language}`} 
                            style={{
                                outline: "none",
                                maxHeight: "65vh",
                            }}
                        > 
                            <code className={`code-block ${language}`}>
                                {t?.content.trim()}
                            </code>
                        </pre>
    
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
                            <BiCopy className="copyIcon" />
                        </button>
                    </div>
                </>
            )
        }
    };

    return (
        <React.Fragment>
            { render(props) }
        </React.Fragment>
    )
};

export default Slide;