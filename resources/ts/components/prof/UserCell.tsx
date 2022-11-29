import { Link } from 'react-router-dom';
import { USER } from '../../types/user';

type Props = {
    accountId?: string | null;
    user: USER;
    followUnfollow: Function;
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
                // style={{display: "block"}}
            >
                <div className='icon_wrapper'>
                    {props.user.name.slice(0,1)}
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


            <div 
                className="user_cell__right"
                // onClick={(e) => { 
                //     props.toggleUserList(false);
                //     navigate(`/prof/${props.user.name}`)
                // }}
            >
                {props.accountId !== props.user.id 
                    ?    <div 
                            className={`user_cell__right__follow_button ${props.user.isFollowed ? "is_followed" : ""}`}
                            onClick={ () => {props.followUnfollow(props.user.id)}}
                        >
                            {
                                props.user.isFollowed 
                                    ? "アンフォロー" 
                                    : "フォロー"
                            }
                        </div>
                    : null
                }
            </div>

        </div>
    )
};

export default UserCell;