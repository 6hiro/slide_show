// https://www.m3tech.blog/entry/2021/08/23/124000
import { tokenizer } from './tokenizer';
import { Token } from './type/token';

type Props = {
    content: string
};

export const DecoratedText = (props: Props) => {
    // 抽象構文木(AST)を作成
    const ast = tokenizer(props.content);

    if(ast.children?.length === 0) return null;
    if(ast.children?.length === 1) return <>{ast.children[0].content}</>

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
                    return <>{token.content}</>
                }else if(token.elmType==="code"){
                    return <code key={token.id}>{token.children[0].content}</code>
                }else if(token.elmType==="strong"){
                    return <strong>{_addElementRecursively(token)}</strong>
                }else if(token.elmType==="italic"){
                    return <em key={token.id}>{_addElementRecursively(token)}</em>

                }else if(token.elmType==="del"){
                    return <del key={token.id}>{_addElementRecursively(token)}</del>
                }else if(token.elmType==="img"){
                    return <span 
                            // href={token.attributes ? token.attributes[1].attrValue : ""} 
                            // target="_blank" 
                            // rel="noopener noreferrer"
                            style={{display: "block", textAlign: "center"}}
                        >
                            <img 
                                key={token.id}
                                style={{
                                    maxHeight: "100%", 
                                    margin: "1rem 0", 
                                    // border: "1px solid rgba(0,0,0,.12)"
                                }}
                                src={token.attributes ? token.attributes[1].attrValue : ""}
                                alt={token.attributes ? token.attributes[0].attrValue : ""}
                            />
                        </span>
                }else if(token.elmType==="link"){
                    return <a 
                                key={token.id}
                                href={token.attributes ? token.attributes[1].attrValue : ""}
                                // style={{color: "#00f"}}
                                target="_blank" rel="noopener noreferrer"
                            >
                                {token.attributes ? token.attributes[0].attrValue : ""}
                            </a>
                }

                return null
            })}
        </>
    )
};
