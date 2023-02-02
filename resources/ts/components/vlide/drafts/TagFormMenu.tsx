import React from 'react';
import { BiX } from 'react-icons/bi';

import TagForm from './TagForm';



type Props = {
    tagList: string[];
    setTagList: React.Dispatch<React.SetStateAction<string[]>>;
    setIsShowedTagFormMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const TagFormMenu = (props: Props) => {
    return (
        <div className="tag_form_menu_container">
            <div className="overlay" onClick={()=>props.setIsShowedTagFormMenu(false)}></div>

            <div className="tag_form_menu">
                <div className="close_form" onClick={()=>props.setIsShowedTagFormMenu(false)} ><BiX/></div>

                <div className="tag_form__wrapper">
                    <TagForm tagList={props.tagList} setTagList={props.setTagList} />
                </div>
             </div>
        </div>
    )
};

export default TagFormMenu;