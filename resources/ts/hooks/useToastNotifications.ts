import { createContext, useState } from "react";

// https://eight-bites.blog/2021/11/global-state-with-hooks/
type ToastNotification = {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
};

type ToastsContext = [
    toastNotifications: ToastNotification[],
    setNotifications: React.Dispatch<React.SetStateAction<ToastNotification[] | []>>
];
const defaultContext: ToastsContext = [
    [],
    () => {},
];

export const ToastNotificationsContext = createContext<ToastsContext>(defaultContext);

// custom Hook
export const useToastNotifications = () => {
    const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);

    return {
        toastNotifications: toastNotifications,
        setToastNotifications: setToastNotifications
    };
};