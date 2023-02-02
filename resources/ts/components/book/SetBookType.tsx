import React from 'react'
import { BiCaretDown } from 'react-icons/bi';
import useToggle from '../../hooks/useToggle';

type Props = {
    bookType: string;
    setBookType: React.Dispatch<React.SetStateAction<string>>
};

const SetBookType = (props: Props) => {
    // console.log(props.bookType)
    const [isShowedMenu, setIsShowedMenu] = useToggle(false);

    return (
        <div className="set_book_type_container">

            <div onClick={setIsShowedMenu} className="select_button">
                <BiCaretDown />
                {props.bookType === "default" && "すべてのユーザー"}
                {props.bookType === "protected" && "許可したユーザー"}
            </div>

            {isShowedMenu
                ?   <div className="book_type__menu">
                        {/* <div>公開範囲</div> */}
                        <div 
                            className="book_type__menu__option"
                            onClick={()=>{
                                props.setBookType('default');
                                setIsShowedMenu(false);
                            }} 
                        >すべてのユーザー</div>
                        <div 
                            className="book_type__menu__option"
                            onClick={()=>{
                                props.setBookType('protected');
                                setIsShowedMenu(false);
                            }} 
                        >許可したユーザー</div>
                    </div>
                :   null            
            }

            
        </div>
    )
};

export default SetBookType;