import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react';
import { BiDotsVerticalRounded, BiPause, BiPlay, BiSkipNext, BiSkipPrevious, BiVolumeFull, BiVolumeMute } from 'react-icons/bi';
import { setTimeInDigitalFormat } from '../../../utils/TimeController';
import { useWindowSize } from '../../../hooks/useWindowSize';
import useAudio from '../../../hooks/useAudio';

type TimeControllerProps = {
    durationTime: number;
    currentTime: number;
    setCurrentTime: Dispatch<SetStateAction<number>>;
    src: string | null;
    isRunning: boolean;
    setIsRunning: Dispatch<SetStateAction<boolean>>;
    timeStamps: number[] | undefined;
}

// Time-Play
const TimeController = ( props: TimeControllerProps) => {
    const controlsContainerRef = useRef<HTMLDivElement | null>(null);
    const [width, _] = useWindowSize();

    useEffect(() => {
        if( controlsContainerRef.current instanceof HTMLElement ){
            const width  = window.innerWidth - 30;
            controlsContainerRef.current.style.width = width + 'px'
        }
    }, [width]);

    const watchedBarRef = useRef<HTMLDivElement | null>(null);
    const playHeadRef = useRef<HTMLDivElement | null>(null);
    
    const src = props.src;
    const [audio, audioState, audioControls, audioRef] = useAudio({
        src: src ? src : "",
        autoPlay: false,
        loop:false,
        id: 'audio'
    });
    
    useEffect(() => {
        // Audio の src を変えるたびに Audio と TimeController を止める。
        audioControls.pause();
        props.setIsRunning(false);
    },[src]);

    const isScrubbingRef = useRef<boolean>(false); // for Mouse Event

    // MouseDown Event, MouseMove Event, PointerMove Event, PointerDown Event
    function handleTimelineUpdate(e: React.MouseEvent<HTMLElement, MouseEvent> | MouseEvent){
        if(isScrubbingRef.current){
            const progressBar = e.currentTarget;
            // console.log(progressBar)
            if(  !(progressBar instanceof HTMLElement) ) return;
            if( !(progressBar.offsetParent instanceof HTMLDivElement) ) return;

            const pos = (e.pageX - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;

            let time;
            if(props.durationTime < pos * props.durationTime){ //over
                time = props.durationTime;
            }else if(0 > pos * props.durationTime){ // minus
                time = 0;
            }else{
                time = pos * props.durationTime;
            }

            audioControls.seek(time);
            props.setCurrentTime(time);
        }
    };

    function handleMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent) {
        if(isScrubbingRef){
            isScrubbingRef.current = false;
            handleTimelineUpdate(e);
        }
    };
       
    const skip =  
        useCallback(
            (duration: number) => {
                props.setCurrentTime( prevCurrentTime => {
                    // audioControls.seek(prevCurrentTime+duration);

                    if(props.durationTime < prevCurrentTime + duration){ //over
                        // console.log('over')
                        return  props.durationTime;
                    }else if(prevCurrentTime < -duration){ // minus
                        // console.log('minus')
                        return 0;
                    }else{
                        return prevCurrentTime + duration;
                    }
                });

            }
        , [props.durationTime]);

    // console.log(audioState.time)

    const handleKeyDown =  (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
        const tagName = document.activeElement?.tagName.toLowerCase();

        if (tagName === "input" || tagName === "textarea") return;
      
        switch (e.key.toLowerCase()) {
            case "k":
                props.setIsRunning( (prev) => !prev);
                // console.log(audioState.playing)

                if(audioState.playing){
                    audioControls.pause()
                }else{
                    if(src && !audioState.duration){ // AudioFileをまだロードできていない場合
                    }else{
                        audioControls.play()
                    }
                }
                break
            case "m":
                if(audioState.muted){
                    audioControls.unmute()
                }else{
                    audioControls.mute()
                }
                break
            // case "arrowleft":
            // case "j":
            //     skip(-5);
            //     break
            // case "arrowright":
            // case "l":
            //     skip(5);
            //     break
        }
    };
    

    useEffect(() => {
        // console.log("Play・Pauseが切り替わりました");
        let timerInterval: number | undefined;
        if ( props.isRunning ) {
            // console.log(props.currentTime)
            // console.log(props.durationTime)
            if( props.currentTime >= props.durationTime ){ // replay時
                audioControls.seek(0); // 再生時にcurrentTimeとaudioの時間を合わせる
                audioControls.play();
                props.setCurrentTime(0)
            }else{ // props.currentTime < props.durationTime
                if( props.currentTime < audioState.duration){
                    audioControls.seek(props.currentTime); // 再生時にcurrentTimeとaudioの時間を合わせる
                    audioControls.play();
                }
            }

            timerInterval = window.setInterval(() => {
                console.log("audioState.duration")
                console.log(audioState)

                if(src && !audioState.duration){ // AudioFileをまだロードできていない場合
                    console.log(audioState.duration)
                    props.setIsRunning(false);
                }else{
                    props.setCurrentTime( prevCurrentTime => {
                        // if(src && !audioState.duration){ // AudioFileをまだロードできていない場合
                        //     return prevCurrentTime
                        // }
                        if(props.durationTime <= prevCurrentTime) return prevCurrentTime;
                        return prevCurrentTime+1;
                    });
                }
            }, 1000);

        }else{
            audioControls.pause();
        }
        
        return () => {
            window.clearInterval(timerInterval); // クリーンアップ
        };
    }, [props.isRunning]);

    useEffect(() => {
        // console.log("タイムスタンプを時間に変換します");
        if( props.durationTime <= props.currentTime) {
            props.setIsRunning(false);
        }

        if( watchedBarRef.current && playHeadRef.current ){
            // change watched-bar and play-head
            const watched =  props.currentTime / props.durationTime * 100;
            watchedBarRef.current.style.width = watched + '%';
            playHeadRef.current.style.left = watched + '%';

            //currentTime変更時に音声の時間も変更すると、音がぷつぷつするので、
            // User Interactionのタイミングで変更する。
            // controls.seek(props.currentTime)

            if( props.timeStamps && props.isRunning ){ // isRunning
                let targetId = props.timeStamps.reverse().find(function(element){
                    return element <= Math.floor(props.currentTime);
                });

                if(targetId !== undefined && targetId >= 0){
                    document.getElementById(String(targetId) + "s")?.scrollIntoView({ 
                        behavior: 'smooth',
                        // block: "start",
                    });
                }
            }

            if(props.isRunning && props.currentTime < audioState.duration){
                // audio の duration を超えて音声が止まっている場合で、
                // time controller が再生中の場合、
                //  audio の duration内 に currentTime が来た場合音声を再生する処理
                audioControls.play();
            }
        }

    }, [props.currentTime]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown );
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.durationTime, audioState.muted]);

    useEffect(() =>{
        document.addEventListener('mouseup', handleMouseUp);
        // document?.addEventListener('mousemove', handleTimelineUpdate);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            // document.removeEventListener('mousemove', handleTimelineUpdate);
          };
    }, []);


    return (
        <div 
            className="videoContainer" 
            id="videoContainer"
            // onMouseUp={handleMouseUp}
            onPointerUp={handleMouseUp}
            // onMouseMove={handleTimelineUpdate}
            // onPointerMove={handlePointerMove}
        >
            {audio}
            {/* <pre style={{position:"fixed", bottom:"-400px"}}>{JSON.stringify(audioState, null, 2)}</pre> */}
               
            <div className="controlsContainer" id="controlsContainer" ref={controlsContainerRef} >
                <div className="progressControls" >
                    <div 
                        className="progressBar" 
                        id="progressBar"
                        // onMouseDown={(e) => {
                        //     isScrubbingRef.current = true;
                        //     handleTimelineUpdate(e);
                        // }}
                        // onMouseMove={handleTimelineUpdate}
                        onPointerDown={(e) => {
                            isScrubbingRef.current = true;
                            handleTimelineUpdate(e);
                        }}
                        onPointerMove={handleTimelineUpdate}
                    >
                        <div className="progress">
                            <div className="watchedProgress">
                                <div 
                                    className="watchedBar" 
                                    id="watchedBar"
                                    ref={watchedBarRef}
                                ></div>
                                <div 
                                    className="playhead"
                                    id="playhead"
                                    ref={playHeadRef}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="controls">
                    <div className="leftSideControls">
                        <div 
                            className="btn" 
                            onClick={ () =>{ 
                                audioControls.seek(props.currentTime-5);
                                skip(-5);
                            }} 
                        >
                            <BiSkipPrevious />
                        </div>

                        <div 
                            className="btn"
                            id="playPauseBtn" 
                            draggable="false"
                            onClick={() => {
                                if(src && !audioState.duration){ // AudioFileをまだロードできていない場合
                                }else{
                                    props.setIsRunning(!props.isRunning)
                                }
                            }}
                        >
                            {
                                !props.isRunning 
                                    ?  <BiPlay  
                                            className="play"
                                            id="play" 
                                            // }} 
                                        />
                                    :  <BiPause 
                                            className="pause" 
                                            id="pause" 
                                        />
                            }
                        </div>

                        <div 
                            className="btn"
                            onClick={ () =>{
                                audioControls.seek(props.currentTime+5);
                                skip(5) ;
                            }} 
                        >
                            <BiSkipNext />
                        </div>

                        <div className="volumeControl">
                            {audioState.duration 
                                ? <div className="btn" id="volumeBtn" >
                                    { 
                                        !audioState.muted 
                                            ?  <BiVolumeFull 
                                                    className="fullVolume" 
                                                    id="fullVolume" 
                                                    onClick={()=> {
                                                        audioControls.mute();
                                                    }}
                                                />
                                            :  <BiVolumeMute 
                                                    className="muted" 
                                                    id="muted" 
                                                    onClick={() => {
                                                        audioControls.unmute();
                                                    }}
                                                />
                                    }                               
                                    </div>
                                : null
                            }
                        </div>
                        <div className="timeDisplay">
                            <span className="currentTime" id="currentTime">
                                { setTimeInDigitalFormat(props.currentTime) }
                            </span>
                            <span className="timeSeparator">&nbsp;/&nbsp;</span>
                            <span className="videoDuration" id="videoDuration">
                                { setTimeInDigitalFormat(props.durationTime) }
                            </span>
                        </div>

                    </div>

                    <div className="rightSideControls">
                        <div className="btn">
                            <BiDotsVerticalRounded />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimeController;