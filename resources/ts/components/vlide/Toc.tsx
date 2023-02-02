import {MdToc} from 'react-icons/md';
import { INPUT_BLOCK } from '../../utils/markdown-wysiwyg/serializer';

import TocContent from './TocContent';



type TocProps = {
    id?: string;
    toc: {
        type: string;
        content: string;
        time: string | number;
    }[] | undefined;
    // toc: INPUT_BLOCK | undefined;
};

const Toc = (props:TocProps) => {

    return (
        <details className="toc_container" open>
            <summary style={{outline: "none"}}>
                <MdToc /> 
                <span className="toc_title">目次</span>
            </summary>
            <TocContent toc={props.toc} />
        </details>

    )
};

export default Toc;