import React from 'react'
import { BiHeadphone } from 'react-icons/bi';



type Props = {
    setIsShowedAudioMenu: React.Dispatch<React.SetStateAction<boolean>>;

};

const AudioInput = (props: Props) => {
  return (
    <div 
        className="audio_action_button" 
        onClick={()=> props.setIsShowedAudioMenu(true)}
    >
        <BiHeadphone />
    </div>
  )
}

export default AudioInput