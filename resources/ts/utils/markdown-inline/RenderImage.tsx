import { BiPaperclip, BiX } from 'react-icons/bi';

import useToggle from '../../hooks/useToggle';
import { Token } from './type/token';



type Props = {
    token: Token;
};

const RenderImage = (props: Props) => {
    const [isOpen, setIsOpen] = useToggle(false);
    const { token } = props;
    return (
        <>
            <img 
                // key={token.id}
                style={{
                    maxHeight: "100%", 
                    cursor: "zoom-in"
                    // margin: "0.4rem 0", 
                }}
                src={token.attributes ? token.attributes[1].attrValue : ""}
                alt={token.attributes ? token.attributes[0].attrValue : ""}
            />
            <span
                style={{
                    display:"block", 
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    top: "0",
                    cursor: "zoom-in"
                }}
                onClick={()=>{setIsOpen(true)}}
            ></span>

            {isOpen 
                ?   <div className='zoom_in_image_container'>
                        <div className="zoom_in_image_overlay" onClick={()=>{setIsOpen(false)}}></div>
                        <div className="zoom_in_image">
                            <div className="close_button" onClick={()=>{setIsOpen(false)}} ><BiX/></div>
                            {/* <div className="clip_button" >
                                <BiPaperclip
                                    id="slide_clip_img_button" // DetailVlide で使う
                                />
                            </div> */}
                            <div className="zoom_in_image_content" >
                                <img 
                                    src={token.attributes ? token.attributes[1].attrValue : ""}
                                    alt={token.attributes ? token.attributes[0].attrValue : ""}
                                    style={{pointerEvents: "unset"}}
                                    id="slide__img" // DetailVlide で使う
                                />
                            </div>
                        </div>

                    </div>
                : null
            }
        
        </>
    )
};

export default RenderImage;