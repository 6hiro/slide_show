import { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate, useParams } from 'react-router-dom';
import { BiDotsHorizontal, BiUpArrowAlt, BiX } from 'react-icons/bi';

import RadioButton from '../../components/vlide/drafts/RadioButton';
import TitleInput from '../../components/vlide/drafts/TitleInput';
import { siteTitle } from '../../constants/site';
import { useDraftBook } from '../../hooks/useDraftBook';
import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import useToggle from '../../hooks/useToggle';
import { UPDATE_BOOK } from '../../types/book';
import { generateUid } from '../../utils/uid';
import Overview from '../../components/book/Overview';
import NewPageMenu from '../../components/book/NewPageMenu';
import NewPageButton from '../../components/book/NewPageButton';
import { VlideCard } from '../../components/book/VlideCard';
import TicketMenu from '../../components/book/TicketMenu';
import ConfirmationScreen from '../../components/book/ConfirmationScreen';
import SetBookType from '../../components/book/SetBookType';



type Props = {
    user: any;
    isLoadingUser: boolean;
};

const DraftBook = (props: Props) => {
    const { user, isLoadingUser } = props;

    const {
        pages,
        pageNextPageLink,
        // setPageNextPageLink,
        book,
        users,
        userNextPageLink,
        title, 
        setTitle, 
        overview,
        setOverview,
        isPublic, 
        setIsPublic,
        bookType,
        setBookType,
        isLoading,
        setIsLoading,
        retrieveForDraft, 
        getUserVlides,
        getMoreVlides,
        getTicketUsers,
        getMoreTicketUsers,
        update,
        deleteBook,
        setUnsetPage,
        changePageOrder,
        approveUnapprove,
    } = useDraftBook();

    const { book_id } = useParams();

    // const [image, setImage] = useState<File | null>(null);
    // const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
    // const [isShowedImgMenu, setIsShowedImgMenu] = useToggle(false);
    const [isShowedMenu, setIsShowedMenu] = useToggle(false);

    const [isShowedPageMenu, setIsShowedPageMenu] = useToggle(false);
    const [isShowedDeleteMenu, setIsShowedDeleteMenu] = useToggle(false);
    const [isShowedTicketMenu, setIsShowedTicketMenu] = useToggle(false);

    const [isChangedPageOrder, setIsChangedPageOrder] = useToggle(false);


    const [_, setToastNotifications] = useContext(ToastNotificationsContext);

    const submit =  async (e: any) => {
        
        e.preventDefault();

        if(typeof book_id === "string"){
            setIsLoading(true);

            if(title.length > 50) {
                setToastNotifications(prev => {
                    return[...prev, {id: generateUid(), type:"warning", message:"タイトルは50文字入力できます。"}];
                });
                return;
            }      

            if(overview.length > 400) {
                setToastNotifications(prev => {
                    return[...prev, {id: generateUid(), type:"warning", message:"概要は400文字入力できます。"}];
                });
                return;
            }            
            const data: UPDATE_BOOK = {book_id, title, overview, is_public: isPublic, book_type: bookType}

            await update(setToastNotifications, data, isChangedPageOrder);
            
            setIsChangedPageOrder(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(typeof book_id === "string" && user) {
            retrieveForDraft(book_id);
        } 
    }, [book_id]);

    if(!isLoadingUser && !user) return (<Navigate to="/auth/login" replace={true} />)

    if(!book_id) return null;

    if(!book?.id && !isLoading) return <div style={{marginTop: "50px", textAlign: "center", fontWeight: "600"}}>404 | お探しのページは見つかりませんでした</div>;

    return (
        <div className="book_draft_container">
            <Helmet>
                <meta charSet="utf-8" />
                <title>下書き / Book / {siteTitle}</title>
                <meta
                    name="description"
                    content="下書き"
                />
            </Helmet>

            <div className="book_draft__form">
                {isShowedTicketMenu 
                    ?   <TicketMenu 
                            // is_admitted={book?.is_admitted}
                            bookId={book_id}
                            loginId={user.id} 
                            users={users} 
                            userNextPageLink={userNextPageLink}
                            getTicketUsers={getTicketUsers}
                            getMoreTicketUsers={getMoreTicketUsers} 
                            setIsShowedTicketMenu={setIsShowedTicketMenu}  
                            approveUnapprove={approveUnapprove}
                        />
                    : null 
                }
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "20px 0 30px"}}>
                    <div 
                        className='dot_horizontal'
                        onClick={setIsShowedMenu}
                    >
                        {!isShowedMenu ? <BiDotsHorizontal/> : <BiX />}
                    </div>
                    {isShowedDeleteMenu 
                        ? <ConfirmationScreen title='本当にブックを削除しますか' yesText="削除" noText="キャンセル" action={()=>{deleteBook(book_id, user.name)}} setIsShowedMenu={setIsShowedDeleteMenu}  /> 
                        : null
                    }
                    {isShowedMenu 
                        ?   <div className='book_draft__menu_container'>
                                <div 
                                    className="item delete_button" 
                                    onClick={() => {
                                        setIsShowedDeleteMenu();
                                        setIsShowedMenu(false);
                                    }}
                                    // onClick={()=>{deleteBook(book_id, user.name)}}
                                >ブックを削除</div>
                                <div 
                                    className="item"
                                    onClick={() => {
                                        setIsShowedTicketMenu(true);
                                        setIsShowedMenu(false);
                                    }}
                                >チケット</div>
                            </div> 
                        : null
                    }
                    <div 
                        style={{ 
                            margin: "0px 0px 0px auto", 
                            width: "142px", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            flexDirection: "column", 
                            rowGap: "20px"
                        }
                    }>
                        <RadioButton isPublic={isPublic} setIsPublic={setIsPublic} />
                        <SetBookType bookType={bookType} setBookType={setBookType} />
                    </div>
                </div>
                <TitleInput title={title} setTitle={setTitle} autoFocus={false} />
                <Overview overview={overview} setOverview={setOverview} />

                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "20px 0 0px"}}>
                    <div></div>

                    <div>
                        <button 
                            className="submit_button"
                            disabled={ (!title || !overview) && !isLoading }
                            onClick={submit}
                        >
                            {isPublic ? "公開する" : "非公開で保存"}
                        </button>
                    </div>
                </div>



            </div>
            {isShowedPageMenu 
                ? 
                    <NewPageMenu 
                        bookId={book_id}
                        userId={user.id}
                        isShowedMenu={isShowedPageMenu} 
                        setIsShowedMenu={setIsShowedPageMenu} 
                        getUserVlides={getUserVlides} 
                        getMoreVlides={getMoreVlides}
                        pages={pages}
                        pageNextPageLink={pageNextPageLink}
                        setUnsetPage={setUnsetPage}
                    />
                : null
            }
            
            <div className="book_draft__pages">
                {book?.pages.map((page,i) =>{
                    return <div key={i+"page"} className="book_draft__pages__page_container">
                                {/* <div>{page.order}</div> */}
                                {i!==0 
                                    ?   <div 
                                            className='arrow'
                                            onClick={()=> {
                                                changePageOrder(i);
                                                !isChangedPageOrder && setIsChangedPageOrder(true);
                                            }}
                                        ><BiUpArrowAlt/></div>
                                    :   <div className='no_arrow'></div>
                                }
                                <div className="book_draft__pages__page_wrapper">
                                    <VlideCard page={page} bookId={book_id} setUnsetPage={setUnsetPage }  />
                                </div>
                            </div>
                })}
            </div>


            <div onClick={setIsShowedPageMenu}>
                <NewPageButton />
            </div>
        
        </div>
    )
};

export default DraftBook;