import React from 'react';

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
                    value.match(/^(#[0-9a-zA-Z０-９ａ-ｚＡ-Ｚぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]+)$/) ||
                    // @がついている要素
                    // value.match(/^@[0-9a-zA-Z]+$/) ||
                    value.match(/^@[0-9a-zA-Z_]+$/) ||
                    // URL
                    value.match(/^(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/)
                ){
                    return <span key={index} style={{color: "#00f"}}>
                                {value}
                            </span>
                }else if(value.match(/\u0001/)){
                    // 改行の要素
                    // return <br key={index}/>
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