// https://github.com/taylorotwell/next-example-frontend/blob/master/src/hooks/auth.js
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from "../libs/axios";
import { useQueryUser } from './useQueryUser'

export const useAuth = (
    {middleware, redirectIfAuthenticated}: {middleware?: string, redirectIfAuthenticated?: any} = {}
) => {
    let navigate = useNavigate();
    
    const search = useLocation().search;

    // user
    const { data:user, error, isLoading, refetch } = useQueryUser();

    // csrf
    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async (
        { setErrors, ...props }: { setErrors: Dispatch<SetStateAction<any>> , props: string[]} 
    ) => {       
        await csrf();

        setErrors([]);
        
        await axios
            .post('/register', props)
            .then(() => {
                refetch();
                navigate('/verification-link-sent');
            })
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };

    // login
    const login = async (
        { setErrors, email, password, remember }: { setErrors: Dispatch<SetStateAction<any>>, email: string, password: string, remember: boolean }
    ) => {
        await csrf();

        setErrors([]);

        await axios
            .post('/login', {email, password, remember})
            .then((res) => {
                refetch();
                navigate('/');
            })
            .catch(error => {
                if (error.response.status != 422) throw error;

                setErrors(
                    Object.keys(error.response.data.errors).map(val => error.response.data.errors[val])
                );

            });
    };


    const forgotPassword = async (
        { setErrors, setStatus, email }:{
            setErrors: Dispatch<SetStateAction<any>>, 
            setStatus: Dispatch<SetStateAction<any>>,
            email: string
        }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        axios
            .post('/forgot-password', { email })
            .then((response: any) => setStatus(response.data.status))
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };

    const resetPassword = async ({ setErrors, setStatus, ...props }: {
        setErrors: Dispatch<SetStateAction<any>>, 
        setStatus: Dispatch<SetStateAction<any>>,
        props: any[]
    }) => {
        await csrf();

        setErrors([]);
        setStatus(null);
        const token = new URLSearchParams(search).get('token');

        axios
            .post('/reset-password', { token: token, ...props })
            .then((response:any) => navigate('/login?reset=' + btoa(response.data.status)))
            .catch((error: any) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };

    const resendEmailVerification = ({ setStatus }: {setStatus: Dispatch<SetStateAction<any>>}) => {
        axios
            .post('/email/verification-notification')
            .then((response: any) => setStatus(response.data.status))
    }

    // logout
    const logout = async () => {
        if (!error) {
            await axios
                .post('/logout')
                .then(() => refetch())
                .catch((error: any) => {
                    if (error.response.status !== 401) {
                        refetch();
                        // navigate('/auth/login')
                    }
                });
        };

        window.location.pathname = '/auth/login';
    };

    const deleteAccount = async () => {
        await axios
            .delete(`/api/v1/user`)
            .then(() => {
                // navigate("/auth/login");
                // logout();
                // navigate("/about");
                // refetch();
            });
    };

    const changeUserName = async (
            name: string,
            toggleEditForm: Dispatch<SetStateAction<boolean>>
        ) => {
        await axios
            .patch(`/api/v1/user`,{
                name: name
            })
            .then((res) => {
                refetch();
                toggleEditForm(false);
            });
    };

    const changePassword = async (
        new_password: string, 
        old_password: string,
        togglPasswordForm: Dispatch<SetStateAction<boolean>>
    ) => {
        await axios
            .patch(`/api/v1/user/change-password`, {
                new_password: new_password,
                old_password: old_password
            })
            .then((res) => {
                togglPasswordForm(false);
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
