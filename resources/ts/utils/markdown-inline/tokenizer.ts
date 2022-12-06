// https://github.com/asmsuechan/minute/blob/74d9604e9b0bd1c52a36f5bdb4b7e997cffb935e/src/parser.ts
import { inlineRegexps } from '../regexps';
import { Attribute, RootToken, Token } from './type/token';


export const tokenizer = (content: string, initialId?: number) => {
    const id: number = initialId ? initialId : 0;

    let rootToken: RootToken = {
        id: id,
        elmType: "root",
        content: '',
        children: []
    };
    
    return _tokenizeInline(content, rootToken, id);
};

const _tokenizeInline = (text:string, rootToken:RootToken, initialId:number): Token => {
    let id = initialId;

    const _recursiveTokenize = (originalText: string, parentToken: Token) => {
        let processingText = originalText;
        let parent = parentToken;
        let inlineTokens: Token[] = [];

        // 行が空文字になるまで処理を繰り返す
        while (processingText.length !== 0) {
            const matchArray = inlineRegexps
                .map((regexp) => {
                    return {
                        elmType: regexp.elmType,
                        // inlineRegexps内の正規表現を一つずつのどれもマッチしない場合、null
                        matchArray: processingText.match(regexp.regexp) as RegExpMatchArray,
                    };
                })
                .filter((m) => m.matchArray);

            if (matchArray.length === 0) {
                id += 1;
                const onlyTextToken: Token = {id:id, elmType:"text", content:processingText, children:[]}
                inlineTokens.push(onlyTextToken)
                processingText = '';
            }else {
                // マッチした文字列のうち、マッチした箇所のインデックスが一番小さなものを取り出す
                const outerMostElement = matchArray.reduce((prev, curr) =>
                    Number(prev.matchArray.index) < Number(curr.matchArray.index) ? prev : curr
                );

                if (Number(outerMostElement.matchArray.index) > 0) {
                    // "aaa**bb**cc" -> TEXT Token + "**bb**cc" にする
                    const text = processingText.substring(0, Number(outerMostElement.matchArray.index));
                    id += 1;
                    // const textElm = genTextElement(id, text, parent);
                    const textToken = {id, elmType:"text", content:text, parent, children: []}
                    inlineTokens.push(textToken)
                    processingText = processingText.replace(text, '');
                }

                if (parent.elmType === 'code') {
                    id += 1;
                    const codeToken: Token = {id, elmType:"text", content:outerMostElement.matchArray[0], children:[]}
                    inlineTokens.push(codeToken);
                    // codeは、子要素を持たないので、これ以上探索しない
                    processingText = processingText.replace(outerMostElement.matchArray[0], '');
                } else {
                    id += 1;
                    let attributes: Attribute[] = [];
                    if (outerMostElement.elmType === 'img') {
                      attributes.push({ attrName: 'text', attrValue: outerMostElement.matchArray[1] });
                      attributes.push({ attrName: 'src', attrValue: outerMostElement.matchArray[2] });
                    } else if (outerMostElement.elmType === 'link') {
                      attributes.push({ attrName: 'text', attrValue: outerMostElement.matchArray[1] });
                      attributes.push({ attrName: 'href', attrValue: outerMostElement.matchArray[2] });
                    }
                    const elmType = outerMostElement.elmType;
                    const content = outerMostElement.matchArray[1];
                    const elm: Token = {
                      id,
                      elmType,
                      content,
                      children:[],
                      attributes,
                    };
          
                    // Set the outer element to parent
                    parent = elm;
                    inlineTokens.push(elm);
          
                    processingText = processingText.replace(outerMostElement.matchArray[0], '');
          
                    _recursiveTokenize(outerMostElement.matchArray[1], parent);
                }
                //   再帰を用いて、
                parent = parentToken;
            }
        }

        parent.children.push(...inlineTokens);

        return parentToken;
    }


    return _recursiveTokenize(text, rootToken);
}