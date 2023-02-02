import React, { useEffect } from 'react';
import { BiX } from 'react-icons/bi';

import { PAGE } from '../../types/book';
import GetMoreButton from '../layout/GetMoreButton';
import { VlideCard } from './VlideCard';



type Props = {
    bookId: string,
    userId: string,
    isShowedMenu: boolean;
    setIsShowedMenu: React.Dispatch<React.SetStateAction<boolean>>;
    getUserVlides: (userId: string, bookId: string) => void;
    getMoreVlides: () => void;
    pages: PAGE[] | undefined;
    // setPageNextPageLink: React.Dispatch<React.SetStateAction<string | undefined>>
    pageNextPageLink: string | undefined;
    setUnsetPage: (bookId: string, vlideId: string) => Promise<void>;
};

const NewPageMenu = (props: Props) => {
    useEffect(() => {
        if(props.userId && !props.pages) props.getUserVlides(props.userId, props.bookId);
    }, []);

    return (
        <div className='new_page_menu_container'>
            <div className={`${props.isShowedMenu ? "overlay" : ""}`} onClick={() =>props.setIsShowedMenu(false)}></div>
            {props.isShowedMenu 
                ?   <div className="new_page_menu" >
                    <div className="closeForm" onClick={() => props.setIsShowedMenu(false)} ><BiX/></div>
                        {/* <div className="new_page_menu__title">投稿一覧</div> */}
                        <div  className="new_page_menu__pages">
                            {props.pages?.map((page,i) =>{
                                return (
                                    <div key={i+"page"} className="add_page_wrapper">
                                        <VlideCard page={page} bookId={props.bookId} setUnsetPage={props.setUnsetPage} />
                                    </div>
                                )
                            })}

                            { ( props.pages && props.pageNextPageLink ) && 
                                <GetMoreButton nextPageLink={props.pageNextPageLink} gerMoreFunc={props.getMoreVlides} />
                            }   
                        </div>
                    </div>
                :null
            }
        </div>
    );
};

export default NewPageMenu;