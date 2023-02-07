// https://github.com/taylorotwell/next-example-frontend/blob/master/src/hooks/auth.js
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from "../libs/axios";
import { ToastNotification } from '../types/toast';
import { generateUid } from '../utils/uid';



export const useAuth = (
    user: any, 
    error: unknown,
    isLoading: boolean,
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>,
    {middleware, redirectIfAuthenticated}: {middleware?: string, redirectIfAuthenticated?: any} = {}
) => {
    let navigate = useNavigate();

    const processing: React.MutableRefObject<boolean> = useRef<boolean>(false);

    // csrf
    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async (
        { setToastNotifications, ...props }: { 
            setToastNotifications: React.Dispatch<React.SetStateAction<ToastNotification[] | []>>, 
            props: string[]
        } 
    ) => {       
        if (processing.current) return;
        processing.current = true;

        await csrf();

        await axios
            .post('/register', props)
            .then((res) => {
                if(res.data.status === 'verification-link-sent') {
                    refetch();
                    navigate('/verification-link-sent');
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"success", message:"本登録のご案内のメールを送信しました"},
                        ];
                    });
                }else if(res.data.status === 'name.validation.unique') {
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"error", message:"このユーザー名は既に使われています。"},
                        ];
                    });
                }else if(res.data.status === 'email.validation.unique') {
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"error", message:"このメールアドレスは既に使われています。"},
                        ];
                    });
                }
            })
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;
                console.log(error.response.data.errors)
                if(error.response.data.errors?.email && error.response.data.errors.email[0] === "validation.unique" ) {
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"error", message:"このメールアドレスは既に使われています。"},
                        ];
                    });
                }else if(error.response.data.errors?.name  && error.response.data.errors.name[0] === "validation.unique" ) {
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"error", message:"このユーザー名は既に使われています。"},
                        ];
                    });
                }else{
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"error", message:"ユーザー登録に失敗しました"},
                        ];
                    });
                }


            })
            .finally(()=>{
                processing.current = false;
            });
    };

    // login
    const login = async (
        { setToastNotifications, email, password, remember }: { 
            setToastNotifications: React.Dispatch<React.SetStateAction<ToastNotification[] | []>>, 
            email: string, 
            password: string, 
            remember: boolean 
        }
    ) => {
        if (processing.current) return;
        processing.current = true;

        await csrf();

        // setToastNotifications([]);

        await axios
            .post('/login', {email, password, remember})
            .then((res) => {
                refetch();
                setToastNotifications(prev => {
                    return[
                        // ...prev,
                        {id: generateUid(), type:"info", message:"ようこそ、Vlides へ"},
                    ];
                });
                navigate('/');
            })
            .catch(error => {
                if (error.response.status != 422) throw error;
                // console.log(
                //     Object.keys(error.response.data.errors).map(val => error.response.data.errors[val])
                // )
                if(error.response.data.message === "auth.throttle") {
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"error", message:"ログイン試行の回数が上限を超えました。"},
                        ];
                    });
                }else{
                    setToastNotifications(prev => {
                        return[
                            ...prev,
                            {id: generateUid(), type:"error", message:"ログインに失敗しました。"},
                        ];
                    });
                }
            })
            .finally(()=>{
                processing.current = false;
            });
    };


    const forgotPassword = async(
        { setStatus, email }:{
            setStatus: Dispatch<SetStateAction<any>>,
            email: string
        }
    ) => {
        if (processing.current) return;
        processing.current = true;

        await csrf();

        setStatus(null);

        axios
            .post('/forgot-password', { email })
            .then((response: any) => {
                setStatus([response.data.status]);
            })
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;
            })
            .finally(()=>{
                processing.current = false;
            });
    }

    const resetPassword = async ({ ...props }: {
        email: string,
        password: string,
        password_confirmation: string,
        token: string,
    }) => {
        if (processing.current) return;
        processing.current = true;

        await csrf();

        axios
            .post('/reset-password', { ...props })
            // .post('/reset-password', { token: token, ...props })
            .then((response:any) => navigate('/auth/login?reset=' + btoa(response.data.status)))
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;
            })
            .finally(()=>{
                processing.current = false;
            });
    };

    const resendEmailVerification = ({ setStatus }: {setStatus: Dispatch<SetStateAction<any>>}) => {
        if (processing.current) return;
        processing.current = true;
        
        axios
            .post('/email/verification-notification')
            .then((response: any) => setStatus(response.data.status))
            .finally(()=>{
                processing.current = false;
            });
    }

    // logout
    const logout = async () => {
        if (processing.current) return;
        processing.current = true;

        if (!error) {
            await axios
                .post('/logout')
                .then(() => refetch())
                .catch((error: any) => {
                    if (error.response.status !== 401) {
                        refetch();
                        // navigate('/auth/login')
                    }
                })
                .finally(()=>{
                    processing.current = false;
                });
        };

        window.location.pathname = '/auth/login';
    };

    const deleteAccount = async () => {
        if (processing.current) return;
        processing.current = true;

        await axios
            .delete(`/api/v1/user`)
            .then(() => {
                // navigate("/auth/login");
                // logout();
                processing.current = false;
                refetch();
                window.location.pathname = '/auth/login';
                // navigate("/");
            });
            // .finally(()=>{
            //     processing.current = false;
            // });
    };

    const changeUserName = async (
            name: string,
            toggleEditForm: Dispatch<SetStateAction<boolean>>
        ) => {
        if (processing.current) return;
        processing.current = true;

        await axios
            .patch(`/api/v1/user`,{
                name: name
            })
            .then((res) => {
                refetch();
                toggleEditForm(false);
            })
            .finally(()=>{
                processing.current = false;
            });
    };

    const changePassword = async (
        new_password: string, 
        old_password: string,
        togglPasswordForm: Dispatch<SetStateAction<boolean>>
    ) => {
        if (processing.current) return;
        processing.current = true;

        await axios
            .patch(`/api/v1/user/change-password`, {
                new_password: new_password,
                old_password: old_password
            })
            .then((res) => {
                togglPasswordForm(false);
            })
            .finally(()=>{
                processing.current = false;
            });
    };

    // useEffect(() => {
    //     if (user || error) {
    //         // setIsLoading(false);
    //     }
    //     // if (middleware === 'guest' && redirectIfAuthenticated && user) navigate(redirectIfAuthenticated);
    //     // if (middleware === 'guest' && !redirectIfAuthenticated && user) navigate("/");

    //     if (window.location.pathname === "/verify-email" && user?.email_verified_at) navigate(redirectIfAuthenticated);
        
    //     if (middleware === 'auth' && error) logout();

    // }, [user, error]);
    
    
    return {
        user,
        error,
        refetch,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        isLoading,
        deleteAccount,
        changeUserName,
        changePassword
    }
};
