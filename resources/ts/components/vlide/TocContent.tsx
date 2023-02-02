import { Link } from 'react-router-dom';

import { convertToSeconds } from '../../utils/TimeController';



type TocContentProps = {
    toc: {
        type: string;
        content: string;
        time: string | number;
    }[] | undefined
};

const TocContent = (props: TocContentProps) => {
    return (
        <ul className="toc">
            {props.toc?.map((h, i) => 
                <li 
                    className={`toc_heading ${ h.type[1]==="1" ? "toc_heading_one" : "toc_heading_two"}`} 
                    key={i} 
                >
                    <Link 
                        to={"#" + convertToSeconds(String(h.time)) + "s"} 
                        onClick={()=>{
                            // Link では #~~ に遷移しないので
                            document.getElementById(`${convertToSeconds(String(h.time))}s`)?.scrollIntoView({ 
                                behavior: 'smooth',
                            });
                        }}
                    >
                        {h.content}
                    </Link>
                </li>
            )}
        </ul>
    )
};

export default TocContent;