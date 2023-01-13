import { useEffect, useRef } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

import { delay } from '../../utils/delay';



type Props = {
    notification: {id: string, type:  "success" | "error" | "warning" | "info", message: string};
    deleteToastNotification: Function;
}

const ToastNotification = (props: Props) => {

    const toast = useRef<HTMLLIElement | null>(null);
    // const animationPlayStateRef = useRef<"running" | "paused">("running");
    // const [animationPlayState, setAnimationPlayState] = useState<"running" | "paused">("running");

    useEffect(() => {
        const hideTimer = setTimeout(async() => {
                toast.current?.classList.add("hide");
                await delay(300);
                props.deleteToastNotification(props.notification.id);
        }, 5000);

        return () => {
            clearTimeout(hideTimer);
        };

        // let hideTimerInterval: number | undefined;
        // let elapsedSec = 0;

        // if(animationPlayState === "running") {

        //     const hideTimerInterval = setInterval(async() => {
        //         console.log(animationPlayState)
        //         console.log(elapsedSec)

        //         elapsedSec++;

        //         if(elapsedSec >= 50 && animationPlayState==="running") {
        //             toast.current?.classList.add("hide");
        //             await delay(300);
        //             // props.deleteToastNotification(props.notification.id);
        //             if(toast.current) toast.current.style.display = "none";

        //             clearInterval(hideTimerInterval);
        //         }
        //     }, 100)
        // }else{

        // }
        
        // return () => {
        //     // clearTimeout(hideTimer);
        //     clearInterval(hideTimerInterval)
        // };
    }, []);


    return (
        <li 
            // className={`toast ${props.notification.type} ${animationPlayState==="paused" ? "toast_paused" : ""}`} 
            className={`toast ${props.notification.type}`} 
            ref={toast} 
            onClick={async() => {
                toast.current?.classList.add("hide");
                await delay(300)
                props.deleteToastNotification(props.notification.id);
            }}
            // onMouseEnter={()=> {
            //     setAnimationPlayState("paused");
            //     // animationPlayStateRef.current = "paused";
            // }}
            // onMouseLeave={()=> {
            //     setAnimationPlayState("running");
            //     // animationPlayStateRef.current = "running";
            // }}
        >
            <div className="column">
                <div className='column__icon_wrapper'>
                    {props.notification.type === "success"  ?<FaCheckCircle /> : null}
                    {props.notification.type === "error"  ?<FaExclamationCircle /> : null}
                    {props.notification.type === "warning"  ?<FaExclamationTriangle /> : null}
                    {props.notification.type === "info"  ?<FaInfoCircle /> : null}
                </div>

                <span>{props.notification.message}</span>
            </div>

            <div className="delete_icon_wrapper" >
                <FaTimes />
            </div>
        </li>
    )
};

export default ToastNotification;