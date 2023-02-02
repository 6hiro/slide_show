import { BiX } from 'react-icons/bi';



type Props = {
    title: string;
    yesText: string;
    noText: string;
    action: Function;
    setIsShowedMenu: (nextValue?: any) => void;
};

const ConfirmationScreen = (props: Props) => {
    return (
        <div className='confirm_screen_container'>
            <div className="overlay"></div>
            <div className="confirm_screen">
                <div className="closeForm" onClick={props.setIsShowedMenu} ><BiX/></div>
                <div className="confirm_screen__title">{props.title}</div>
                <div className="confirm_screen__content">
                    <div onClick={() => {props.setIsShowedMenu(false)}} className="no_button">{props.noText}</div>
                    <div onClick={()=>{props.action()}} className="yes_button">{props.yesText}</div>
                </div>
            </div>
        </div>
    )
};

export default ConfirmationScreen