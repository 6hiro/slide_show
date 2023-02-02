import { useContext, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { useBook } from '../../hooks/useBook';
import { siteTitle, siteURL } from '../../constants/site';
import Ticket from '../../components/ticket/Ticket';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import { generateUid } from '../../utils/uid';



type Props = {
    user: any;
    isLoadingUser: boolean;
};

const DetailBook = (props: Props) => {
    let navigate = useNavigate();

    const { user, isLoadingUser } = props;

    const { book_id } = useParams();

    const { book, isLoading, retrieve, getUngetTicket } = useBook();

    const [_, setToastNotifications] = useContext(ToastNotificationsContext);

    useEffect(() => {
        if(typeof book_id === "string" && user) {
            retrieve(book_id);
        } 
        // if(user) getUserVlides(user.id);
    }, [book_id]);

    if(!isLoadingUser && !user) return (<Navigate to="/auth/login" replace={true} />)

    if(!book_id) return null;
    if(!book) return null;
    if(!book?.id && !isLoading) return <div style={{marginTop: "50px", textAlign: "center", fontWeight: "600"}}>404 | お探しのページは見つかりませんでした</div>;


    return (
        <div className="book_detail_container">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{book.title ? book.title : "ブック"} / {siteTitle}</title>
                <meta
                    name="description"
                    content="下書き"
                />
            </Helmet>
            <div className="book_detail">
                <header className='book_detail__header'>
                    <div className="book_detail__header__author">
                        <div className="book_detail__header__author__icon">
                            <Link to={`/prof/${book.user.name}`}>
                                { book.user?.file_name 
                                    ? 
                                        <img 
                                            src={book.user.file_name}
                                            alt="user icon" 
                                            className="img" 
                                            style={{borderRadius: "50%"}}
                                        />

                                    : <> {[...book.user.nick_name][0]}</>

                                }
                            </Link> 

                        </div>
                        <div>
                            <div className="book_detail__header__author__name">
                                    <Link to={`/prof/${book.user.name}`}>
                                    {book.user.nick_name}
                                </Link>
                            </div>
                            <time 
                                className="book_detail__header__author__dates"
                                dateTime={book.published_at.slice(0,10)}
                                itemProp="datepublished"
                            >
                                {book.published_at && 
                                    <div>{book.published_at.slice(0,10).replace(/-/g, ' / ')}</div>
                                }
                            </time>
                        </div>
                    </div>
                    <div className="book_detail__header__action">
                        {book.user.id === user?.id
                            ? <li className="book_detail__header__action__button" >
                                    <div>
                                        <Link to={`/drafts/book/${book.id}`}  className="edit_icon" >
                                            <FaEdit size={28}/>
                                        </Link>
                                    </div>
                                </li>
                            : null
                        }
                    </div>
                </header>

                <div className="book_detail__title">{book.title}</div>

                <div className="book_detail__overview">{book.overview}</div>

                <div className="book_detail__ticket">
                    {book.is_got 
                        ?   <>
                                {book.is_admitted 
                                    ?   <div 
                                            className='ticket_button'
                                            onClick={ () => {
                                                // getUngetTicket(book_id)
                                                navigate(`/book/${book_id}/page/1`);
                                            }}
                                        ><span>チケットを使う</span></div>
                                    :   <div 
                                            className='ticket_button'
                                            // onClick={ () => {
                                            //     getUngetTicket(book_id)
                                            // }}
                                        >
                                            <span>承認待ち</span>
                                        </div>
                                }
                            </>
                        :   <>
                                { book.user.id===user.id 
                                    ? <div className='ticket_button' onClick={()=> navigate(`/book/${book_id}/page/1`) }>ページを見る</div>
                                    :
                                        <div className='ticket_button' onClick={()=>getUngetTicket(book_id)}>
                                            <span>チケットをゲットする</span>
                                        </div>
                                }
                            </>
                    }
                    <div 
                        style={{
    
                        }}
                        className="book_detail__ticket__wrapper"
                        onClick={()=>{
                            (book.user.id===user.id) && navigator.clipboard
                                .writeText(`${siteURL}/book/${book_id}`)
                                .then( () => {
                                    setToastNotifications([{
                                        id: generateUid(),
                                        type: "success",
                                        message: "リンクをコピーしました。"
                                    }])
                                })
                        }}
                    >
                        <Ticket 
                            ticketNumber={book.count_tickets} 
                            title={book.title} 
                            username={book.user.name} 
                            nickname={book.user.nick_name} 
                            url={book.is_public ? `/book/${book.id}` : `/drafts/book/${book.id}`} 
                            imgPass={book.user.file_name ? book.user.file_name : `/images/Logo.png`}
                            // imgPass=""  
                            jumpToLink={false}
                        />
                    </div>

                </div>
                
                <div className="book_detail__pages">
                    {book?.pages.map((page,i) =>{
                        return <div 
                                    key={i+"page"} 
                                    className="book_detail__pages__page_container"
                                    onClick={ () => {
                                        ((book.is_got && book.is_admitted) || book.user.id===user.id) && navigate(`/book/${book_id}/page/${i+1}`)
                                    }}
                                >
                                    <div className="page_index">
                                        {i+1 < 10 ? "0"+(i+1) : i+1}
                                    </div>
                               
                                    <div className="book_detail__pages__page_wrapper">
                                        {page.title}
                                    </div>
                                </div>
                    })}
                </div>

            </div>

        </div>
    )
};

export default DetailBook;