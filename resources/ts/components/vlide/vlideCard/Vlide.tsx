import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiDotsHorizontal, BiLoaderAlt, BiPause, BiPlay, BiShare } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

import { VLIDE } from '../../../types/vlide';
import useToggle from '../../../hooks/useToggle';
import { generateUid } from '../../../utils/uid';
import { ToastNotificationsContext } from '../../../hooks/useToastNotifications';
import VlideShareMenu from './VlideShareMenu';
import { setTimeInDigitalFormat } from '../../../utils/TimeController';
import VlideMenu from './VlideMenu';
import Audio from './Audio';
import { countWord, cutWord } from '../../../utils/countWord';



const Vlide:React.FC<{
    vlide: VLIDE,
    savedUnsaved: Function,
    loginId: string,
    destroy: Function
}> = (props) => {
    let navigate = useNavigate();

    const [showMenu, setShowMenu] = useToggle(false);
    const [showDelete, setShowDelete] = useToggle(false);
    const [showShare, setShowShare] = useToggle(false);
    const [isRunning, setIsRunning] = useToggle(false);
    const [isLoading, setIsLoading] = useToggle(false);
    const [isFirstRunning, setIsFirstRunning] = useToggle(true);
    const [_, setToastNotifications] = useContext(ToastNotificationsContext);


    const shareUrl = `https://${window.location.hostname}/vlide/${props.vlide.id}`;

    // discussionの削除
    const deleteVlide = async() =>{
        props.destroy(props.vlide.id, setShowDelete)
    };


    return (
        <div className="vlide_card_container" id="vlide_card">
            <VlideShareMenu 
                vlideId={props.vlide.id}
                vlideTitle={props.vlide.title} 
                is_public={props.vlide.is_public} 
                shareUrl={shareUrl} 
                showShare={showShare} 
                setShowShare={setShowShare} 
                setToastNotifications={setToastNotifications}  
            />
            <VlideMenu 
                loginId={props.loginId} 
                vlide={props.vlide}
                showMenu={showMenu} 
                setShowMenu={setShowMenu} 
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                deleteVlide={deleteVlide}
            />

            <div 
                className="vlide_heading"
                onClick={(e) => { 
                    if(props.vlide.is_public){
                        navigate(`/vlide/${props.vlide.id}`);
                    }else if(!props.vlide.is_public && props.loginId === props.vlide.user.id){
                        navigate(`/drafts/vlide/${props.vlide.id}`);
                    }
                }}
            >
                <div className="vlide_heading__title">
                    {countWord(props.vlide.title) > 40 ? cutWord(props.vlide.title, 40)+"..." : props.vlide.title}
                </div>
            </div>
            <div className="vlide_main">
                <div className="vlide_main__img_wrapper">
                    {props.vlide.header_file_name
                    // {true
                        ?   <img 
                                src={props.vlide.header_file_name} 
                                // src='https://placeimg.com/1048/214/arch'
                                // src='https://placeimg.com/730/320/arch'
                                // src="https://developers.giphy.com/branch/master/static/api-512d36c09662682717108a38bbb5c57d.gif"
                                alt={props.vlide.title}
                                className="header_img"
                                decoding="async"
                            />
                        : null
                    }
                    <div 
                        className="img_cover"
                        onClick={(e) => { 
                            if(props.vlide.is_public){
                                navigate(`/vlide/${props.vlide.id}`);
                            }else if(!props.vlide.is_public && props.loginId === props.vlide.user.id){
                                navigate(`/drafts/vlide/${props.vlide.id}`);
                            }
                        }}
                    ></div>
                </div>
                <div 
                    className="vlide_main__actions_container"
                    style={{height: `${props.vlide.duration && props.vlide.audio_file_name ? "175px": "165px"}`}}
                >
                    <div 
                        className="vlide_main__actions" 
                        style={{
                            height: `${props.vlide.duration && props.vlide.audio_file_name ? "168px": "158px"}`,
                            rowGap: `${props.vlide.duration && props.vlide.audio_file_name ? "8px": "14px"}`
                        }}
                    >
                        <div className="vlide_main__actions__item" >
                            <BiDotsHorizontal 
                                fontSize={"22px"}
                                onClick={() => {
                                    setShowMenu(!showMenu)
                                }}
                            />
                        </div>

                        {props.vlide.duration && props.vlide.audio_file_name
                            ?    <div 
                                    className="vlide_main__actions__item" 
                                    onClick={() => {
                                        if(isFirstRunning){
                                            // AudioFile をロードを開始
                                            setIsFirstRunning(false)
                                        }
                                        setIsRunning(!isRunning)
                                    }}
                                >
                                    {
                                        !isLoading 
                                            ?   !isRunning 
                                                    ?  <BiPlay 
                                                            size={36}
                                                            style={{paddingLeft:"3px"}}
                                                            className="play"
                                                            id="play" 
                                                        />
                                                    :  <BiPause 
                                                            size={36}
                                                            className="pause" 
                                                            id="pause" 
                                                        />
                                            :  <BiLoaderAlt 
                                                    size={30}
                                                    className="loader_circle" 
                                                    id="loader_circle" 
                                                />
                                    }
                                    {!isFirstRunning
                                        ?  <Audio 
                                                audio_file_name={props.vlide.audio_file_name} 
                                                isFirstRunning={isFirstRunning}
                                                isRunning={isRunning}  
                                                setIsRunning={setIsRunning}
                                                setIsLoading={setIsLoading}
                                            />
                                        :null
                                    }
                                </div>

                            : null
                        }


                        <div 
                            className="vlide_main__actions__item" 
                            onClick={() => {
                                if(props.loginId){
                                    if(props.vlide.is_public){
                                        props.savedUnsaved(props.vlide.id);
                                    }else{
                                        setToastNotifications(prev => {
                                            return[
                                                {id: generateUid(), type:"warning", message:"公開されている投稿のみ保存できます"},
                                            ];
                                        });                           
                                    }
                                }else{
                                    setToastNotifications(prev => {
                                        return[
                                            {id: generateUid(), type:"warning", message:"投稿を保存するにはログインが必要です"},
                                        ];
                                    });
                                }
                            }}
                        >
                            {props.vlide.is_saved 
                                ? <FaBookmark className="bookmarked" size={16} />
                                : <FaRegBookmark size={16} />
                            }
                        </div>

                        <div className="vlide_main__actions__item" >
                            <BiShare 
                                fontSize={"22px"} 
                                onClick={() => {
                                    if(props.vlide.is_public){
                                        setShowShare(!showShare)
                                    }
                                }}
                            />
                        </div>

                    </div>
                </div>

            </div>

            <div className="vlide_footer">
                <Link 
                    to={`/prof/${props.vlide.user.name}`}
                    className="vlide_footer__left"
                    id="vlide_avatar"
                >
                    { props.vlide.user.file_name 
                        ? 
                            <img 
                                src={props.vlide.user.file_name}
                                alt="user icon" 
                                className="img" 
                                style={{borderRadius: "50%"}}
                            />
                        : <>{[...props.vlide.user.nick_name][0]}</>
                    }
                </Link>
                <div className="vlide_footer__right">
                    <Link
                        to={`/prof/${props.vlide.user.name}`}
                        className="vlide_footer__right__name"  
                    >
                        <span> {props.vlide.user.nick_name}</span>
                        <span> </span>
                        <span>@{props.vlide.user.name}</span>
                    </Link>

                    <div className="vlide_footer__right__dates">
                        {props.vlide.published_at && 
                            <div>{props.vlide.published_at.slice(0,10)}</div>
                        }
                    </div>

                </div>
            </div>

            {props.vlide.duration 
                ?<div className="vlide_duration" >
                    <div 
                        className="vlide_duration__item" 
                        onClick={() => { 
                            if(props.vlide.is_public){
                                navigate(`/vlide/${props.vlide.id}`);
                            }
                        }}
                    >
                        <div className="" >
                            {setTimeInDigitalFormat(props.vlide.duration)}
                        </div>
                    </div>
                </div>
                :null
            }
        </div>
    )
};

export default Vlide;