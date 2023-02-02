import { Link } from 'react-router-dom';

import { SHOW_IMAGE } from '../../types/vlide';



type Props = {
    image: SHOW_IMAGE
}
const Image = (props: Props) => {
    if(!props.image.vlides.length) {
        return null;
    }

    return (
        <Link 
            to={`/vlide/${props.image.vlides[0]?.id}`} 
            className="vlide_title"
        >
            <div className='img_wrapper'>
                <img 
                    src={props.image.url} 
                    alt={props.image.vlides[0]?.title} 
                    className='img'
                    // loading="lazy"
                    decoding="async"
                />
                <div  className="vlide_title">
                    {props.image.vlides[0]?.title}

                </div>
            <div style={{position: "absolute", bottom: "0", left: "0", right: "0", top: "0"}}></div>
            </div>
        </Link>
    )
};

export default Image;