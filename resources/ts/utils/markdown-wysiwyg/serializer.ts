import { slideBlockRegExp, slideRegExp } from "../regexps";
import { convertToSeconds, setTimeInDigitalFormat } from "../TimeController";
import { generateUid } from "../uid";

// DB --> string -parser-> {id: string, type: string; content: string; time: string;}[] 
// --> string --> DB

// type INPUT_ATTRIBUTES = { [_: string ]: string | number | boolean }
export type INPUT_BLOCK = {
    id: string;
    type: string;
    content: string;
    time: number;
    // attribute?: INPUT_ATTRIBUTES;
};

// DB からのデータを Editor で扱うフォーマットに変更
export const serializer = (text:string): INPUT_BLOCK[] => {
    const slideArray = text?.match(slideBlockRegExp);
    
    const slides = slideArray 
        ?   slideArray.map((slide, i) =>{
                const match = slide.match(slideRegExp);
                if(match){
                    return { 
                        id: generateUid(),
                        type: match[1],
                        content: match[2],
                        time: convertToSeconds(match[3])
                    };
                }else{
                    return {
                        id: generateUid(),
                        type: "",
                        content: "",
                        time: 0
                    };
                }
            })
        :   [{ 
                id: generateUid(),
                type: text,
                content: "",
                time: 0
            }];

    return slides;
};

// DB に保存
export const deserializer = (inputArray: INPUT_BLOCK[]): string => {
    let output = "";
    
    sortByTime(inputArray)
        .forEach((input, _) => {
            output += `---${input.type}\n${input.content}\n---${setTimeInDigitalFormat(input.time)}\n`
        });

    return output;
};

export const sortByTime = (array: INPUT_BLOCK[]) => {
    return array.sort((a, b) => {
        return Number(a.time) - Number(b.time);
    }); // sort: 破壊的メソッド
};