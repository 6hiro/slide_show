import React from 'react'
import { Link } from 'react-router-dom';

import { VLIDE } from '../../../types/vlide';


type Props = {
    loginId: string | null;
    vlide: VLIDE;
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>; 
    showDelete: boolean;
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
    deleteVlide: Function;
};
const VlideMenu = (props: Props) => {
    const {
        loginId,
        vlide,
        showMenu, 
        setShowMenu, 
        showDelete,
        setShowDelete, 
        deleteVlide,
    } = props;

    return (
        <div className="vlide_menu__container">
            <div 
                className={`${showMenu ? "overlay" : ""}`}  
                onClick={() => {
                    setShowMenu(!showMenu)
                }}
            ></div>
            <ul className={`vlide__menu ${showMenu ? "show_menu" : ""}`}>
                {(loginId === vlide.user.id)
                    ? <>
                        <li>
                            <Link to={`/drafts/vlide/${vlide.id}`}>
                                <div>
                                    投稿を編集
                                </div>
                            </Link>
                        </li>
                        <li 
                            onClick={() => {
                                setShowMenu(false);
                                setShowDelete(!showDelete);
                            }}
                        >
                            投稿を削除
                        </li>
                    </>
                    : null
                }
                <li>
                    クリップ数：{Number(vlide.count_clips).toLocaleString()}
                </li>
                <li>
                    保存数：{Number(vlide.count_saves).toLocaleString()}
                </li>
            </ul>
            
            {/* 削除画面 */}
            <div className={`${showDelete ? `overlay delete_overlay` : ""}`}  onClick={() => {setShowDelete(!showDelete)}}></div>
            <div className={`vlide__delete ${showDelete ? "show_delete" : ""}`}>
                <p>
                    本当に
                    <span className='vlide__delete__content'>
                        {vlide.title.slice(0, 20)}
                        {vlide.title.length > 20 && <span>...</span>}
                    </span>

                    を削除してもよろしいですか？
                </p>
                <div className="selects">
                    <div className="no" onClick={() => {setShowDelete(!showDelete)}}>
                        キャンセル 
                    </div>
                    <div 
                        className="yes" 
                        onClick={() => { 
                            deleteVlide();
                        }}>
                        削除
                    </div>
                </div>
            </div>
        </div>
    )
};

export default VlideMenu;