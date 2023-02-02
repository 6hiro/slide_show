import { AxiosResponse } from "axios";
import { NavigateFunction } from "react-router-dom";

import axios from "../libs/axios";
import { BOOK, NEW_BOOK, PAGE, TICKET_USER, UPDATE_BOOK } from "../types/book";
import { ToastNotification } from "../types/toast";
import { VLIDE } from "../types/vlide";
import { generateUid } from "../utils/uid";



export const retriveAsyncBook = async (
    bookId: string,
    setBook: React.Dispatch<React.SetStateAction<BOOK | undefined>>
) => {
    await axios
        .get(`/api/v1/book/${bookId}`)
            .then((res: AxiosResponse<any, any>) => {
                const data = res.data;
                setBook(data);
            });
};

export const retriveAsyncPage = async (
    bookId: string,
    vlideId: string,
    setPage: React.Dispatch<React.SetStateAction<VLIDE | undefined>>
) => {
    await axios
        .get(`/api/v1/book/${bookId}/page/${vlideId}`)
            .then((res: AxiosResponse<any, any>) => {
                const data = res.data;
                setPage(data);
            });
};

export const retriveAsyncForDraft = async (
    bookId: string,
    setBook: React.Dispatch<React.SetStateAction<BOOK | undefined>>
) => {
    await axios
        .get(`/api/v1/book/${bookId}/draft`)
            .then((res: AxiosResponse<any, any>) => {
                const data = res.data;
                setBook(data);
            });
};

export const setUnsetAsyncPage = async (
    bookId: string,
    vlideId: string,
    processing: React.MutableRefObject<boolean>,
    setBook: React.Dispatch<React.SetStateAction<BOOK | undefined>>,
    setPages: React.Dispatch<React.SetStateAction<PAGE[] | undefined>>,
    pages: PAGE[] | undefined
) => {
    await axios
        .put(`/api/v1/book/${bookId}/vlide/${vlideId}`)
            .then((res: AxiosResponse<any, any>) => {
                const data = res.data;
                if( res.data.result === "set" ) {
                    setPages(prev => {
                        if(prev) {
                            let newPages: PAGE[] = [...prev]
                            newPages =  newPages.map(page => {
                                if(page.id === vlideId) page.isPageOf = true;
                                return page;
                            })
                            return newPages;
                        }
                        return prev;
                    });
                    
                    pages && setBook(prev => {
                        if(prev) {
                            const newBook = Object.assign({}, prev);
                            const newPage = pages?.filter( (page) => page.id === vlideId)[0];
                            if(newPage) newBook.pages = [...newBook.pages, newPage];
                            return newBook;
                        }
                        return prev;
                    });

                }else if(res.data.result === "unset") {
                    setPages(prev => {
                        if(prev) {
                            let newPages: PAGE[] = [...prev]
                            newPages =  newPages.map(page => {
                                if(page.id === vlideId) page.isPageOf = false;
                                return page;
                            })
                            return newPages;
                        }
                        return prev;
                    });
                    setBook(prev => {
                        if(prev) {
                            const newBook = Object.assign({}, prev);
                            newBook.pages = newBook.pages.filter( (page) => page.id !== vlideId);
                            return newBook;
                        }
                        return prev;
                    });
                }

            })
            .finally(()=>{
                processing.current = false;
            });
};
export const changeOrderAsyncPage = async (
    bookId: string,
    pages: PAGE[]
) => {
    const data = {
        bookId: bookId,
        pages: pages
    };
    await axios.post(`/api/v1/book/change-order`, data);
        // .finally(()=>{
        //     processing.current = false;
        // });
};

