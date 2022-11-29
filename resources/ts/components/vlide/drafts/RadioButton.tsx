import React from 'react';

type Props = {
    isPublic: boolean;
    setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
};

const RadioButton = (props: Props) => {
  return (
    <div className="radio_button">
        {/* {state} */}
        <input 
            type="radio" name="state" id="dot-1" 
            checked={!props.isPublic} 
            onChange={() => props.setIsPublic(false)} 
        />
        <input 
            type="radio" name="state" id="dot-2" 
            checked={props.isPublic} 
            onChange={() => props.setIsPublic(true)}
        />

        <label 
            htmlFor="dot-1"
            // onClick={()=>setIsPublic("private")}
        >
            <span className={`dot ${!props.isPublic ? "checked" : ""}`}></span>
            <span className="">下書き</span>
        </label>
        <label 
            htmlFor="dot-2"
            // onClick={()=>setIsPublic("public")}
        >
            <span className={`dot ${props.isPublic ? "checked" : ""}`}></span>
            <span className="">公開</span>
        </label>
    </div>
  )
}

export default RadioButton;