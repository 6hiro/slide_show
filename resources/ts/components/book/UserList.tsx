import { TICKET_USER } from '../../types/book';
import UserCell from './UserCell';



type Props = {
    // is_admitted: boolean | undefined;
    loginId?: string;
    bookId: string;
    users: TICKET_USER[];
    approveUnapprove: Function | null;
    toggleUserList: Function;
};

const UserList = (props:Props) => {
    return (
        <ul className="user_list_container">
            { props.users.map(( user, i ) => 
                <li key={i}>
                    <UserCell 
                        // is_admitted={props.is_admitted}
                        bookId={props.bookId}
                        loginId={props.loginId} 
                        user={user} 
                        approveUnapprove={props.approveUnapprove} 
                        toggleUserList={props.toggleUserList}
                    />
                </li>
            )}
        </ul>
    )
};

export default UserList;