import { ReactNode, useEffect, useRef, useState } from 'react';
import { BiMenu, BiPlus } from 'react-icons/bi';

import { CONTENT_EDITOR_ACTIONS } from '../../../hooks/useContentEditor';
import useToggle from '../../../hooks/useToggle';
import AddBlockMenu from './AddBlockMenu';
import InputMenu from './InputMenu';
import TimePicker from './TimePicker';



type Props = {
    id: string;
    time: number;
    actions: CONTENT_EDITOR_ACTIONS;
    InputElement: ReactNode;
    isFlex: boolean;
    blockType: string;
};

const InputContainer = (props: Props) => {
    const { id, InputElement, isFlex , actions}  = props;

    const [isShowedAddBlockMenu, setIsShowedAddBlockMenu] = useToggle(false);
    const [isShowedTimePicker, setIsShowedTimePicker] = useToggle(false);
    const [isShowedMenu, setIsShowedMenu] = useToggle(false);

    const [time, setTime] = useState<number>(props.time);
    const isFirstRef = useRef<boolean>(true);

    useEffect(() => {
        if(isFirstRef.current) {
            isFirstRef.current = false;
            return;
        }else{
            props.actions.changeTime(id, time);
            document.getElementById(id+"-input")?.scrollIntoView({ 
                behavior: 'smooth',
            });
        }
    }, [time]);

    return (
        <div className="input_wrapper" id={`${id}-input`} style={{scrollMarginTop: (!isFlex) ? "110px" : "70px"}}>
            <div className="element_options">
                <span className="option" onClick={setIsShowedAddBlockMenu}><BiPlus/></span>
                <div className="option" onClick={setIsShowedMenu}><BiMenu/></div>  

                <div className="element_time" onClick={setIsShowedTimePicker}>
                    <div className="time_setting">
                        { Math.floor(time / 60 % 60 ) }
                        <span className="separator">:</span>
                        { (time % 60) >=10 ? (time % 60) : '0'+(time % 60)}
                    </div>
                </div>  

            </div>
            <div className="input_element" >
                {InputElement}
            </div>
            {isShowedAddBlockMenu ? <AddBlockMenu actions={props.actions} setIsShowedAddBlockMenu={setIsShowedAddBlockMenu} /> : null}
            {isShowedMenu  ? <InputMenu 
                                    time={time} 
                                    setIsShowedMenu={setIsShowedMenu} 
                                    id={props.id} 
                                    changeType={actions["changeType"]} 
                                    deleteBlock={actions["deleteBlock"]} 
                                    blockType={props.blockType}
                                    
                                /> 
                            : null}


            {isShowedTimePicker  ? <TimePicker time={time} setTime={setTime} setIsShowedTimePicker={setIsShowedTimePicker} /> : null}
        </div>
    );
};

export default InputContainer;