import React, { useEffect, useRef } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

import { useWindowSize } from '../../hooks/useWindowSize';
import { generateUid } from '../../utils/uid';
import { ToastNotification } from '../toastNotification/ToastNotifications';



type Props = {
    loginId: string | undefined;
    section: string | undefined;
    changeSection: Function;
    isOwnProfile: boolean;
    setToastNotifications: React.Dispatch<React.SetStateAction<[] | ToastNotification[]>>
};
const DraggableTabs = (props: Props) => {
    const { section, changeSection, isOwnProfile, loginId, setToastNotifications } = props;
    const chevronLeftRef =  useRef<HTMLDivElement | null>(null);
    const chevronRightRef =  useRef<HTMLDivElement | null>(null);
    const tabsBoxRef = useRef<HTMLUListElement | null>(null);
    const isScrubbingRef = useRef<boolean>(false); // for Mouse Event

    const dragging = ( e: React.MouseEvent<HTMLUListElement, MouseEvent> ) => {
        if(tabsBoxRef.current) {
            tabsBoxRef.current.classList.add("dragging");
            tabsBoxRef.current.scrollLeft -= e.movementX;
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, scrolLeft: number ) => {
        if(tabsBoxRef.current) {
            tabsBoxRef.current.scrollLeft += scrolLeft;
        }
    }


    const handleMouseDown = ( e: React.MouseEvent<HTMLUListElement, MouseEvent> | MouseEvent) => {
        isScrubbingRef.current = true;
    }

    const handleMouseUp = ( e: React.MouseEvent<HTMLUListElement, MouseEvent> | MouseEvent) => {
        isScrubbingRef.current = false;
        if(tabsBoxRef.current) {
            tabsBoxRef.current.classList.remove("dragging");
        }
    }

    useEffect(() =>{
        document.addEventListener('pointerup', handleMouseUp);
        return () => {
            document.removeEventListener('pointerup', handleMouseUp);
          };
    }, []);

    const [width, _] = useWindowSize();
    useEffect(() => {
        if(tabsBoxRef.current) {
            // console.log( tabsBoxRef.current.scrollLeft)

            let maxScrollableWidth = tabsBoxRef.current.scrollWidth - tabsBoxRef.current.clientWidth;

            // console.log(maxScrollableWidth)
            if(maxScrollableWidth) { // scroll できる範囲がある場合
                // if(!tabsBoxRef.current.scrollLeft) { // 
                    chevronLeftRef.current?.classList.remove('unshow');
                // }
                chevronRightRef.current?.classList.remove('unshow');
            }else{
                chevronLeftRef.current?.classList.add('unshow');
                chevronRightRef.current?.classList.add('unshow');
            }
        }
    }, [width]);

    const alertNeedLogin = (message: string) => {
        setToastNotifications(prev => {
            return[
                {id: generateUid(), type:"warning", message:message},
            ];
        });
    }

    return (
        <div className="draggble_tabs_container">
            <div 
                className="chevron_icon"
                onClick={(e) => {handleClick(e, -200)}}
                ref={chevronLeftRef}
            >
                <BiChevronLeft />
            </div>
            <ul 
                className='tabs_box'
                ref={tabsBoxRef}
                onPointerMove={(e) => {
                    if(isScrubbingRef.current) {
                        dragging(e);
                    }
                }}
                onPointerDown={handleMouseDown}
                onPointerUp={handleMouseUp}
            >
                <li 
                    className={`tab ${section==='vlides' ? "active_tab" : ""}`}
                    onClick={() => changeSection('vlides')}
                >
                    投稿
                </li>
                {/* <li className="tab" onClick={() => changeSection('books')}>
                    ブック
                </li> */}
                <li 
                    className={`tab ${section==='clips' ? "active_tab" : ""}`}
                    onClick={() => changeSection('clips')}
                >
                    クリップ
                </li>
                <li 
                    className={`tab ${section==='replies' ? "active_tab" : ""}`}
                    onClick={() => changeSection('replies')}
                >
                    返信
                </li>
                <li 
                    className={`tab ${section==='images' ? "active_tab" : ""}`}
                    onClick={() => loginId ? changeSection('images') : alertNeedLogin("画像を表示するにはログインが必要です")}
                >
                    ギャラリー
                </li>
                {isOwnProfile ?
                <li 
                    className={`tab ${section==='bookmarks' ? "active_tab" : ""}`}
                    onClick={() => changeSection('bookmarks')}
                >
                    保存
                </li>
                : null}
                <li 
                    className={`tab ${section==='likes' ? "active_tab" : ""}`}
                    onClick={() => loginId ? changeSection('likes') : alertNeedLogin("いいねを表示するにはログインが必要です")}
                >
                    いいね
                </li>
            </ul>
            <div 
                className="chevron_icon"
                onClick={(e) => {handleClick(e, 200)}}
                ref={chevronRightRef}
            >
                <BiChevronRight />
            </div>
        </div>
    )
};

export default DraggableTabs;