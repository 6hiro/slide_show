import { memo } from 'react';

import InputContainer from './inputElements/InputContainer';
import Text from './inputElements/Text';
import HeadingOne from './inputElements/HeadingOne';
import HeadingTwo from './inputElements/HeadingTwo';
import Quote from './inputElements/Quote';
import Hr from './inputElements/Hr';
import Toc from '../../components/vlide/Toc';
import Alert from './inputElements/Alert';
import Message from './inputElements/Message';
import Code from './inputElements/Code';
import YoutubeURL from './inputElements/YoutubeURL';
import Table from './inputElements/table/Table';
import { CONTENT_EDITOR_ACTIONS } from '../../hooks/useContentEditor';



type Props = {
    // index: number;
    content: {
        id: string;
        type: string;
        content: string;
        time: number;
    };
    // setContent: Dispatch<SetStateAction<string>>;
    actions: CONTENT_EDITOR_ACTIONS;
    isFlex: boolean;
    toc: {
        id: string;
        type: string;
        content: string;
        time: number;
    }[] | undefined;
};

const InputBlock = memo((props: Props) => {
    const {content, actions, isFlex, toc} = props;

    const blockType = (content: typeof props.content) => {
        if(content.type==="h1") return <HeadingOne id={content.id} headingText={content.content} actions={props.actions} />
        if(content.type==="h2") return <HeadingTwo id={content.id} headingText={content.content} actions={props.actions} />
        if(content.type==="text" || content.type === '') return <Text id={content.id} text={content.content} actions={props.actions} />
        if(content.type==="table") return <Table id={content.id} content={content.content} type={content.type} actions={props.actions} />
        if(content.type==="toc") return <Toc id={content.id} toc={toc} />
        if(content.type==='quote') return <Quote id={content.id} text={content.content} actions={props.actions} />
        if(content.type==="hr") return <Hr id={content.id} />
        if(content.type.split("?")[0].split(":")[0] && content.type.split("?")[0].split(":")[0]==='code') return <Code id={content.id} text={content.content} type={content.type} actions={props.actions} />
        if(content.type==="message") return <Message id={content.id} text={content.content} actions={props.actions} />
        if(content.type==="alert") return <Alert id={content.id} text={content.content} actions={props.actions} />
        if(content.type==="youtube") return <YoutubeURL id={content.id} text={content.content}actions={props.actions}  />
    }

    return (
        <InputContainer 
            id={content.id} 
            time={content.time} 
            actions={actions} 
            InputElement={blockType(content)}
            blockType={content.type}
            isFlex={isFlex} 
        />
    )
});

export default InputBlock;