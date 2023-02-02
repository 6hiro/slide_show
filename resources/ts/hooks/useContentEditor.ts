import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import { contentReducer } from "../utils/markdown-wysiwyg/reducer/content";
import { serializer, INPUT_BLOCK } from "../utils/markdown-wysiwyg/serializer";
import { BLOCK_TYPE } from "../utils/markdown-wysiwyg/type";



export type CONTENT_EDITOR_ACTIONS= {
    addBlock: (id: string, blockType: BLOCK_TYPE, content: string, time: number) => void;
    deleteBlock: (id: string) => void;
    changeContent: (id: string, content: string) => void;
    changeTime: (id: string, time: number) => void;
    changeType: (id: string, blockType: BLOCK_TYPE | `code:${string}?${string}`) => void;
};

export const useContentEditor = (
    content: string,
    setContent: Dispatch<SetStateAction<string>>
) => {
    // content: DB に保存する内容
    // contentArray: Editor で扱うデータ構造
    const [blockArray, setBlockArray] = useState<INPUT_BLOCK[]>(serializer(content));

    const toc = blockArray?.filter(content => content.type==='h1' || content.type=='h2');

    const addBlock = useCallback((id: string, blockType: BLOCK_TYPE, content: string, time: number) => {
        const newsetBlocktArray = contentReducer(
            blockArray, 
            {
                type: "ADD_BLOCK", 
                payload: {id: id, blockType: blockType, content: content, time: time}
            });
        newsetBlocktArray && setBlockArray(newsetBlocktArray);
    },[blockArray]);

    const deleteBlock = useCallback((id: string) => {
        const newsetBlocktArray = contentReducer(
            blockArray, 
            {
                type: "DELETE_BLOCK", 
                payload: {id: id}
            });
        newsetBlocktArray && setBlockArray(newsetBlocktArray);
    }, [blockArray]);

    const changeContent = useCallback((id: string, content: string) => {
        const newsetBlocktArray = contentReducer(
            blockArray, 
            {
                type: "CHANGE_CONTENT", 
                payload: {id: id, content: content}
            });
            // console.log(blockArray)
        newsetBlocktArray && setBlockArray(newsetBlocktArray);
    }, [blockArray]);
    
    const changeTime = useCallback((id: string, time: number) => {
        const newsetBlocktArray = contentReducer(
            blockArray, 
            {
                type: "CHANGE_TIME", 
                payload: {id: id, time: time}
            });
        newsetBlocktArray && setBlockArray(newsetBlocktArray);
    },[blockArray]);
    
    const changeType = useCallback((id: string, blockType: BLOCK_TYPE | `code:${string}?${string}`) => {
        const newsetBlocktArray = contentReducer(
            blockArray, 
            {
                type: "CHANGE_BLOCK_TYPE", 
                payload: {id: id, blockType: blockType}
            });
        newsetBlocktArray && setBlockArray(newsetBlocktArray);
    }, [blockArray]);

    // content が変更(DBからFetch, DBへの保存前)したタイミングでシリアライズ
    useEffect(() => {setBlockArray(serializer(content))}, [content]);

    // useEffect(() => { // 保存ボタンが押された時だけにする？
    //     if(contentArray) setContent(deserializer(contentArray));
    // }, [contentArray]);

    const actions = {
        addBlock,   
        deleteBlock,
        changeContent,
        changeTime,
        changeType,
    };
    return [
        blockArray,
        toc,
        actions
    ]  as const;
};