import { Dispatch, SetStateAction } from 'react'
import { BiX } from 'react-icons/bi';
import useToggle from '../../../hooks/useToggle';

type Props = {
    time: number;
    setTime: Dispatch<SetStateAction<number>>;
    setIsShowedTimePicker: (nextValue?: any) => void;
};

const TimePicker = (props: Props) => {
    // const hourArray = [...Array(1)].map((_,i)=>i); // [0]
    const minuteArray = [...Array(21)].map((_,i)=>i); // [0, 1, 2, ... , 20]
    const secondArray = [...Array(60)].map((_,i)=>i); // [0, 1, 2, ... , 59]

    const maxTime = 1200; //  0 * 60 * 60 + 20 * 60 + 0
    const [isShowedMinuteMenu, setIsShowedMinuteMenu] = useToggle(false);
    const [isShowedSecondMenu, setIsShowedSecondMenu] = useToggle(false);

    return (
        <div className="time_picker_container">
            <div className="overlay" onClick={()=>props.setIsShowedTimePicker(false)}></div>

            <div className="time_picker_form">
                <div className="close_form" onClick={()=>props.setIsShowedTimePicker(false)} ><BiX/></div>

                <div className="time_picker">
                    <div 
                        className="min" 
                        onClick={() => {
                            setIsShowedSecondMenu(false);
                            setIsShowedMinuteMenu(true);
                        }}
                    >
                        { Math.floor(props.time / 60 % 60 ) }
                    </div>           
                    <div className="separator">:</div>
                    <div 
                        className="sec"
                        onClick={() => {
                            setIsShowedMinuteMenu(false);
                            setIsShowedSecondMenu(true);
                        }}
                    >
                        { (props.time % 60) >=10 ? (props.time % 60) : '0'+(props.time % 60)}
                    </div>
                </div>

                
                {isShowedMinuteMenu
                    ?
                        <div className="dropdown dropdown__min" >
                            { minuteArray?.map((m, i) => (
                                <div 
                                    className={`item ${Math.floor(props.time / 60 % 60 )===m ? "active_item" : ""}`}
                                    key={i} 
                                    onClick={()=>{
                                        setIsShowedMinuteMenu(false);
                                        props.setTime(
                                            (prev) => { 
                                                if( Number(m)*60 >= maxTime) return maxTime;
                                                return prev - ( Math.floor(prev / 60 % 60) )* 60 + Number(m) * 60 ;
                                            }
                                        )
                                    }}
                                >
                                    { (m >= 10) ? m : '0'+m }
                                </div>
                            ))}
                        </div>
                    : null
                }

                {isShowedSecondMenu
                    ?
                        <div className="dropdown dropdown__sec"  >
                            {(props.time >= maxTime) 
                                ? 
                                    <div 
                                        className={`item ${(props.time % 60)===0 ? "active_item" : ""}`}
                                        key={0} 
                                        onClick={()=>{
                                            props.setTime(maxTime);
                                            setIsShowedSecondMenu(false);
                                        }}
                                    >00</div>
                            
                                : <>
                                    { secondArray?.map((s, i) => (
                                        <div 
                                            className={`item ${(props.time % 60)===s ? "active_item" : ""}`}
                                            key={i} 
                                            onClick={()=>{
                                                props.setTime(
                                                    (prev) => { 
                                                        return  prev - Math.floor(prev % 60) + Number(s);
                                                    }
                                                )
                                                setIsShowedSecondMenu(false);
                                            }}
                                        >
                                            { (s >= 10) ? s : '0'+s }
                                        </div>
                                    ))}
                                </>
                            }
                        </div>
                    : null
                }
            </div>

        </div>
    )
};

export default TimePicker;