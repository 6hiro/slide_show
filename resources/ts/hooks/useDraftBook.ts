import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { approveUnapproveAsyncTicket, changeOrderAsyncPage, createAsyncBook, deleteAsyncBook, retriveAsyncForDraft, setUnsetAsyncPage, updateAsyncBook } from "../actions/book";
import { fetchAsyncLatestData, fetchAsyncMoreData } from "../actions/common";
import { deleteAsyncImage, uploadAsyncImage } from "../actions/image";
import { NEW_BOOK, UPLOAD_IMAGE, UPDATE_BOOK, BOOK, PAGE, TICKET_USER } from "../types/book";
import { ToastNotification } from "../types/toast";
import { generateUid } from "../utils/uid";



export const useDraftBook = () => {
    let navigate = useNavigate();
    const processing: React.MutableRefObject<boolean> = useRef<boolean>(false);
    const [book , setBook ] = useState<BOOK>();
    const [title, setTitle] = useState("");
    const [overview, setOverview] = useState("");
    const [bookType, setBookType] = useState("");

    const [pageNextPageLink, setPageNextPageLink] = useState<string>();
    const [pages, setPages] = useState<PAGE[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPublic, setIsPublic] = useState<boolean>(false);

    const [users, setUsers] = useState<TICKET_USER[]>();
    const [userNextPageLink, setUserNextPageLink] = useState<string>();

    const retrieveForDraft = async(bookId: string) => {
        setIsLoading(true);
        await retriveAsyncForDraft(bookId, setBook);
        setIsLoading(false);
    };

    const getUserVlides =  (userId: string, bookId: string) => {
        fetchAsyncLatestData(`/api/v1/book/${bookId}/user/${userId}`, setPages, setPageNextPageLink, setIsLoading);
    };
    const getMoreVlides = () => {
        fetchAsyncMoreData(pageNextPageLink, setPages, setPageNextPageLink);
    };
    const getTicketUsers = async(bookId: string) => {
        const url =`/api/v1/book/${bookId}/ticket/users`;
        await fetchAsyncLatestData(url, setUsers, setUserNextPageLink, null); 
    };

    const getMoreTicketUsers= () => {
        fetchAsyncMoreData(userNextPageLink, setUsers, setUserNextPageLink);
    };

    const create = (
        props: NEW_BOOK,
        setToastNotifications: React.Dispatch<React.SetStateAction<ToastNotification[] | []>>,
        toggleForm: (nextValue?: any) => void
    ) => {
        if (processing.current) return;

        processing.current = true;
        createAsyncBook( props, navigate, processing, setToastNotifications, toggleForm );
    };

    const update = async (
        setToastNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        { ...props }: UPDATE_BOOK,
        isChangedPageOrder: boolean
    ) => {
        // if (processing.current) return;
        processing.current = true;
        (book && isChangedPageOrder) && await changeOrderAsyncPage(props.book_id, book.pages);

        await updateAsyncBook(props, processing, navigate, setToastNotifications);
    };

    const setUnsetPage = async (
        bookId: string,
        vlideId: string
    ) => {
        if (processing.current) return;
        processing.current = true;
        setUnsetAsyncPage(bookId, vlideId, processing, setBook, setPages, pages);
    };
    const changePageOrder = (index: number) => {
        if (index !== 0 && book && index <= book.pages.length-1){
            const newBook = Object.assign({}, book);

            // 分割代入(1つ前のstepとorderの値を入れ替え)
            [newBook.pages[index].order, newBook.pages[index-1].order] = [newBook.pages[index-1].order, newBook.pages[index].order];
            // pagesをorderが小さい順に
            newBook.pages.sort((a, b) => {
                return a.order - b.order;
            });

            setBook(newBook);
        }
    };
    const deleteBook = async(bookId: string, username: string) => {
        await deleteAsyncBook(bookId, username, navigate);
    };

    const approveUnapprove = async (
        bookId: string,
        is_approved: boolean,
        userId: string,
    ) => {
        if (processing.current) return;
        processing.current = true;
        approveUnapproveAsyncTicket(bookId, is_approved, userId, processing, setUsers);
    };

    const uploadImage = async (
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
        {...props}: UPLOAD_IMAGE
    ) => {
        let uploadData = new FormData();
        uploadData.append('image', props.image, props.image.name);
        
        if (processing.current) return;
        processing.current = true;

        const onSuccess = (res: AxiosResponse<any, any>) => {
            setNotifications((prev) => {
                return[...prev, {id: generateUid(), type:"success", message:"画像をアップロードしました。"}]}
            );    
            const filePath: string = "/api/v1/image?f=" + res.data.file_path;

        }
        const onError = (error: any) => {
            setNotifications((prev) => {
                return[ 
                    ...prev, 
                    {
                        id: generateUid(), 
                        type:"error", 
                        message: "画像のアップロードに失敗しました。"
                    }
                ]}
            );
        }
        const url = `/api/v1/book/image`;

        uploadAsyncImage(url, uploadData, processing, onSuccess, onError)
    };

    const deleteImage = async (
        user_id: string,
        setNotifications: (value: React.SetStateAction<ToastNotification[]>) => void,
    ) => {
        if (processing.current) return;
        processing.current = true;
        const onSuccess = (res: AxiosResponse<any, any>) => {
            setNotifications((prev) => {
                return [...prev, {id: generateUid(), type:"success", message:"画像の削除が完了しました。"}];
            });
        }
        const onError = (err: any) => {
            setNotifications((prev) => {
                return [...prev, {id: generateUid(), type:"error", message:"画像の削除に失敗しました。"}];
            })
        }
        const url = `/api/v1/book/image`;
        deleteAsyncImage(url, processing, onSuccess, onError)
    };

    useEffect(() => {
        if(book){
            book.title && setTitle(book.title);
            setIsPublic(book.is_public);
            book.overview && setOverview(book.overview);
            book.book_type && setBookType(book.book_type);
        }
    }, [book]);
    

    return {
        userNextPageLink,
        pages,
        pageNextPageLink,
        setPageNextPageLink,
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
        getUserVlides,
        getMoreVlides,
        getTicketUsers,
        getMoreTicketUsers,
        retrieveForDraft,
        setUnsetPage,
        changePageOrder,
        approveUnapprove,
        create,
        update,
        deleteBook,
        uploadImage,
        deleteImage,
        book,
        users,
    };
};