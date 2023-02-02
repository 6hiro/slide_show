import { useRef, useState } from "react";
import { getUngetAsyncTicket, retriveAsyncBook, retriveAsyncPage } from "../actions/book";
import { fetchAsyncLatestData, fetchAsyncMoreData } from "../actions/common";
import { saveUnsaveAsyncVlide } from "../actions/vlide";
import { BOOK, PAGE } from "../types/book";
import { VLIDE } from "../types/vlide";



export const useBook = () => {
    // let navigate = useNavigate();
    const processing: React.MutableRefObject<boolean> = useRef<boolean>(false);
    const [book , setBook ] = useState<BOOK>();

    const [pageNextPageLink, setPageNextPageLink] = useState<string>();

    const [pages, setPages] = useState<PAGE[]>();
    const [page, setPage] = useState<VLIDE>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    
    const retrieve = async(bookId: string) => {
        await retriveAsyncBook(bookId, setBook);
    };

    const retrievePage = async(bookId: string, vlideId: string) => {
        await retriveAsyncPage(bookId, vlideId, setPage);
    };

    const getUserVlides =  (userId: string, bookId: string) => {
        fetchAsyncLatestData(`/api/v1/book/${bookId}/user/${userId}`, setPages, setPageNextPageLink, setIsLoading);
    };
    const getMoreVlides = () => {
        fetchAsyncMoreData(pageNextPageLink, setPages, setPageNextPageLink);
    };

    const getUngetTicket =  async(bookId: string) => {
        await getUngetAsyncTicket(bookId, processing, setBook);
    }
    const savedUnsaved = (vlideId: string) => {
        saveUnsaveAsyncVlide(vlideId, null, setPage);
    };
    // useEffect(() => {
    //     if(book){
    //         book.title && setTitle(book.title);
    //         setIsPublic(book.is_public);
    //         book.overview && setOverview(book.overview)
    //     }
    // }, [book]);
    

    return {
        currentTime, 
        setCurrentTime,
        isRunning,
        setIsRunning,
        pages,
        pageNextPageLink,
        setPageNextPageLink,
        isLoading,
        setIsLoading,
        getUserVlides,
        getMoreVlides,
        retrieve,
        getUngetTicket,
        retrievePage,
        savedUnsaved,
        book,
        page,
    };
};