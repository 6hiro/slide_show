import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { USER } from '../../types/user';



type Props = {
    loginId?: string | null;
    user: USER;
    followUnfollow: Function | null;
    toggleUserList: Function;
};

const UserCell = (props: Props) => {
    return (
        <div 
            className='user_cell'
        >
            <Link 
                className='user_cell__left'
                to={`/prof/${props.user.name}`}
                onClick={(e) => { 
                    props.toggleUserList(false);
                }}
            >
                <div className='icon_wrapper'>
                    { props.user?.file_name 
                        ? 
                            <img 
                                src={props.user.file_name}
                                alt="user icon" 
                                className="img" 
                                style={{borderRadius: "50%"}}
                            />

                        : <>{[...props.user.nick_name][0]}</>
                    }
                </div>

                <div className="user_cell__left__top">
                    <div className="user_cell__left__top__name">
                        <div className='user_cell__left__top__name__user'>
                            {props.user.nick_name} 
                        </div>
                        <div className='user_cell__left__top__name__nick'>
                            @{props.user.name}
                        </div>
                    </div>

                </div>
            </Link>

           { (props.loginId && (props.loginId !== props.user.id ) && props.followUnfollow)?
                <div className="user_cell__right">
                    <div 
                        className={`user_cell__right__follow_button ${props.user.isFollowed ? "is_followed" : ""}`}
                        onClick={ 
                            useCallback(
                                () => {props.followUnfollow && props.followUnfollow(props.user.id, props.loginId)}
                            , [props.user.id, props.loginId])
                        }
                    >
                        {
                            props.user.isFollowed 
                                ? "アンフォロー" 
                                : "フォロー"
                        }
                    </div>
                </div>
            : null}
        </div>
    )
};

export default UserCell;