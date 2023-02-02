// https://fkhadra.github.io/react-toastify/introduction/
import React, { useState } from 'react'
import { ToastNotification as TOAST } from '../../types/toast';
import ToastNotification from './ToastNotification';


type Props = {
    notifications: TOAST[] | [];
    setNotifications: React.Dispatch<React.SetStateAction<TOAST[] | []>>;
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