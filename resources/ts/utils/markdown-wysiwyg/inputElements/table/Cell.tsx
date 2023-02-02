import { useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { BiDotsHorizontalRounded } from 'react-icons/bi';

import { DecoratedTextInput } from '../../markdown/Render';
import useToggle from '../../../../hooks/useToggle';
import { rowSeparator } from './constants';
import { TABLE_CELL } from './type';
import { TABLE_ACTIONS } from '../../../../hooks/useTable';



type Props = {
    data: TABLE_CELL;
    index: number;
    rowIndex: number;
    actions: TABLE_ACTIONS;
};

const Cell = (props: Props) => {
    // const [text, setText] = useState(props.data.text);
    const [isShowedDropdown, setIsShowedDropdown] = useToggle(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    return (
        <div 
            // style={{textAlign: props.data.textAlign ? props.data.textAlign : "start"}} 
            key={props.index} 
            className="table_cell"
            onClick={
                (e)=>{
                    const { target } = e;

                    if(target instanceof HTMLElement && target.id !== "table_head_icon"){
                        textareaRef.current?.focus();
                    }
                }
            }
        >
            <div className={`text_element`}>
                <div className="decoTextarea">
                    <div 
                        style={{ position: "relative" }}>
                        <div 
                            className="decorated_text"
                            style={{textAlign: props.data.textAlign ? props.data.textAlign : "start"}} 
                        >
                            {/* <DecoratedTextInput content={text}  /> */}
                            <DecoratedTextInput content={props.data.text}   />
                        </div>

                        <TextareaAutosize 
                            ref={textareaRef}
                            id="text"
                            className="text"
                            autoComplete="off" 
                            spellCheck="false"
                            name="text" 
                            style={{textAlign: props.data.textAlign ? props.data.textAlign : "start"}} 
                            // value={text} 
                            value={props.data.text}
                            onChange={(e) => {
                                // setText(e.target.value);
                                props.actions.changeCellText(
                                    props.data.id, 
                                    props.rowIndex, 
                                    props.data.colIndex, 
                                    e.target.value.replace(/[|]/g, "").replace(/\u0001/g, ""), 
                                    props.data.order, 
                                    props.data.width, 
                                    props.data.textAlign
                                );
                            }}
                            onKeyDown={(e) => {
                                const {key} = e;
                                if( key === rowSeparator ) {
                                    e.preventDefault();
                                    return;
                                }
                            }}
                            // placeholder=""
                            autoFocus={false} 
                            // onPaste={handleClipboardEvent}
                            // onBlur={()=> props.edit_text(props.page_element.text[0].id, text)} 
                            // style={{ opacity: props.snapshot.isDragging? '0.5': '1' }} 
                        />
                    </div>
                </div>
            </div>
            
            <div className="table_head_icon" id='table_head_icon' >
                <BiDotsHorizontalRounded onClick={setIsShowedDropdown} />
            </div>
            
            {isShowedDropdown
                    ?  <>
                            <div className="overlay" onClick={()=>setIsShowedDropdown(false)}></div>
                            <div className="dropdown">
                                <div 
                                    className="item"
                                    onClick={()=>{
                                        setIsShowedDropdown(false);
                                        props.actions.insertRow(props.data.id,  props.rowIndex, props.data.colIndex, "top");
                                    }}
                                    style={{color: "#24292f", fontWeight: 600}}
                                >上に挿入</div>
                                <div 
                                    className="item"
                                    onClick={()=>{
                                        setIsShowedDropdown(false);
                                        props.actions.insertRow(props.data.id,  props.rowIndex, props.data.colIndex, "bottom");
                                    }}
                                    style={{color: "#24292f", fontWeight: 600}}
                                >下に挿入</div>
                                <div 
                                    className="item"
                                    onClick={()=>{
                                        setIsShowedDropdown(false);
                                        props.actions.insertColumn(props.data.id,  props.rowIndex, props.data.colIndex, "right");
                                    }}
                                    style={{color: "#24292f", fontWeight: 600}}
                                >右に挿入</div>
                                <div 
                                    className="item"
                                    onClick={()=>{
                                        setIsShowedDropdown(false);
                                        props.actions.insertColumn(props.data.id,  props.rowIndex, props.data.colIndex, "left");
                                    }}
                                    style={{color: "#24292f", fontWeight: 600}}
                                >左に挿入</div>
                                <div 
                                    className="item"
                                    onClick={()=>{
                                        setIsShowedDropdown(false);
                                        props.actions.changeTextAlign(props.data.id, props.data.colIndex, "start");
                                    }}
                                    style={{color: "#24292f", fontWeight: 600}}
                                >左寄せ</div>
                                <div 
                                    className="item"
                                    onClick={()=>{
                                        setIsShowedDropdown(false);
                                        props.actions.changeTextAlign(props.data.id,  props.data.colIndex,  "center");
                                    }}
                                    style={{color: "#24292f", fontWeight: 600}}
                                >中央寄せ</div>
                                                    <div 
                                    className="item"
                                    onClick={()=>{
                                        setIsShowedDropdown(false);
                                        props.actions.changeTextAlign(props.data.id,  props.data.colIndex,  "end");
                                    }}
                                    style={{color: "#24292f", fontWeight: 600}}
                                >右寄せ</div>
                                
                                <div 
                                    className="item"
                                    onClick={()=>{
                                        props.actions.deleteRow(props.data.id,  props.rowIndex, props.data.colIndex)
                                        setIsShowedDropdown(false);
                                    }}
                                    style={{color: "#f42115", fontWeight: 600}}
                                >行を削除</div>

                                <div 
                                    className="item"
                                    onClick={()=>{
                                        props.actions.deleteColumn(props.data.id,  props.rowIndex, props.data.colIndex)
                                        setIsShowedDropdown(false);
                                    }}
                                    style={{color: "#f42115", fontWeight: 600}}
                                >列を削除</div>
                            </div>
                        </>
                    : null
                }
        </div>
    )
};

export default Cell;