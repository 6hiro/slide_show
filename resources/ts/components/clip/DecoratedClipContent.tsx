import React from 'react';
import { Link } from 'react-router-dom';


const DecoratedClipContent:React.FC<{content: string}> = (props) => {
    
    const decoratedClipContent = (content:string): JSX.Element =>{
        const replacedcontent: string = content
                // .replace(/(\r\n){2,}|\r{2,}|\n{2,}/, '\n')
                .replace(/\r?\n/g, "\u0001")
                .replace(/ /g, '\u0002')
                .replace(/　/g, '\u0003');

        const contentArray: string[] = replacedcontent.split(/(\u0001|\u0002|\u0003)/g);

        return <>{decorate(contentArray)}</>
    };

    const decorate = (contentArray:string[]): JSX.Element =>  {
        return <>
            {contentArray.map((value, index) => {
                if(value.match(/^(#[0-9a-zA-Z０-９ａ-ｚＡ-Ｚぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]+)$/)){
                    // ハッシュタグがついている要素
                    return <Link to={`/tag?q=%23${value.slice(1)}&f=clip&o=top`} key={index} style={{color: "#00f"}}>
                                {value}
                            </Link>
                }else if(value.match(/^@[0-9a-zA-Z]+$/)){
                    // @がついている要素
                    return <Link to={`/prof/${value.slice(1)}`} key={index} style={{color: "#00f"}}>
                                {value}
                           </Link>
                }else if(value.match(/^(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/)){
                    // URL
                    if(value.slice(0, 32)==='https://www.youtube.com/watch?v=' || 
                        value.slice(0, 30)==='https://m.youtube.com/watch?v=' || 
                        value.slice(0, 17)==='https://youtu.be/'){

                        if(value.indexOf('&')!==-1){
                          value=value.split('&')[0]
                        }

                        return <iframe 
                                    id="inline-frame" 
                                    width="256" height="144" 
                                    title="YouTube video Player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    frameBorder="0"
                                    // https://cookie-script.com/blog/how-to-add-youtube-videos-without-cookies
                                    src={`https://www.youtube-nocookie.com/embed/${value.split('/watch?v=')[1]}?rel=0`}
                                    // src={`https://www.youtube.com/embed/${value.split('/watch?v=')[1]}?rel=0`}
                                    allowFullScreen={true}
                                    key={index}
                                ></iframe>
                    }else{
                        return <a href={value} key={index} style={{color: "#00f"}} >{value}</a>
                    }
                }else if(value.match(/\u0001/)){
                    // 改行の要素
                    return <br key={index}/>
                }else if(value.match(/\u0002/)){
                    // 半角スペースの要素
                    return <React.Fragment key={index}> </React.Fragment>
                }else if(value.match(/\u0003/)){
                    // 全角スペースの要素
                    return <React.Fragment key={index}>　</React.Fragment>
                }else{
                    return <React.Fragment key={index}>{value}</React.Fragment>
                }
            })}
        </>
    }

    return (
        <>{decoratedClipContent(props.content)}</>
    )
};

export default DecoratedClipContent;