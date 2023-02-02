import { blockTypesJP } from '../../../constants/blockType';
import { BLOCK_TYPE } from '../type';



const BlockTypeItem = (
    {blockType, selectBlockType}:{blockType: BLOCK_TYPE; selectBlockType: Function;}
) => {
    return (
        <div 
            className="item" 
            onClick={()=>selectBlockType(blockType)}
        >
            {blockTypesJP[blockType]}
        </div>
    )
};

type Props = {
    setIsShowedBlockType: (nextValue?: any) => void;
    selectBlockType: (blockType: BLOCK_TYPE) => void;
    istBlockTypeChangeMenu: boolean
};
const BlockTypeMenu = (props: Props) => {
    const {setIsShowedBlockType, selectBlockType} = props;

    return (
        <>
        <div className='dropdown_block_type__overlay' onClick={setIsShowedBlockType}></div>
            <div className="dropdown_block_type" >
                <BlockTypeItem blockType={"text"} selectBlockType={selectBlockType} />
                <BlockTypeItem blockType={"h1"} selectBlockType={selectBlockType} />
                <BlockTypeItem blockType={"h2"} selectBlockType={selectBlockType} />
                <BlockTypeItem blockType={"toc"} selectBlockType={selectBlockType} />
                <BlockTypeItem blockType={"code"} selectBlockType={selectBlockType} />
                <BlockTypeItem blockType={"quote"} selectBlockType={selectBlockType} />
                {!props.istBlockTypeChangeMenu ? <BlockTypeItem blockType={"table"} selectBlockType={selectBlockType} /> : null}
                <BlockTypeItem blockType={"message"} selectBlockType={selectBlockType} />
                <BlockTypeItem blockType={"alert"} selectBlockType={selectBlockType} />
                <BlockTypeItem blockType={"hr"} selectBlockType={selectBlockType} />
                <BlockTypeItem blockType={"youtube"} selectBlockType={selectBlockType} />
            </div>
        </>
    )
};

export default BlockTypeMenu;