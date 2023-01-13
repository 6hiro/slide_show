import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { BiX } from 'react-icons/bi';

import DecoratedClipContent from './DecoratedClipContent';
import DotsButton from '../button/DotsButton';
import { CLIP } from '../../types/clip';
import { Link } from 'react-router-dom';
import { MdAutorenew } from 'react-icons/md';
import useToggle from '../../hooks/useToggle';
import UserList from '../prof/UserList';
import GetMoreButton from '../layout/GetMoreButton';
import { USER } from '../../types/user';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import { generateUid } from '../../utils/uid';



const Clip: React.FC<{
    clip:CLIP;
    // user: USER;
    loginId: string,
    getShareUsers: Function;
    getlikeUsers: Function;
    likeUnlike: Function;
    shareClip: Function;
    unShareClip: Function;
    deleteClip: Function;
    users: USER[] | undefined;
    userNextPageLink: string | undefined;
    getMoreUser: Function;
    followUnfollow: Function;
}> = (props) => {

    let navigate = useNavigate();

    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useToggle(false);
    const [reClipId, setReClipId] = useState(""); //reclip button が押されたかの判断に使う
    const [toastNotifications, setToastNotifications] = useContext(ToastNotificationsContext);

    const [openUserList, toggleUserList] = useToggle(false);

    const isShared = props.clip.clip_type==="reclip";
    const isReply = props.clip.clip_type==="reply";

    const clip = (props.clip.clip_type==="reclip" || props.clip.content===null) 
                ? props.clip.parent 
                : props.clip;

    if(!clip) return null;

    return (
        <div className="clip_card_container">
            {isShared && 
                <div className="clip__shared_by">
                    <Link 
                        style={{ display: "block", textDecoration: 'none', color: 'blue', fontWeight: 'bolder'}} 
                        to={`/prof/${props.clip.user.name}`}
                    > 
                        <MdAutorenew style={{ fontSize: "0.9rem" }}/>
                        {props.clip.user.nick_name}さんがシェア
                    </Link>
                </div>
            }
            {/* isShared && reply先がある時 */}
            { (isShared && props.clip.parent && props.clip.parent.clip_type === "reply" && props.clip.parent.parent)
                ?
                    <div  className="clip__reply_to">
                        <Link to={`/clip/${props.clip.parent.parent.id}`}  style={{display: "block"}} >
                            返信先：
                            @{props.clip.parent.parent.user?.name}
                        </Link>
                    </div>
                : null
            }

            {/* !isShared && reply先がある時 */}
            { ( (isReply && props.clip.parent && props.clip.parent !== null) )
                ?
                    <div  className="clip__reply_to">
                        <Link to={`/clip/${props.clip.parent.id}`}  style={{display: "block"}} >
                            返信先：
                            @{props.clip.parent.user?.name}
                        </Link>
                    </div>
                : null
            }
            {/* reply先が削除されてる場合 */}
            {(isReply && props.clip.parent ===null) 
                ?
                    <div  className="clip__reply_to">
                        返信先は削除されました。
                    </div>
                : null
            }

            <div className="clip_card">
                <div 
                    className="clip_icon_wrapper"
                    onClick={(e) => {
                        const { target } = e;
                        // console.log( location.pathname)
                        if( !(target instanceof HTMLAnchorElement) && location.pathname !== `/clip/${clip?.id}`){
                            navigate(`/clip/${clip?.id}`)
                        }
                    }}
                >   
                    <div className="clip_icon">   
                        {clip.user.file_name 
                            ?  <img 
                                    src={clip.user.file_name}
                                    alt="user icon" 
                                    className="img" 
                                    style={{borderRadius: "50%"}}
                                />
                            :   <>
                                    {clip.user.nick_name 
                                        ?   <Link  to={`/prof/${clip?.user?.name}`}> 
                                                {[...clip.user.nick_name][0]}
                                                {/* {clip?.user.nick_name[0]} */}
                                            </Link>
                                        : null
                                    }  
                                </>
                        }

                    </div>
                </div>
                
                <div className="clip_main">
                    <div className="clip_main__header">
                        <div className="clip_main__header__left">
                            <Link 
                                to={`/prof/${clip?.user?.name}`}
                            > 
                                <div className="clip_nick_name">
                                    {clip?.user?.nick_name}
                                    <div className="clip_user_name">@{clip?.user?.name}</div>
                                </div>
                            </Link>
                        
                            <div className="cliped_at">
                                {clip?.created_at}
                            </div>
                        </div>


                        <div className="clip_main__header__right">
                            <div onClick={() => {setShowMenu(!showMenu)}}>
                                <DotsButton isVertical={false} />
                            </div>
                            <div className={`${showMenu ? "overlay" : ""}`}  onClick={() => {setShowMenu(!showMenu)}}></div>
                            <ul className={`clip_main__header__right__menu ${showMenu ? "show_menu" : ""}`}>
                                <li
                                    onClick={ (e) => {
                                        e.preventDefault();        
                                        navigator.clipboard.writeText(`${window.location.origin}/clip/${clip.id}`)
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
                                </li>
                                {clip?.user.id === props.loginId && !isShared 
                                    ?
                                        <li 
                                            onClick={() => {
                                                setShowMenu(false);
                                                setShowDelete(!showDelete);
                                            }}>
                                            <i className='bx bx-trash-alt'></i>
                                            クリップを削除
                                        </li>
                                    :null
                                }
                            </ul>
                            {/*   削除画面  */}
                            <div className={`${showDelete ? "overlay delete_overlay" : ""}`}  onClick={() => {setShowDelete(!showDelete)}}></div>
                            <div className={`clip_main__header__right__delete ${showDelete ? "show_delete" : ""}`}>
                                <p className="clip_main__header__right__delete__content" >
                                    <strong>
                                        {clip?.content.slice(0, 20)}
                                        {clip?.content.length > 20 && <span>...</span>}
                                    </strong>
                                    を削除してもよろしいですか？
                                </p>
                                <div className="selects">
                                    <div className='no' onClick={() => {setShowDelete(!showDelete)}}>
                                        キャンセル 
                                    </div>
                                    <div className="yes" onClick={async() => { 
                                        await props.deleteClip(props.clip?.id, setShowDelete);
                                    }}>
                                        削除
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {( clip?.quote)
                        ?   <>
                                {clip?.vlide_id 
                                    ?   <Link to={`/vlide/${clip?.vlide_id}`} style={{display: "block"}} >
                                            {
                                                ( 
                                                    clip?.quote.length>33 &&
                                                    clip?.quote[0]==="!" && 
                                                    (clip?.quote.slice(33) ===".jpeg" || clip?.quote.slice(33) ===".png" || clip?.quote.slice(33) ===".gif" || clip?.quote.slice(33) ===".jpg" )
                                                )
                                                    ? <img src={`/api/v1/image?f=${clip?.quote.slice(1)}`} alt="quote img" style={{maxWidth: "270px"}}/>
                                                    :  <div className="clip_quote">{clip?.quote}</div>
                                            }
                                        </Link>   
                                    :    <>
                                            {
                                                (
                                                    clip?.quote.length>33 &&
                                                    clip?.quote[0]==="!" && 
                                                    (clip?.quote.slice(33) ===".jpeg" || clip?.quote.slice(33) ===".png" || clip?.quote.slice(33) ===".gif" || clip?.quote.slice(33) ===".jpg" )
                                                )
                                                    ? <img src={`/api/v1/image?f=${clip?.quote.slice(1)}`} alt="quote img" style={{maxWidth: "270px"}}/>
                                                    :  <div className="clip_quote">{clip?.quote}</div>
                                            }
                                    </>
                                }
                       
                            </>
                        : null
                    }
                    {clip?.content
                        ?  <div
                                className="clip_text" 
                                onClick={(e) => {
                                    const { target } = e;
                                    if( !(target instanceof HTMLAnchorElement) && location.pathname !== `/clip/${clip?.id}`){
                                        navigate(`/clip/${clip?.id}`)
                                    }
                                }}
                            >
                                <DecoratedClipContent content={clip?.content} clipId={clip.id} />
                            </div> 
                        : null
                    }
       

                    <div className="clip_additional_elements">
                        <div  className="clip_comment_btn_container" >
                            <div aria-label="to comment list">
                                <Link to={`/clip/${clip?.id}`} style={{display: "block"}} className="clip_comment_btn" >
                                    <FaRegComment />
                                </Link>
                            </div>
                            <Link
                                className="clip_counts"
                                to={`/clip/${clip?.id}`}
                            >
                                {Number(clip?.count_replies).toLocaleString()}
                            </Link>
                        </div>
                       
                        <div  className="clip_share_btn_container" >
                            {/* clip_type が reclip かつ clip の userId と loginId が同じ時、または reClipのアクションがなされた時 */}
                            {((isShared && props.clip.user.id === props.loginId) || reClipId)  
                                ?
                                    <div
                                        aria-label="unshare-button"
                                        className="clip_share_btn"
                                        onClick={async() => {
                                            if(props.loginId) {
                                                if(reClipId){
                                                    props.unShareClip(reClipId, setReClipId);
                                                }else{
                                                    props.unShareClip(props.clip?.id, setReClipId);
                                                }
                                            }
                                        }}
                                    >
                                        <MdAutorenew fontSize="small" style={{ color: "#ffa801" }}/>
                                    </div>
                                :
                                    <div
                                        div-label="share-button"
                                        className="clip_share_btn"
                                        onClick={async() => {
                                            if(props.loginId) {
                                                props.shareClip(clip?.id, setReClipId);
                                            }else{
                                                setToastNotifications(prev => {
                                                    return[
                                                        {id: generateUid(), type:"warning", message:"リクリップするにはログインが必要です"},
                                                    ];
                                                });
                                            }
                                        }}
                                    >
                                        <MdAutorenew />
                                    </div>                             
                            }
                            <div
                                className="clip_counts"
                                onClick={async() =>{
                                    if(clip?.count_reclips>0 && props.loginId){
                                        props.getShareUsers(clip.id);
                                        toggleUserList(true);
                                    }
                                }} 
                            >
                                {Number( clip?.count_reclips + (reClipId ? 1 : 0) ).toLocaleString()}
                            </div>
                        </div>

                        <div className="clip_like_btn_container" >
                            <div 
                                className="clip_like_btn" 
                                onClick={() => {
                                    if(props.loginId) {
                                        props.likeUnlike(clip?.id);
                                    }else{
                                        setToastNotifications(prev => {
                                            return[
                                                {id: generateUid(), type:"warning", message:"いいねするにはログインが必要です"},
                                            ];
                                        });
                                    }
                                }}
                            > 
                                {clip?.is_liked ? <FaHeart className="liked" /> : <FaRegHeart/> }
                            </div>
                            <div
                                className="clip_counts"
                                onClick={async() =>{
                                    if(clip?.count_likes>0 && props.loginId){
                                        props.getlikeUsers(clip.id);
                                        toggleUserList(true);
                                    }
                                }} 
                            >
                                {Number(clip?.count_likes).toLocaleString()}
                            </div>
                        </div>

                        {openUserList && props.users?.length
                            ? <div className="user_list" >
                                    <div className="overlay" onClick={() => toggleUserList(false)}></div>
                                    <div className="formContainer" tabIndex={0} onClick={(e) => {e.currentTarget.focus()}} style={{outline: "none"}}>
                                        <div className="closeForm" onClick={()=>toggleUserList(false)} ><BiX/></div>
                                        <div className="form" >
                                            {props.users?.length 
                                                ?   <div>
                                                        <UserList
                                                            loginId={props.loginId}
                                                            users={props.users}
                                                            followUnfollow={props.followUnfollow} 
                                                            toggleUserList={() => toggleUserList(false)} 
                                                        />
                                                    </div>
                                                : null
                                            }
                                            { ( props.users && props.userNextPageLink ) && 
                                                <GetMoreButton nextPageLink={props.userNextPageLink} gerMoreFunc={props.getMoreUser} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            : null
                        }
                    </div>
                </div>            
            </div>
        </div>
    )
};

export default Clip;