import React from 'react';
import { Link } from 'react-router-dom';


const DecoratedDescription:React.FC<{content: string}> = (props) => {
    
    const decoratedContent = (content:string): JSX.Element =>{
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
                    return <Link to={`/tag?q=%23${value.slice(1)}&f=vlide&o=top`} key={index} style={{color: "#1d9bf0"}}>
                                {value}
                            </Link>
                }else if(value.match(/^@[0-9a-zA-Z]+$/)){
                    // @がついている要素
                    return <Link to={`/prof/${value.slice(1)}`} key={index} style={{color: "#1d9bf0"}}>
                                {value}
                           </Link>
                }else if(value.match(/^(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/)){
                    // URL
                    return <a href={value} key={index} style={{color: "#1d9bf0"}} target="_blank" rel="noopener noreferrer" >{value}</a>
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
    };

    return (
        <>{decoratedContent(props.content)}</>
    )
};

export default DecoratedDescription;