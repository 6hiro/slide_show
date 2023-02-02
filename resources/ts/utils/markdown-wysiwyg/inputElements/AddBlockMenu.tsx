import { useState } from 'react';
import { BiX } from 'react-icons/bi';

import { blockTypesJP } from '../../../constants/blockType';
import { CONTENT_EDITOR_ACTIONS } from '../../../hooks/useContentEditor';
import useToggle from '../../../hooks/useToggle';
import TimePicker from './TimePicker';
import {BLOCK_TYPE} from '../type';
import BlockTypeMenu from './BlockTypeMenu';
import { generateUid } from '../../uid';



type Props = {
    actions: CONTENT_EDITOR_ACTIONS;
    setIsShowedAddBlockMenu: (nextValue?: any) => void;
};

const AddBlockMenu = (props: Props) => {

    const [isShowedBlockType, setIsShowedBlockType] = useToggle(false);
    const [isShowedTimePicker, setIsShowedTimePicker] = useToggle(false);
    const [time, setTime] = useState(0);
    const [blockType, setBlockType] = useState<BLOCK_TYPE>("text");
    // const [newBlockId, setNewBlockId]= useState<string>("");

    const selectBlockType = (blockType: BLOCK_TYPE) => {
        setBlockType(blockType);
        setIsShowedBlockType(false);
        // props.setIsShowedAddBlockMenu(false);
    };
    const addNewBlock = () => {
        const id = generateUid();
        // setNewBlockId(id);
        const content = (blockType === "table") ? ":-|:-\n|\n|" : ""
        props.actions.addBlock(id, blockType, content, time);
        props.setIsShowedAddBlockMenu(false);
    }
    // ブロック追加時にそのブロックに移動
    // useEffect(() => {
    //     console.log(newBlockId)
    //     if(newBlockId) {
    //         document.getElementById(newBlockId+"-input")?.scrollIntoView({ 
    //             behavior: 'smooth',
    //         });
    //         // setNewBlockId(null);
    //     }
    // }, [newBlockId])

    return (
        <div className="add_block_menu_container">
            <div className="overlay" onClick={()=>props.setIsShowedAddBlockMenu(false)}></div>

            <div className="add_block_menu_form">
                <div className="close_form" onClick={()=>props.setIsShowedAddBlockMenu(false)} ><BiX/></div>
            
                <div className="add_block_menu">

                    <div 
                        className="add_block_menu__item" 
                        onClick={() => {
                            setIsShowedBlockType(false);
                            setIsShowedTimePicker(true);
                        }}
                    >
                        <div className="time_setting">
                            { Math.floor(time / 60 % 60 ) }
                            <span className="separator">:</span>
                            { (time % 60) >=10 ? (time % 60) : '0'+(time % 60)}
                        </div>
                    </div>  
                    <div 
                        className="add_block_menu__item" 
                        onClick={() => {
                            setIsShowedBlockType(true);
                            setIsShowedTimePicker(false);
                        }}
                    >
                        {blockTypesJP[blockType]}
                    </div>
                    
                    <button className="add_block_btn" onClick={addNewBlock}>   
                        ブロックを追加
                    </button>
                </div>

                {isShowedBlockType 
                    ?   <BlockTypeMenu selectBlockType={selectBlockType} setIsShowedBlockType={setIsShowedBlockType} istBlockTypeChangeMenu={false} />
                    :null
                }

                {isShowedTimePicker  ? <TimePicker time={time} setTime={setTime} setIsShowedTimePicker={setIsShowedTimePicker} /> : null}

            </div>

        </div>
    )
};

export default AddBlockMenu;