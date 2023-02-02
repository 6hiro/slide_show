import { CONTENT_EDITOR_ACTIONS } from '../../../hooks/useContentEditor';
import useToggle from '../../../hooks/useToggle';
import { BLOCK_TYPE } from '../type';
import BlockTypeMenu from './BlockTypeMenu';



type Props = {
    id: string;
    time: number;
    setIsShowedMenu: (nextValue?: any) => void;
    changeType: CONTENT_EDITOR_ACTIONS["changeType"];
    deleteBlock: CONTENT_EDITOR_ACTIONS["deleteBlock"];
    blockType: string;
};

const InputMenu = (props: Props) => {

    const [isShowedBlockType, setIsShowedBlockType] = useToggle(false);
    const selectBlockType = (blockType: BLOCK_TYPE) => {
        props.changeType(props.id, blockType);
        setIsShowedBlockType(false);
        props.setIsShowedMenu(false);
    };
    const deleteBlock = (id: string) => {
        props.deleteBlock(id);
        props.setIsShowedMenu(false);
    }

    return (
        <div className="input_menu_container">
            <div className="overlay" onClick={()=>props.setIsShowedMenu(false)}></div>

            <div className="input_menu_form">
                {/* <div className="close_form" onClick={()=>props.setIsShowedMenu(false)} ><BiX/></div> */}
            
                <div className="input_menu">
                    <div 
                        className="input_menu__item" 
                        onClick={() => {deleteBlock(props.id)}}>
                        削除
                    </div>
                    {props.blockType!=="table"
                        ?   <div className="input_menu__item" onClick={setIsShowedBlockType}>
                                ブロックタイプを変更
                            </div>
                        : null
                    }

                </div>
                {isShowedBlockType 
                    ?   <BlockTypeMenu selectBlockType={selectBlockType} setIsShowedBlockType={setIsShowedBlockType} istBlockTypeChangeMenu={true} />
                    
                    :null
                }
            </div>

        </div>
    )
};

export default InputMenu;