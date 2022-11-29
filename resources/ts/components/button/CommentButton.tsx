import React from 'react';
import { BiComment } from 'react-icons/bi';

const CommentButton: React.FC = () => {

    return (
        <form 
            className="dots_button"
            // onClick={() => {}}
        >
            <BiComment /> 
        </form>
    )
};

export default CommentButton;