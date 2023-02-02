import { FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



type Props = {
    ticketNumber: number;
    title: string;
    username: string;
    nickname: string;
    url: string;
    // imgPass: string;
    jumpToLink: boolean;
};

const BookCard = (props: Props) => {
    let navigate = useNavigate();

    return (
        <div className='book_card_container' onClick={()=> (props.url  && props.jumpToLink) && navigate(`${props.url}`)}>
            <div className="book_card">
                <div className="book_card__border"></div>
                <div className="book_card__content">
                    <div className="book_card__content__author">{props.nickname}</div>
                    <div className="book_card__content__title">
                        {props.title}
                    </div>
                </div>

                <div className="book_card__ticket_count">
                    <FaTicketAlt />
                    <div className='book_card__ticket_count'>{props.ticketNumber}</div>
                </div>
            </div>
        </div>
    )
};

export default BookCard;