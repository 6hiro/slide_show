import { generateUid } from "../../uid";
import { INPUT_BLOCK, sortByTime } from "../serializer";
import { BLOCK_TYPE } from "../type";



// STATE を変換
export const contentReducer = (
    blockArray: INPUT_BLOCK[],
    action: {
        type: "ADD_BLOCK" | "DELETE_BLOCK" | "CHANGE_CONTENT" | "CHANGE_TIME" | "CHANGE_BLOCK_TYPE",
        payload: {id: string, blockType?: BLOCK_TYPE | `code:${string}?${string}`, content?: string, time?: number}
    }, 
): INPUT_BLOCK[] => {
    switch(action.type) {
        case "ADD_BLOCK":
            return sortByTime([...blockArray, {
                id: generateUid(),
                type: action.payload.blockType ? action.payload.blockType : "text",
                content: action.payload.content ? action.payload.content : "",
                time: action.payload.time ? action.payload.time : 0
            }]);
        case "DELETE_BLOCK":
            // block が最後の一つの場合は、ブロックを削除しない
            if(blockArray.length === 1) return blockArray;
            return [...blockArray.filter((block)=> block.id !== action.payload.id)];
        case "CHANGE_CONTENT":
            const newContent = action.payload.content;
            if(typeof newContent === "string"){
                const newContentArray= [ ...blockArray ];
                newContentArray?.map((block) => {
                    if(block.id === action.payload.id){
                        block.content = newContent;
                    }  
                });
                return newContentArray;
            } else {
                return blockArray;
            }
        case "CHANGE_TIME":
            const newTime = action.payload.time;
            if(typeof newTime === "number"){            
                const newContentArray= [ ...blockArray ];

                newContentArray?.map((block) => {
                    if(block.id === action.payload.id){
                        block.time = newTime;
                    }  
                });
                return sortByTime(newContentArray);
            } else {
                return blockArray;
            }
        case "CHANGE_BLOCK_TYPE":
            const newType = action.payload.blockType;
            // console.log(action.payload)
            if(typeof newType === "string"){
                const newContentArray= [ ...blockArray ];

                newContentArray?.map((block) => {
                    if(block.id === action.payload.id){
                        block.type = newType;
                    }  
                });

                return newContentArray;
            }else {
                return blockArray;
            }
    }
};