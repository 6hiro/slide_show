import { useEffect } from 'react';
import { BiX } from 'react-icons/bi';

import { TICKET_USER } from '../../types/book';
import GetMoreButton from '../layout/GetMoreButton';
import UserList from './UserList';



type Props = {
    // is_admitted: boolean | undefined;
    bookId: string;
    loginId: string;
    users: TICKET_USER[] | undefined;
    userNextPageLink: string | undefined;
    getTicketUsers: (bookId: string) => Promise<void>;
    getMoreTicketUsers: () => void
    setIsShowedTicketMenu: (nextValue?: any) => void;
    approveUnapprove: Function;
};

const TicketMenu = (props: Props) => {
    useEffect(() => {
        if(!props.users && props.bookId) props.getTicketUsers(props.bookId);
    }, [props.bookId]);
    // console.log(props.users)

    return (
        <div className="ticket_user_list" >
            <div className="overlay" onClick={()=>props.setIsShowedTicketMenu(false)}></div>
            <div className="formContainer" tabIndex={0} onClick={(e) => {e.currentTarget.focus()}}  style={{outline: "none"}}>
                <div className="closeForm" onClick={()=>props.setIsShowedTicketMenu(false)} ><BiX/></div>
                <div className="title">チケット所有者</div>
                <div className="form" >
                    {props.users?.length 
                        ?   <div>
                                <UserList
                                    // is_admitted={props.is_admitted}
                                    loginId={props.loginId} 
                                    users={props.users} 
                                    bookId={props.bookId}
                                    approveUnapprove={props.approveUnapprove} 
                                    toggleUserList={()=>props.setIsShowedTicketMenu(false)}
                                />
                            </div>
                        : null
                    }
                    { ( props.users && props.userNextPageLink ) && 
                        <GetMoreButton nextPageLink={props.userNextPageLink} gerMoreFunc={props.getMoreTicketUsers} />
                    }
                </div>
            </div>
        </div>
    )
};

export default TicketMenu;