import {MdToc} from 'react-icons/md';

import TocContent from './TocContent';



type TocProps = {
    toc: {
        type: string;
        content: string;
        time: string;
    }[] | undefined
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