import {memo } from 'react';

import InputBlock from './InputBlock';
import { INPUT_BLOCK } from './serializer';


type Props = {
    // content: string;
    // setContent: Dispatch<SetStateAction<string>>;
    blockArray: INPUT_BLOCK[];
    actions: any;
    isFlex: boolean;
    toc: {
        id: string;
        type: string;
        content: string;
        time: number;
    }[] | undefined
};

const ContentEditor = memo((props: Props) => {    
    const {blockArray, isFlex, actions, toc} = props;
// console.log(blockArray)
    return (
        <div style={{marginBottom: "400px"}}>
            {blockArray.map((content, _) => {
                return (
                    <InputBlock 
                        content={content} 
                        actions={actions} 
                        isFlex={isFlex} 
                        toc={toc} 
                        key={content.id}
                    />
                )
            })}
        </div>
    )
});

export default ContentEditor;