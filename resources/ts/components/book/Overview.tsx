import React from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize';



type Props = {
    overview: string;
    setOverview: React.Dispatch<React.SetStateAction<string>>
};

const Overview = (props: Props) => {
    const maxLength = 400;
    return (
        <div className="overview_textarea_container">
            <ReactTextareaAutosize 
                id="overview"
                className="overview_textarea"
                autoComplete="off" 
                spellCheck="false"
                name="overview" 
                value={props.overview} 
                onChange={(e) => {
                    props.setOverview(e.target.value)
                }}
                placeholder="概要"
                autoFocus={false} 
            />
            <div className="text_count" >
                {props.overview.length} / {maxLength}
            </div>
        </div>
    )
};

export default Overview;