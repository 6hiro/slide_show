// https://www.m3tech.blog/entry/2021/08/23/124000
import React from 'react';

import { tokenizer } from '../../markdown-inline/tokenizer';
import { Token } from '../../markdown-inline/type/token';



type Props = {
    content: string
};

// 編集用
export const DecoratedTextInput = (props: Props) => {
    // 抽象構文木(AST)を作成
    const ast = tokenizer(props.content);

    // console.log(ast)
    if(ast.children?.length === 0) return null;
    // if(ast.children?.length === 1) return <>{ast.children[0].content}</>
    return (
        <>
            {_addElementRecursively(ast)}
        </>
    )
};

const _addElementRecursively = (token: Token) => {
    
    return (
        <>
            {token.children.map((token, _) => {
                if(token.elmType==="text"){
                    return <React.Fragment key={token.id}>{token.content}</React.Fragment>
                }else if(token.elmType==="code"){
                    return <code key={token.id}>`{token.content}`</code>
                }else if(token.elmType==="strong"){
                    return <strong 
                            key={token.id}
                            // style={{}}
                        >*{_addElementRecursively(token)}*</strong>
                }else if(token.elmType==="italic"){
                    return <em key={token.id}>_{_addElementRecursively(token)}_</em>

                }else if(token.elmType==="del"){
                    return <del key={token.id}>~{_addElementRecursively(token)}~</del>
                }else if(token.elmType==="img" && token.attributes){
                    return <span 
                            key={token.id}
                            className="img"
                        >{"!["+token.content+"]("+token.attributes[1].attrValue+")"}</span>
                }else if(token.elmType==="link" && token.attributes){
                    return  <span 
                                key={token.id}
                                className="link"
                            >{"["+token.content+"]("+token.attributes[1].attrValue+")"}</span>
 
                }else if(token.elmType==="url"){
                    return  <span key={token.id} style={{color:"#3b49df"}}>{token.content}</span>
                }else if(token.elmType==="linkCard" && token.attributes){
                    return  <span key={token.id} className="link_card" >
                            {"?["+token.content+"]("+token.attributes[1].attrValue+")"}
                        </span>
                }else if(token.elmType==="at"){
                    return <span key={token.id} style={{color:"#3b49df"}}>
                                {token.content ? token.content : ""}
                            </span>
 
                }

                return null
            })}
        </>
    )
};
