import React from 'react';
import { Link } from 'react-router-dom';

import { 
    urlRegExp, 
    tagRegExp,
    atRegExp,
} from '../../utils/regexps';
// import Twitter from '../embed/Twitter';
import ClipLinkCard from './ClipLinkCard';



const DecoratedClipContent:React.FC<{content: string, clipId: string}> = (props) => {
    const { content, clipId } = props;

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
        let firstLinkIndex: number | null = null;
        const blogCardSrcList = contentArray.filter(
            function(value) { 
                // Instagram に対応できていないため
                return (value.match(urlRegExp) && value.slice(0,25) !== 'https://www.instagram.com' && value.slice(0,19) !== 'https://twitter.com'); 
            }
        );

        const embedElement = (src: string) => {
            // if(src.slice(0,35) === 'https://twitter.com/Twitter/status/'){
            //     return <Twitter src={src} />
            // }else if(src.slice(0,28) === 'https://www.instagram.com/p/'){
                // return <Instagram src={src} />
            // }else if(src.slice(0, 32)==='https://www.youtube.com/watch?v=' || 
            //     src.slice(0, 30)==='https://m.youtube.com/watch?v=' || 
            //     (src.slice(0, 17)==='https://youtu.be/' && src.length > 17)
            // ){
            //     let id;
            //     if(src.indexOf('&')!==-1){
            //         id=src.split('&')[0].split('/watch?v=')[1];
            //     } else if (src.slice(0, 17)==='https://youtu.be/') {
            //         id=src.slice(17,);

            //     } else if(src.slice(0, 32)==='https://www.youtube.com/watch?v=') {
            //         id=src.slice(32,);
            //     }

            //     return <iframe 
            //             id="inline-frame" 
            //             width="256" height="144" 
            //             title="YouTube video Player"
            //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            //             frameBorder="0"
            //             // https://cookie-script.com/blog/how-to-add-youtube-videos-without-cookies
            //             src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
            //             // src={`https://www.youtube.com/embed/${id}?rel=0`}
            //             allowFullScreen={true}
            //         ></iframe>  
            // }else{
                return <div style={{padding: "12px 0"}}><ClipLinkCard src={src}/></div>
            // }
        };

        return <>
            {contentArray.map((value, index) => {
                //  console.log(index-1 === firstLinkIndex)
                //  console.log(value)

                if(value.match(tagRegExp)){
                    // ハッシュタグがついている要素
                    return <Link to={`/tag?q=%23${value.slice(1)}&f=clip&o=top`} key={index} style={{color: "#1d9bf0"}}>
                                {value}
                            </Link>
                }else if(value.match(atRegExp)){
                    // @がついている要素
                    return <Link to={`/prof/${value.slice(1)}`} key={index} style={{color: "#1d9bf0"}}>
                                {value}
                           </Link>
                }else if(value.match(urlRegExp)){
                    if(blogCardSrcList.length > 0 && value===blogCardSrcList[0]) {
                        firstLinkIndex = index;
                        return null;
                    }
                    return <a href={value} key={index} style={{color: "#1d9bf0"}} target="_blank" rel="noopener noreferrer">{value}</a>
                }else if(value.match(/\u0001/)){
                    if(firstLinkIndex === index-1) return null;

                    // 改行の要素
                    return <br 
                                key={index}
                            />
                }else if(value.match(/\u0002/)){
                    if(firstLinkIndex === index-1) return null;

                    // 半角スペースの要素
                    return <React.Fragment 
                                key={index}
                            > </React.Fragment >
                }else if(value.match(/\u0003/)){
                    if(firstLinkIndex === index-1) return null;

                    // 全角スペースの要素
                    return <React.Fragment 
                                key={index}
                            >　</React.Fragment >
                }else{
                    return <React.Fragment 
                                key={index}
                            >{value}</React.Fragment  >
                }
            })}
            <div >
                {blogCardSrcList.length ? embedElement(blogCardSrcList[0]) : null}
            </div>
        </>
    }

    return (
        <>{decoratedClipContent(content)}</>
    )
};

export default DecoratedClipContent;