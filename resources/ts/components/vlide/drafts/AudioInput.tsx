import React from 'react'
import { BiHeadphone, BiPlus } from 'react-icons/bi';

type Props = {
    isLoading: boolean;
    audioInputRef: React.MutableRefObject<HTMLInputElement | null>;
    handleEditAudio: Function;
    handleChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
};
const AudioInput = (props: Props) => {
  return (
    <div 
        className="add_audio_button" 
        onClick={() => {
            if(!props.isLoading) props.handleEditAudio();
        }}
    >
        
        {/* {props.isLoading 
            ? <Loader />
            : <> */}
                <BiPlus />
                <BiHeadphone />
            {/* </>
        } */}
        
        <input 
            type="file"
            id="audioInput"
            className="audioInput"
            ref={props.audioInputRef}
            // enctype="multipart/form-data"
            hidden 
            // accept="audio/*" 
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            // https://www.iana.org/assignments/media-types/media-types.xhtml#audio
            // https://webbibouroku.com/Blog/Article/html5-file-accept
            accept=".mp3,audio/aac" 
            // accept=".mpeg,.mpga,.mp3,.wav" 
            // accept="audio/*" 
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => props.handleChangeFile(e) } 
            // onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { 
            //     // handleChangeFile(e);
            //     if(e.target.files && e.target.files[0] ) {
            //         setAudio( e.target.files[0] );
            //         const fileUrl = URL?.createObjectURL( e.target.files[0]);
            //         setSrc(fileUrl);
            //     }
            // }} 

        />          
    </div>
  )
}

export default AudioInput