import { Dispatch, SetStateAction } from 'react';



type DurationPickerProps = {
    durationTime: number;
    setDurationTime: Dispatch<SetStateAction<number>>;
};

const DurationPicker = (props: DurationPickerProps) => {

    // const hourArray = [...Array(1)].map((_,i)=>i); // [0]
    const minuteArray = [...Array(21)].map((_,i)=>i); // [0, 1, 2, ... , 20]
    const secondArray = [...Array(60)].map((_,i)=>i); // [0, 1, 2, ... , 59]

    const maxTime = 1200; //  0 * 60 * 60 + 20 * 60 + 0

    return (
        <div className="timePicker">
            <select 
                className="timePicker_select" 
                name="" 
                id=""
                value={ Math.floor(props.durationTime / 60 % 60 ) }
                onChange={e => 
                    props.setDurationTime(
                        (prev) => { 
                            if( Number(e.target.value)*60 >= maxTime) return maxTime;
                            return prev - ( Math.floor(prev / 60 % 60) )* 60 + Number(e.target.value) * 60 ;
                        }
                    )
                }
            >
                 { minuteArray?.map((m, i) => (
                    <option key={i} value={m} >
                        {m>=10 ? m : '0'+m}
                    </option>
                ))}
            </select>

            <span className="separator">:</span>
            
            <select 
                className="timePicker_select" 
                name="" 
                id=""
                value={ props.durationTime % 60}
                onChange={e => 
                    props.setDurationTime(
                        (prev) => { 
                            return  prev - Math.floor(prev % 60) + Number(e.target.value);
                        }
                    )
                }
            >
                 { 
                    (props.durationTime >= maxTime) 
                        ?
                            <option key={0} value={0}>
                                00
                            </option>
                        :  
                            secondArray?.map((s, i) => (
                                <option key={i} value={s}>
                                    { (s >= 10) ? s : '0'+s }
                                </option>
                            ))
                }
            </select>

        </div>
    )
};

export default DurationPicker;