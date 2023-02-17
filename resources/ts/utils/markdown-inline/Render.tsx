// https://www.m3tech.blog/entry/2021/08/23/124000
import React from 'react';
import { Link } from 'react-router-dom';

// import Twitter from '../../components/embed/Twitter';
import BlogCard from '../../components/vlide/BlogCard';
import RenderImage from './RenderImage';
import { tokenizer } from './tokenizer';
import { Token } from './type/token';



type Props = {
    content: string
};

export const DecoratedText = (props: Props) => {
    // 抽象構文木(AST)を作成
    const ast = tokenizer(props.content);
    // ast.children?.length  && console.log(ast)
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
            {token.children.map((token, index) => {
                if(token.elmType==="text"){
                    return <React.Fragment key={token.id}>{token.content}</React.Fragment>
                }else if(token.elmType==="code"){
                    return <code key={token.id}>{token.content}</code>
                    // return <code key={token.id}>{token.children[0].content}</code>
                }else if(token.elmType==="strong"){
                    return <strong key={token.id}>{_addElementRecursively(token)}</strong>
                }else if(token.elmType==="italic"){
                    return <em key={token.id}>{_addElementRecursively(token)}</em>

                }else if(token.elmType==="del"){
                    return <del key={token.id}>{_addElementRecursively(token)}</del>
                }else if(token.elmType==="img"){
                    return <span 
                            key={token.id}
                            style={{display:"block", textAlign: "center", position: "relative"}}
                        >
                            <RenderImage token={token} />
                        </span>
                }else if(token.elmType==="link"){
                    return <a 
                                key={token.id}
                                // href={token.content}
                                href={token.attributes ? token.attributes[1].attrValue : ""}
                                // style={{color: "#00f"}}
                                target="_blank" rel="noopener noreferrer"
                            >
                                {token.content ? token.content : ""}
                            </a>
                }else if(token.elmType==="url"){
                    return  <a key={token.id} href={token.content ? token.content : ""} target="_blank" rel="noopener noreferrer">
                    {/* return  <a key={token.id} href={token.attributes ? token.attributes[1].attrValue : ""} target="_blank" rel="noopener noreferrer"> */}
                                {/* {token.attributes ? token.attributes[1].attrValue : ""} */}
                                <span style={{color:"#3b49df"}}>{token.content}ppp</span>
                            </a>
                }else if(token.elmType==="linkCard"){
                    if(token.attributes && token.attributes[1].attrValue.slice(0,20) === 'https://twitter.com/'){
                        return  <a key={token.id} href={token.attributes ? token.attributes[1].attrValue : ""} target="_blank" rel="noopener noreferrer">
                                {token.attributes ? token.attributes[1].attrValue : ""}
                            </a>
                        // return <Twitter src={token.attributes ? token.attributes[1].attrValue : ""}  key={token.id} />
                    }else if(token.attributes && token.attributes[1].attrValue.slice(0,25) === 'https://www.instagram.com'){
                        // Instagram に対応できていないため
                        return  <a key={token.id} href={token.attributes ? token.attributes[1].attrValue : ""} target="_blank" rel="noopener noreferrer">
                                    {token.attributes ? token.attributes[1].attrValue : ""}
                                </a>
                    }
                    return <BlogCard
                                key={token.id}
                                src={token.attributes ? token.attributes[1].attrValue : ""} 
                            />
                    // return <iframe 
                    //         key={token.id}
                    //         className="hatenablogcard" 
                    //         style={{width: "100%", height: "150px", maxWidth: "680px"}}
                    //         title={token.attributes ? token.attributes[0].attrValue : ""} 
                    //         src={`${location.origin}/embed?url=${token.attributes ? token.attributes[1].attrValue : ""}`}
                    //         width="300" height="150" frameBorder="0" scrolling="no"
                    //     ></iframe>
                }else if(token.elmType==="at"){
                    return <Link 
                                key={token.id}
                                to={token.content ? `/prof/${token.content.slice(1,)}` : ""}
                                // style={{color: "#00f"}}
                                target="_blank" rel="noopener noreferrer"
                            >
                                {token.content ? token.content : ""}
                            </Link>
                }
                

                return null
            })}
        </>
    )
};