export const createAsyncBook = async (
    props: NEW_BOOK,
    // setText: Dispatch<SetStateAction<string>>,
    navigate: NavigateFunction,
    processing: React.MutableRefObject<boolean>,
    setToastNotifications: React.Dispatch<React.SetStateAction<ToastNotification[] | []>>,
    toggleForm: (nextValue?: any) => void
) => {

    const url = "/api/v1/book";

    await axios
        .post(url, {
            title: props.title,
            is_public: false
        })
        .then((res:any) => {
            res.data.id && navigate(`/drafts/book/${res.data.id}`);
            toggleForm(false)
        })
        .catch((error:any) => {
            if(error.response.data.status === "over") {
                setToastNotifications(prev => {
                    return[
                        ...prev,
                        {id: generateUid(), type:"warning", message:"作成できるブック数を超えています"},
                    ];
                });
            }else{            
                setToastNotifications(prev => {
                    return[
                        ...prev,
                        {id: generateUid(), type:"warning", message:"ブックの作成に失敗しました"},
                    ];
                });
            }
            })
        .finally(() => {
            processing.current = false;
        });
};

export const updateAsyncBook = async (
    props: UPDATE_BOOK,
    processing: React.MutableRefObject<boolean>,
    navigate: NavigateFunction,
    setToastNotifications: React.Dispatch<React.SetStateAction<ToastNotification[] | []>>,
) => {
    axios
        .put(`/api/v1/book/${props.book_id}`, props)
        .then((res) => {
            setToastNotifications(prev => {
                return[
                    ...prev,
                    {id: generateUid(), type:"success", message:"Book を更新しました"},
                ];
            });

            if(props.is_public) {
                navigate(`/book/${props.book_id}`);
            }
        })
        .catch(error => {
            setToastNotifications(prev => {
                return[
                    ...prev,
                    {id: generateUid(), type:"error", message:"更新が失敗しました"},
                ];
            });
        })
        .finally(()=>{
            processing.current = false;
        });
};

export const deleteAsyncBook = async (
    bookId: string,
    userName: string,
    navigate: NavigateFunction,
) => {
    axios
        .delete(`/api/v1/book/${bookId}`)
        .then((res) => {
            navigate(`/prof/${userName}?f=books`);
        })
};

export const getUngetAsyncTicket = async (
    bookId: string,
    processing: React.MutableRefObject<boolean>,
    setBook: React.Dispatch<React.SetStateAction<BOOK | undefined>>,
) => {
    await axios
        .put(`/api/v1/book/${bookId}/ticket`)
        .then((res) => {
            setBook(prev => {
                if(prev) {
                    if(res.data.result === "get") {
                        const newBook = Object.assign({}, prev);
                        newBook.is_got = true;
                        newBook.count_tickets += 1;
                        return newBook;
                    }else if(res.data.result === "unget"){
                        const newBook = Object.assign({}, prev);
                        newBook.is_got = false;
                        newBook.count_tickets -= 1;
                        return newBook;
                    }else if(res.data.result === "unapproved"){
                        const newBook = Object.assign({}, prev);
                        newBook.is_got = true;
                        newBook.is_admitted = false;
                        return newBook;
                    }
                }
                return prev;
            });
        })
        .finally(()=>{
            processing.current = false;
        });
};

export const approveUnapproveAsyncTicket = async (
    bookId: string,
    is_approved: boolean,
    userId: string,
    processing: React.MutableRefObject<boolean>,
    setUsers: React.Dispatch<React.SetStateAction<TICKET_USER[] | undefined>>,
) => {
    await axios
        .put(`/api/v1/book/${bookId}/ticket/approve`, {is_approved: is_approved, user_id: userId})
        .then((res) => {
            setUsers(prev => {
                if(prev) {
                    // console.log(userId)
                    if(res.data.result === "approved") {
                        const newUsers = [...prev];

                        newUsers.map((user) => {
                            if(user.id === userId){
                                user.is_admitted = true;
                            }
                        });
                        return newUsers;
                    }else if(res.data.result === "unapproved"){
                        const newUsers = [...prev];

                        newUsers.map((user) => {
                            if(user.id === userId){
                                user.is_admitted = false;
                            }
                        });
                        return newUsers;
                    }
                }
                return prev;
            });
        })
        .finally(()=>{
            processing.current = false;
        });
};