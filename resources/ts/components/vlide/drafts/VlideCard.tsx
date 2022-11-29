import React from 'react';
import DotsButton from '../../button/DotsButton';
import { VLIDE } from '../../../types/vlide';

import { BiEditAlt, BiPaperclip, BiShare, BiTrashAlt } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import {
    LineShareButton,
    TwitterShareButton,
    TwitterIcon,
    LineIcon,
} from "react-share";
import useToggle from '../../../hooks/useToggle';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const VlideCard:React.FC<{
    vlide: VLIDE,
    savedUnsaved: Function,
    loginId: string,
    destroy: Function
}> = (props) => {

    let navigate = useNavigate();

    const [showMenu, setShowMenu] = useToggle(false);
    const [showDelete, setShowDelete] = useToggle(false);
    const [showShare, setShowShare] = useToggle(false);
    const shareUrl = `https://${window.location.hostname}/vlide/${props.vlide.id}`;

    // discussionの削除
    const deleteVlide = async() =>{
        console.log("#####")
        props.destroy(props.vlide.id, setShowDelete)
        // setShowDelete(false);
    };

  return (
    <div 
        className="vlide_card_container"
        id="vlide_card"
    >
        <div className="vlide__header">
            <div 
                className="vlide__header__left"
                onClick={(e) => { 
                    navigate(`/prof/${props.vlide.user.name}`)
                }}
            >
                <div 
                    className="vlide__header__left__left"
                    id="vlide_avatar"
                    style={{zIndex: "1"}}
                >
                    {[...props.vlide.user.nick_name][0]}
                </div>
                <div className="vlide__header__left__right">
                    <div
                        className="vlide__header__left__right__name"    
                    >
                        {props.vlide.user.nick_name} @{props.vlide.user.name}
                    </div>

                    <div className="vlide__header__left__right__dates">
                        {props.vlide.published_at && 
                            <div>{props.vlide.published_at.slice(0,10)}に公開</div>
                        }
                    </div>

                </div>
            </div>

            <div className="vlide__header__right" >
                <div 
                className="vlide__dot"
                    onClick={() => {
                        if(props.loginId === props.vlide.user.id){
                            setShowMenu(!showMenu)
                        }
                    }}
                >
                    <DotsButton />
                </div>
                <div 
                    className={`${showMenu ? "overlay" : ""}`}  
                    onClick={() => {
                        if(props.loginId === props.vlide.user.id){
                            setShowMenu(!showMenu)
                        }
                    }}
                ></div>
                <ul className={`vlide__header__right__menu ${showMenu ? "show_menu" : ""}`}>
                     <li>
                        <Link to={`/drafts/vlide/${props.vlide.id}`}>
                            <div>
                                <BiEditAlt /> 投稿を編集
                            </div>
                        </Link>
                    </li>
                    <li 
                        onClick={() => {
                            setShowMenu(false);
                            setShowDelete(!showDelete);
                        }}
                    >
                        <BiTrashAlt /> 投稿を削除
                    </li>
                </ul>
                
                {/* 削除画面 */}
                <div className={`${showDelete ? `overlay delete_overlay` : ""}`}  onClick={() => {setShowDelete(!showDelete)}}></div>
                <div className={`vlide__header__right__delete ${showDelete ? "show_delete" : ""}`}>
                    <p>
                        本当に
                        <span className='vlide__header__right__delete__content'>
                            {props.vlide.title.slice(0, 20)}
                            {props.vlide.title.length > 20 && <span>...</span>}
                        </span>

                        を削除してもよろしいですか？
                    </p>
                    <div className="selects">
                        <div className="no" onClick={() => {setShowDelete(!showDelete)}}>
                            キャンセル 
                        </div>
                        <div 
                            className="yes" 
                            onClick={() => { 
                                deleteVlide();
                            }}>
                            削除
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div
            onClick={(e) => { 
                if(props.vlide.is_public){
                    navigate(`/vlide/${props.vlide.id}`);
                }
            }}
            className="vlide__main"
        >
            <div className="vlide__main__title" >
                {props.vlide.title}
            </div>
        </div>

        <ul className="vlide__additional_elements">
            <div className="vlide__clip" >
                <div 
                    className="vlide__clip__button"
                    onClick={(e) => { 
                        if(props.vlide.is_public){
                            navigate(`/vlide/${props.vlide.id}#clips`);
                        }
                    }}
                >
                    <BiPaperclip /> 
                </div>
                <div className="vlide__clip__count" >{props.vlide.count_clips}</div>
            </div>


            <div 
                className="vlide__bookmark"
                onClick={() => {
                        if(props.vlide.is_public){
                            props.savedUnsaved(props.vlide.id);
                        }
                    }
                }
            >
                {props.vlide.is_saved 
                    ? <FaBookmark className="bookmarked" />
                    : <FaRegBookmark />
                }
               
            </div>

            <div className="vlide__share" >
 
                <BiShare 
                    onClick={() => {
                        if(props.vlide.is_public){
                            setShowShare(!showShare)
                        }
                    }}
                />
                <div 
                    className={`${showShare ? "vlide__share__overlay" : ""}`}  
                    onClick={() => {
                        if(props.vlide.is_public){
                            setShowShare(!showShare);
                        }
                    }}
                >
                </div>
                
                <ul className={`vlide__share__menu ${showShare ? "show_share__menu" : ""}`}>
                    <li>
                        <TwitterShareButton
                            url={shareUrl}
                            title={props.vlide.title}
                            className=""
                            // related={["GatsbyJS"]}
                            hashtags={["vlide"]}
                        >
                            <TwitterIcon size={35} round />
                        </TwitterShareButton>
                    </li>
                    <li>
                        <LineShareButton
                            url={shareUrl}
                            title={props.vlide.title}
                            className="" 
                        >
                            <LineIcon size={38} round />
                        </LineShareButton>
                    </li>
                    {/* <li>
                        <FacebookShareButton
                            url={shareUrl}
                            title={props.vlide.title}
                            hashtag={"vlide"}
                            className="" 
                        >
                            <FacebookIcon size={40} round />
                        </FacebookShareButton>
                    </li> */}

                </ul>
            </div>

            {/* tags */}
        </ul>
    </div>
  );
};

export default VlideCard;