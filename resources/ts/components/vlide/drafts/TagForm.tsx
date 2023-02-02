import React, { useState } from 'react';
import { BiMessageError, BiX } from 'react-icons/bi';



type Props ={ 
    tagList: string[];
    setTagList: React.Dispatch<React.SetStateAction<string[]>>
};
const TagForm = (props: Props) => {
    const [newTagName, setNewTagName] = useState<string>("");

    const addTag = () => {
        // 一つのもしくは、連続する全角空白・半角空白を削除する
        let tag = newTagName.replace(/\s+/g, '');
        // 両端の空白を削除
        // tag = tag.replace(/(^\s+)|(\s+$)/g, "");

        if(tag.length && !props.tagList.includes(tag)){
            if(props.tagList.length < 4){
                props.setTagList([...props.tagList, tag]);
            }
        }
        setNewTagName("");
    };

    const deleteTag = (deleteTagName:string) => {
        props.setTagList( props.tagList.filter((tag)=> tag !== deleteTagName) );
    };

    return (
        <ul className="tag_form">
            <li>
                <input 
                    type="text" 
                    className="field"
                    value={newTagName}
                    placeholder="新しいタグ ( 4 つまで )"
                    maxLength={20}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={
                        (e: React.KeyboardEvent<HTMLInputElement>) => {
                            if(e.key===' ' || e.key==='　'){
                                addTag();
                                e.preventDefault();
                            }
                            if(!e.nativeEvent.isComposing && e.key == "Enter"){
                                addTag();
                                e.preventDefault();
                            }
                        }
                    }
                />
                <div className="rule" >
                    <BiMessageError />
                    <span> 入力後、Space もしくは、Enter を押すとタグを追加できます</span>
                </div>
            </li>

            <ul className="tag_list">
                {props.tagList.map((tag, index) => {
                    return (
                        <li key={index} className="tag" >
                            <div 
                                onClick={() => {
                                    deleteTag(tag);
                                }}
                                className="delete_button"
                            >
                                <BiX />
                            </div>
                            
                            <div>
                                {tag} 
                            </div>
                        </li>
                    )
                })}
            </ul>
        </ul>
    )
};

export default TagForm;