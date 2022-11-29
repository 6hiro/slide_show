import React, { useState } from 'react';
import DecoratedClipContent from './DecoratedClipContent';
import DotsButton from '../button/DotsButton';
import { useNavigate } from 'react-router-dom';
import { CLIP } from '../../types/clip';
import { Link } from 'react-router-dom';
import { MdAutorenew } from 'react-icons/md';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import useToggle from '../../hooks/useToggle';


const Clip: React.FC<{
    clip:CLIP;
    // user: USER;
    loginId: string,
    likeUnlike: Function;
    shareClip: Function;
    unShareClip: Function;
    deleteClip: Function;
}> = (props) => {

    let navigate = useNavigate();

    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useToggle(false);
    const [reClipId, setReClipId] = useState("");

    const isShared = props.clip.clip_type==="reclip";
    const isReply = props.clip.clip_type==="reply";

    const clip = (props.clip.clip_type==="reclip" || props.clip.content===null) 
                ? props.clip.parent 
                : props.clip;



    return (
        <div className="clip_card_container">
            {isShared && 
                <div className="clip__shared_by">
                    <Link 
                        style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bolder'}} 
                        to={`/prof/${props.clip.user.id}`}
                    > 
                        <MdAutorenew style={{ fontSize: "0.9rem" }}/>
                        {props.clip.user.nick_name}さんがシェア
                    </Link>
                </div>
            }
            
            {/* reply先がある時 */}
            {(isReply && props.clip.parent !== null) &&
                <div  className="clip__reply_to">
                    <Link to={`/clip/${props.clip.parent.id}`}  style={{display: "block"}} >
                        返信先：
                        @{props.clip.parent.user?.name}
                    </Link>
                </div>
            }
            {/* reply先が削除されてる場合 */}
            {(isReply && props.clip.parent ===null) &&
                <div  className="clip__reply_to">
                    返信先は削除されました。
                </div>
            }

            <div className="clip_card">

                <div className="clip_icon">   
                    {clip.user.nick_name 
                        ?   <Link  to={`/prof/${clip?.user?.name}`}> 
                                {[...clip.user.nick_name][0]}
                                {/* {clip?.user.nick_name[0]} */}
                            </Link>
                        : null
                     }  

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
                                <DotsButton />
                            </div>
                            {(clip?.user.id === props.loginId && !isShared) &&
                                <>
                                    <div className={`${showMenu ? "overlay" : ""}`}  onClick={() => {setShowMenu(!showMenu)}}></div>
                                    <ul className={`clip_main__header__right__menu ${showMenu ? "show_menu" : ""}`}>
                                        <li 
                                            onClick={() => {
                                                setShowMenu(false);
                                                setShowDelete(!showDelete);
                                            }}>
                                            <i className='bx bx-trash-alt'></i>
                                            つぶやきを削除
                                        </li>
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
                                </>
                            }
                        </div>
                    </div>
                    {( clip?.quote && clip?.vlide_id )
                        ?   <div className="clip_quote" >
                                <Link to={`/vlide/${clip?.vlide_id}`} style={{display: "block"}} >
                                    {clip?.quote}
                                </Link>                            
                            </div>
                        : null
                    }
                    {clip?.content
                        ?  <div className="clip_text" >
                                {/* <Link to={`/clip/${clip?.id}/`} style={{display: "block"}} > */}
                                    <DecoratedClipContent content={clip?.content} />
                                {/* </Link> */}
                            </div> 
                        : null
                    }
       

                    <div className="clip_additional_elements">
                        <div  className="clip_comment_btn_container" >
                            <div aria-label="to comment list">
                                <Link to={`/clip/${clip?.id}`} style={{display: "block"}} >
                                    <FaRegComment />
                                </Link>
                            </div>
                            <span
                                className="clip_likes"
                                onClick={() =>{
                                    navigate(`/clip/${clip?.id}`)
                                }} 
                            >
                                {clip?.count_replies}
                            </span>
                        </div>
                       
                        <div  className="clip_share_btn_container" >
                            {(isShared || reClipId) ?
                                <div
                                    aria-label="unshare-button"
                                    onClick={async() => {
                                        if(reClipId){
                                            props.unShareClip(reClipId, setReClipId);
                                        }else{
                                            props.unShareClip(props.clip?.id, setReClipId);
                                        }
                                    }}
                                >
                                    <MdAutorenew fontSize="small" style={{ color: "#ffa801" }}/>
                                </div>
                            :
                                <div
                                    div-label="share-button"
                                    onClick={async() => {
                                        props.shareClip(clip?.id, setReClipId);
                                    }}
                                >
                                    <MdAutorenew />
                                </div>                             
                            }
                        </div>

                        <div className="clip_like_btn_container" >
                            <div 
                                onClick={() => {
                                    props.likeUnlike(clip?.id);
                                }}
                            > 
                                {clip?.is_liked ? <FaHeart className="liked" /> : <FaRegHeart/> }
                            </div>
                            <div
                                className="clip_likes"
                                onClick={async() =>{
                                    if(clip?.count_likes>0){
                                    }
                                }} 
                            >
                                {clip?.count_likes}
                                {/* {openUserList && users?.length
                                    ? <div className="user_list" >
                                            <div className="overlay" onClick={toggleUserList}></div>
                                            <div className="formContainer" >
                                                <div className="closeForm" onClick={toggleUserList} ><BiX/></div>
                                                <div className="form" >
                                                    {users?.length 
                                                        ?   <div>
                                                                <UserList
                                                                    accountId={user?.id} 
                                                                    users={users} 
                                                                    followUnfollow={followUnfollow} />
                                                            </div>
                                                        : null
                                                    }
                                                    { ( users && userNextPageLink ) && 
                                                        <GetMoreButton nextPageLink={userNextPageLink} gerMoreFunc={getMoreUser} />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    : null
                                } */}
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        </div>
    )
};

export default Clip;