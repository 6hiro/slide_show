// https://fkhadra.github.io/react-toastify/introduction/
import React, { useState } from 'react'
import ToastNotification from './ToastNotification';


export type ToastNotification = {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
};

type Props = {
    notifications: ToastNotification[] | [];
    setNotifications: React.Dispatch<React.SetStateAction<ToastNotification[] | []>>;
};

const ToastNotifications = (props: Props) => {

    const deleteToast = async(toast_id: string) => {
        props.setNotifications(prev => prev.filter(toast => toast.id !== toast_id))
    }
    if(!props.notifications.length) return null;
    
    return (
        <ul className="toast_notifications">
            {props.notifications.map((notification, i) => 
                <ToastNotification  
                    key={notification.id} 
                    notification={notification} 
                    deleteToastNotification={deleteToast}
                />
            )}
        </ul>
    )
};

export default ToastNotifications;