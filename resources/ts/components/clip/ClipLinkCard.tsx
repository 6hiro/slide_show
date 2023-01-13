import { useLayoutEffect, useState } from 'react';

import { fetchBlogCard } from '../../actions/vlide';
import { BLOGCARD } from '../../types/vlide';



type Props = {
    src: string | undefined;
};
const ClipLinkCard = (props: Props) => {
    const { src } = props;
    const [blogCard, setBlogCard] = useState<BLOGCARD>();

    useLayoutEffect(() => {
        if(src) {
            fetchBlogCard(src, setBlogCard)
        }
    },[src]);

    if(!blogCard) return null;

    return (
        <div style={{userSelect: "none"}} className="clip-link-card">
            <a href={src} style={{textDecoration: "none"}} target="_blank" rel="noopener noreferrer">
                <div className="link-box">
                    <div className="img-box">
                        {blogCard.og_image 
                            ?  <img 
                                    src={blogCard.og_image} 
                                    alt={blogCard.og_title
                                            ? blogCard.og_title
                                            : blogCard.title
                                    }
                                />
                            : <div className="no-image"><div>NO IMAGE</div></div>
                        }
                    </div>
                    <div className="text-box" style={{userSelect: "none"}}>
                        <div className="title">
                            {blogCard.og_title
                                ? blogCard.og_title
                                : blogCard.title ? blogCard.title : "" }
                        </div>
                        <div className="site-description">
                            {blogCard.og_site_name} 
                        </div>
                        <div className="site-url">
                            {src}
                        </div>
                    </div>
                </div>
            </a>
        </div>

    )
};

export default ClipLinkCard;