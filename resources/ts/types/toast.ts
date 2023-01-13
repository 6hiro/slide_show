export type ToastNotification = {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
};

