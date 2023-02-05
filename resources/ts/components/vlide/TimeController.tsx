import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef } from 'react';
import { BiLoaderAlt, BiPause, BiPlay, BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { IoEllipsisVertical, IoVolumeHigh, IoVolumeMute }  from "react-icons/io5";

import { setTimeInDigitalFormat } from '../../utils/TimeController';
import useAudio from '../../hooks/useAudio';
import useToggle from '../../hooks/useToggle';



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
const TimeController = memo(( props: TimeControllerProps) => {
    const controlsContainerRef = useRef<HTMLDivElement | null>(null);
    const watchedBarRef = useRef<HTMLDivElement | null>(null);
    const playHeadRef = useRef<HTMLDivElement | null>(null);
    const [on, toggle] = useToggle(false);
    const [isLoading, setIsLoading] = useToggle(props.src ? true: false);
    
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
        // const domMRect = controlsContainerRef?.current?.getBoundingClientRect()
        if(isScrubbingRef.current ){
            const progressBar = e.currentTarget;

            if(  !(progressBar instanceof HTMLElement) ) return;
            if( !(progressBar.offsetParent instanceof HTMLDivElement) ) return;


            const pos =  (e.clientX -progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
            // const pos =  (e.clientX -progressBar.getBoundingClientRect().left) / progressBar.getBoundingClientRect().width;
            // e.clientX: page内のmouse位置
            // progressBar.getBoundingClientRect().left: page 内の controlsContainerRefの左の位置 
            //      (https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect)
            // progressBar.offsetWidth: progressBar要素の幅
            // console.log(pos)

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
                    if(props.durationTime < prevCurrentTime + duration){ //over
                        return  props.durationTime;
                    }else if(prevCurrentTime < -duration){ // minus
                        return 0;
                    }else{
                        return prevCurrentTime + duration;
                    }
                });

            }
        , [props.durationTime]);

    const handleKeyDown =  (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
        const tagName = document.activeElement?.tagName.toLowerCase();

        if (tagName === "input" || tagName === "textarea") return;
      
        switch (e.key.toLowerCase()) {
            case "k":
                props.setIsRunning( (prev) => !prev);

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

            if(audioState.playbackRate > 0) { // audioState.playbackRate が0以下になることはないが、1000 / 0 にさせないため
                timerInterval = window.setInterval(() => {
                    if(src && !audioState.duration){ // AudioFileをまだロードできていない場合
                    }else{
                        props.setCurrentTime( prevCurrentTime => {
                            if(props.durationTime <= prevCurrentTime) return prevCurrentTime;
                            return prevCurrentTime+1;
                        });
                    }

                }, 1000 / audioState.playbackRate);
            }

        }else{
            audioControls.pause();
        }
        
        return () => {
            window.clearInterval(timerInterval); // クリーンアップ
        };
    }, [props.isRunning, audioState.playbackRate]); // 再生ボタンが押されたタイミング、再生速度が変更されたタイミング

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

    useEffect(() => { // AudioFileをまだロードできていなかった場合の、後処理（Audioを再生させる）
        if(audioState.duration) {
            if(props.isRunning){
                audioControls.play();
            }
            setIsLoading(false);
        }
    },[audioState.duration]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown );
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.durationTime, audioState.muted]);


    useEffect(() =>{
        document.addEventListener('mouseup', handleMouseUp);
        // document.addEventListener('mousemove', handleTimelineUpdate);
        // document.addEventListener('pointermove', handleTimelineUpdate);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            // document.removeEventListener('mousemove', handleTimelineUpdate);
            // document.removeEventListener('pointermove', handleTimelineUpdate);
          };
    }, []);

    return (
        <div 
            className="videoContainer" 
            id="videoContainer"
            onPointerUp={handleMouseUp}
        >
            {audio}
               
            <div 
                className="controlsContainer"
                 id="controlsContainer" 
                ref={controlsContainerRef} 
                onPointerMove={handleTimelineUpdate}

            >
                <div 
                    className="progressControls"
                    onPointerDown={(e) => {
                        isScrubbingRef.current = true;
                        	
                        // e.currentTarget.setPointerCapture(e.pointerId);

                        handleTimelineUpdate(e);
                    }}
                >
                    <div className="progressBar" id="progressBar">
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
                            <BiSkipPrevious size={30} />
                        </div>

                        <div 
                            className="btn"
                            id="playPauseBtn" 
                            draggable="false"
                            onClick={() => {
                                if(src && !audioState.duration){ // AudioFileをまだロードできていない場合
                                }else{
                                    if( props.timeStamps && !props.isRunning ){ // Playボタンをクリック時にスライドに移動
                                        let targetId = props.timeStamps.reverse().find(function(element){
                                            return element <= Math.floor(props.currentTime);
                                        });
                        
                                        if(targetId !== undefined && targetId >= 0){
                                            document.getElementById(String(targetId) + "s")?.scrollIntoView({ 
                                                behavior: 'smooth',
                                            });
                                        }
                                    }
                            
                                    props.setIsRunning(!props.isRunning)
                                }
                            }}
                        >
                            <div className="playPauseBtn" >
                                {
                                    !isLoading
                                    ?   !props.isRunning 
                                            ?  <BiPlay  
                                                    size={36}
                                                    className="play"
                                                    id="play" 
                                                />
                                            :  <BiPause 
                                                    size={36}
                                                    className="pause" 
                                                    id="pause" 
                                                />
                                    :  <BiLoaderAlt 
                                            size={20}
                                            className="loader_circle" 
                                            id="loader_circle" 
                                        />
                                }
                            </div>
                        </div>

                        <div 
                            className="btn"
                            onClick={ () =>{
                                audioControls.seek(props.currentTime+5);
                                skip(5) ;
                            }} 
                        >
                            <BiSkipNext size={30}/>
                        </div>

                        <div className="volumeControl">
                            {audioState.duration 
                                ? <div className="btn" id="volumeBtn" >
                                    { 
                                        !audioState.muted 
                                            ? <IoVolumeHigh
                                                    className="fullVolume" 
                                                    id="fullVolume" 
                                                    onClick={()=> {
                                                        audioControls.mute();
                                                    }}
                                                />
                                            : <IoVolumeMute
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
                        <div className={`playback_rate_container ${on ? "on" : null}`}>
                            <div 
                                className={`playback_rate_btn ${audioState.playbackRate===0.5 ? "active" : null}`}
                                onClick={()=>{
                                    audioControls.playbackRate(0.5)
                                    toggle(false)
                                }}
                            >x0.5</div>
                            <div 
                                className={`playback_rate_btn ${audioState.playbackRate===1 ? "active" : null}`}
                                onClick={()=>{
                                    audioControls.playbackRate(1)
                                    toggle(false)
                                }}
                            >x1</div>
                            <div 
                                className={`playback_rate_btn ${audioState.playbackRate===1.25 ? "active" : null}`}
                                onClick={()=>{
                                    audioControls.playbackRate(1.25)
                                    toggle(false)
                                }}
                            >x1.25</div>
                            {/* 1.5だとズレが生じる */}
                            <div 
                                className={`playback_rate_btn ${audioState.playbackRate===1.6 ? "active" : null}`}
                                onClick={()=>{
                                    audioControls.playbackRate(1.6)
                                    toggle(false)
                                }}
                            >x1.5</div>  
                            <div 
                                className={`playback_rate_btn ${audioState.playbackRate===2 ? "active" : null}`}
                                onClick={()=>{
                                    audioControls.playbackRate(2)
                                    toggle(false)
                                }}
                            >x2</div>
                        </div>
                        <div className="btn" onClick={toggle}>
                            <IoEllipsisVertical />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});

export default TimeController;