import React from 'react';



type Props = {
    isPublic: boolean;
    setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
};

const RadioButton = (props: Props) => {
  return (
    <div className="radio_button">
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

        <label htmlFor="dot-1">
            <span className={`dot ${!props.isPublic ? "checked" : ""}`}></span>
            <span className="">非公開</span>
        </label>
        <label htmlFor="dot-2">
            <span className={`dot ${props.isPublic ? "checked" : ""}`}></span>
            <span className="">公開</span>
        </label>
    </div>
  )
}

export default RadioButton;