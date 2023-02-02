import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { TICKET_USER } from '../../types/book';


type Props = {
    bookId: string;
    loginId?: string | null;
    user: TICKET_USER;
    approveUnapprove: Function | null;
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

           { (props.loginId && (props.loginId !== props.user.id ) && props.approveUnapprove)?
                <div className="user_cell__right">
                    <div 
                        className={`user_cell__right__follow_button ${props.user.is_admitted ? "is_followed" : ""}`}
                        onClick={ 
                            useCallback(
                                () => {props.approveUnapprove && props.approveUnapprove(props.bookId, !props.user.is_admitted, props.user.id)}
                            , [props.user.id, props.user.is_admitted])
                        }
                    >
                        {
                            props.user.is_admitted 
                                ? "承認取消" 
                                : "承認"
                        }
                    </div>
                </div>
            : null}
        </div>
    )
};

export default UserCell;