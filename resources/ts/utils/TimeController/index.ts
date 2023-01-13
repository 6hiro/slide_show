import { slideBlockRegExp, slideRegExp } from "../regexps";



export const convertToSeconds = function( durationTime:string ){ // 00:05:30 => 330
    // maxTime = ""
    const timeArray = durationTime.split(':');
    if(timeArray[3]) return 0;

    if(timeArray[1] && timeArray[2]){ // 00:05:30
        // 数字以外が入力された場合
        if( isNaN( Number(timeArray[0]) ) || isNaN( Number(timeArray[1]) ) || isNaN( Number(timeArray[2]) ) ) return 0; 

        const hours = 
            ( Number(timeArray[0]) > 2 ) ? 2*60*60 : Number(timeArray[0]) * 60 * 60;
        const minutes = 
            ( Number(timeArray[1]) >= 60 ) ? 59*60 : Number(timeArray[1]) * 60 ;
        const seconds = 
            ( Number(timeArray[2]) >= 60 ) ? 59 : Number(timeArray[2]);

        return hours + minutes + seconds;

    }else if( timeArray[1] && !timeArray[2]){ // 05:30
        if( isNaN( Number(timeArray[0]) ) || isNaN( Number(timeArray[1]) )  ) return 0;

        const minutes =
            ( Number(timeArray[0]) >= 60 ) ? 59*60 :  Number(timeArray[0]) * 60 ;
        const seconds = 
            ( Number(timeArray[1]) >= 60 ) ? 59 : Number(timeArray[1]);

        return minutes + seconds;

    }else if(!timeArray[1] && !timeArray[2]){ // 30
        if( isNaN( Number(timeArray[0]) ) ) return 0;

        const seconds = 
            ( Number(timeArray[0]) >= 60 ) ? 59 : Number(timeArray[0]);
            
        return seconds;
        
    }else{
        return 0;
    }
};

export const parser = (text:string) => {
    const slideArray = text?.match(slideBlockRegExp);
    
    const slides = slideArray?.map((slide, i) =>{
        const match = slide.match(slideRegExp);
        if(match){
            return { 
                type: match[1],
                content: match[2],
                time: match[3]
            };
        }else{
            return {
                type: "",
                content: "",
                time:""
            };
        }
    })
    return slides;
};

export function setTimeInDigitalFormat(durationTime :number) {
    let hours = Math.floor(durationTime / 3600);
    let minutes = Math.floor(durationTime / 60 % 60);
    let seconds = Math.floor(durationTime % 60);

    return `${hours ? hours+':' : ''}${minutes>=10 ? minutes : '0'+minutes}:${seconds>=10 ? seconds : '0'+seconds}`;
};