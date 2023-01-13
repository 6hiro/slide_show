import { BiX } from "react-icons/bi";
import { LineShareButton, TwitterShareButton, TwitterIcon, LineIcon } from "react-share";

import { generateUid } from "../../../utils/uid";
import { ToastNotification } from "../../toastNotification/ToastNotifications";



type Props = {
    vlideId: string;
    vlideTitle: string;
    is_public: boolean;
    shareUrl: string;
    showShare: boolean;
    setShowShare: Function;
    setToastNotifications: React.Dispatch<React.SetStateAction<ToastNotification[] | []>>;
}

const VlideShareMenu = (props: Props) => {
    const { 
        vlideId, 
        vlideTitle, 
        is_public, 
        shareUrl, 
        showShare, 
        setShowShare, 
        setToastNotifications 
    }  = props;

    return (
        <div className="vlide__share" >
 
            <div 
                className={`${showShare ? "vlide__share__overlay" : ""}`}  
                onClick={() => {
                    if(is_public){
                        setShowShare(!showShare);
                    }
                }}
            >
            </div>
            <div className={`vlide__share__menu ${showShare ? "show_share__menu" : ""}`}>
                <div className="close_form" onClick={()=>setShowShare(false)} ><BiX/></div>

                <div className="vlide__share__menu__title" >共有</div>
                <ul className="vlide__share__menu__list" >
                    <li>
                        <TwitterShareButton
                            url={shareUrl}
                            title={vlideTitle}
                            className=""
                            // related={[""]}
                            hashtags={["Vlides"]}
                        >
                            <TwitterIcon size={45} round />
                        </TwitterShareButton>
                    </li>
                    <li>
                        <LineShareButton
                            url={shareUrl}
                            title={vlideTitle}
                            className="" 
                        >
                            <LineIcon size={45} round />
                        </LineShareButton>
                    </li>
                    {/* <li>
                        <FacebookShareButton
                            url={shareUrl}
                            title={vlideTitlwe}
                            hashtag={"vlide"}
                            className="" 
                        >
                            <FacebookIcon size={40} round />
                        </FacebookShareButton>
                    </li> */}
                </ul>
                <div
                    className="vlide__share__link_copy"
                    onClick={ (e) => {
                        e.preventDefault();        
                        navigator.clipboard.writeText(`${window.location.origin}/vlide/${vlideId}`)
                            .then( () => {
                                setToastNotifications(prev => {
                                    return[
                                        {id: generateUid(), type:"success", message:"リンクをコピーしました。"},
                                    ];
                                });
                            })
                    }} 
                >
                    リンクをコピー
                </div>
            </div>
        </div>

    )
};

export default VlideShareMenu;