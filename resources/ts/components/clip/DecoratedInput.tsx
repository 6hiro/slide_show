import React from 'react';

import { 
    urlRegExp, 
    tagRegExp,
    atRegExp,
} from '../../utils/regexps';



const DecoratedInput:React.FC<{input: string}> = (props) => {
    const decoratedInput = (input:string): JSX.Element =>{
        const replacedInput: string = input
                // .replace(/(\r\n){2,}|\r{2,}|\n{2,}/, '\n')
                .replace(/\r?\n/g, "\u0001")
                .replace(/ /g, '\u0002')
                .replace(/　/g, '\u0003')

        const inputArray: string[] = replacedInput.split(/(\u0001|\u0002|\u0003)/g)

        return <>{decorate(inputArray)}</>
    };

    const decorate = (inputArray:string[]): JSX.Element =>  {
        return <>
            {inputArray.map((value, index) => {
                if(
                    // ハッシュタグがついている要素
                    // korean \u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF
                    value.match(tagRegExp) ||
                    // @がついている要素
                    value.match(atRegExp) ||
                    // URL
                    value.match(urlRegExp)
                ){
                    return <span key={index} style={{color: "#1d9bf0"}}>
                                {value}
                            </span>
                }else if(value.match(/\u0001/)){
                    // 改行の要素
                    return <React.Fragment key={index}>{`\n`}</React.Fragment>
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
        <>{decoratedInput(props.input)}</>
    )
};

export default DecoratedInput;