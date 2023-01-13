import { useEffect } from 'react'
import useAudio from '../../../hooks/useAudio';



type Props = {
    audio_file_name: string;
    isFirstRunning: boolean;
    isRunning: boolean;
    setIsRunning: Function;
    setIsLoading: Function;
};
const Audio = (props: Props) => {
    // PlayButton が初めて押されたタイミング( setIsRunning(true) ) で AudioFile をロードする
    // AudioFile はロード中は、setIsLoading(true) で、ロード画面を描写
    // audioState.duration がセットされたタイミングで isRunning===trueの場合、音源の再生を開始させる

    const { audio_file_name, isFirstRunning, isRunning, setIsRunning, setIsLoading } =props;
    const [audio, audioState, audioControls, audioRef] = useAudio({
        src: audio_file_name 
                ? audio_file_name  
                : "",
        autoPlay: false,
        loop:false,
        id: 'audio'
    });

    useEffect(() => {
        if(isRunning){ 
            if(audioState.duration) {
                audioControls.play();
            }else{ // AudioFileをまだロードできていない場合
                setIsLoading(true);
            }
        }else{
            audioControls.pause();
        }
    },[isRunning]);

    useEffect(() => {
        if(audioState.duration) {
            if(isRunning){
                audioControls.play();
            }
            setIsLoading(false);
        }
    },[audioState.duration]);
    
    
    return <>{audio}</>
    
};

export default Audio;