import React from 'react';
import {MdToc} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { convertToSeconds } from '../../../utils/TimeController';


type TocProps = {
    toc: {
        type: string;
        content: string;
        time: string;
    }[] | undefined
};
const Toc = (props:TocProps) => {
    let navigate = useNavigate();

    return (
        <details className="toc_container" open>
            <summary>
                <MdToc /> 
                <span className="toc_title">目次</span>
            </summary>

            <ul className="toc">

                {props.toc?.map((h, i) => 
                    <li 
                        className={`toc_heading ${ h.type[1]==="1" ? "toc_heading_one" : "toc_heading_two"}`} 
                        key={i} 
                    >
                        <Link 
                            to={"#" + String(convertToSeconds(h.time)) + "s"} 
                            onClick={()=>{
                                // Link では #~~ に遷移しないので
                                document.getElementById(`${String(convertToSeconds(h.time))}s`)?.scrollIntoView({ 
                                    behavior: 'smooth',
                                });
                            }}
                        >
                            {h.content}
                        </Link>
                    </li>
                )}
            </ul>
        </details>

    )
}

export default Toc;