import { USER } from '../../types/user';
import UserCell from './UserCell';



type Props = {
    loginId?: string;
    users: USER[];
    followUnfollow: Function | null;
    toggleUserList: Function;
};

const UserList = (props:Props) => {
    return (
        <ul className="user_list_container">
            { props.users.map(( user, i ) => 
                <li key={i}>
                    <UserCell 
                        loginId={props.loginId} 
                        user={user} 
                        followUnfollow={props.followUnfollow} 
                        toggleUserList={props.toggleUserList}
                    />
                </li>
            )}
        </ul>
    )
};

export default UserList;