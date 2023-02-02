import { Link } from 'react-router-dom';
import { PAGE } from '../../types/book';



type Props = {
    page: PAGE;
    bookId: string;
    setUnsetPage: (bookId: string, vlideId: string) => Promise<void>;
    // index: number;
};

export const VlideCard = (props: Props) => {
    return (
        <div className="book_vlide_card_container">
            <div className='book_vlide_card'>

                <div className='book_vlide_card__title'>
                    <Link
                        to={`/drafts/vlide/${props.page.id}`}
                        // target="_blank" rel="noopener noreferrer"
                    >
                        {props.page.title}

                    </Link>
                </div>
                <div 
                    className="book_vlide_card__action" 
                    onClick={() => {
                        props.setUnsetPage(props.bookId, props.page.id)
                    }}
                >
                    {props.page.isPageOf 
                        ? <div className="book_vlide_card__action__button isPageOf">ブックから削除</div>
                        : <div className="book_vlide_card__action__button">ブックに追加</div>
                    }
                </div>

            </div>
        </div>
    );
};
