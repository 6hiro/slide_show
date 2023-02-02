import { useCallback } from 'react'
import { BiChevronDown } from 'react-icons/bi';
import TextareaAutosize from 'react-textarea-autosize';

import useToggle from '../../../hooks/useToggle';
import { codeLanguages } from '../../../constants/language';
import { CONTENT_EDITOR_ACTIONS } from '../../../hooks/useContentEditor';
import { handleFocus } from './event/onFocus';



type Props = {
    id: string;
    text: string;
    type: string;
    actions: CONTENT_EDITOR_ACTIONS;
};

const Code = (props: Props) => {
    // code:main.py?python
    const setLanguage = useCallback((type:string) => {
        return props.type.split("?")[1] 
            ? props.type.split("?")[1].split(":")[0]
            : "";
    },[props.type]);
    const setFileName = useCallback((type:string) => {
        return props.type.split(":")[1] 
            ? props.type.split(":")[1].split("?")[0]
            : "";  
    },[props.type]);

    const [isShowedLanguageMenu, setIsShowedLanguageMenu] = useToggle(false);

    return (
        <>
            <div className="code_block_element">
                <div className="code_block_filename_container">
                    <input 
                        className="code_block_filename"
                        autoComplete="off" 
                        onChange={(e) => {
                            // console.log(e.target.value.replace(/[?]/g, "").replace(/[\:]/g, ""));
                            props.actions.changeType(
                                props.id, 
                                `code:${e.target.value.replace(/[?]/g, "").replace(/[\:]/g, "")}?${setLanguage(props.type)}`
                                // `code:${e.target.value}?${setLanguage(props.type)}`
                            );
                        }} 
                        onKeyDown={(e) => {
                            const {key} = e;
                            if( key === '?'  || key === ':' ) {
                                e.preventDefault();
                                // return;
                            }
                        }}
                        placeholder="ファイル名" 
                        value={setFileName(props.type)} 
                    />
                </div>
                <pre 
                    tabIndex={0} 
                    data-language={setLanguage(props.type) ? "language-"+setLanguage(props.type) : ""} 
                    data-start="0" 
                    className={setLanguage(props.type) ? "language-"+setLanguage(props.type) : ""} 
                    style={{
                        outline: "none",
                        maxHeight: "65vh",
                    }}
                >
                    <TextareaAutosize 
                        id="text"
                        className="code_block"
                        autoComplete="off" 
                        spellCheck="false"
                        name="text" 
                        value={props.text} 
                        onChange={(e) => props.actions.changeContent(props.id, e.target.value)} 
                        placeholder="コード"
                        autoFocus={false} 
                        onFocus={()=>{handleFocus(props.id)}}
                    />
                </pre>

                <div className="code_block_language_container">
                    <div
                        className="code_block_language"
                        onClick={setIsShowedLanguageMenu} 
                    >
                        {setLanguage(props.type) ? codeLanguages.find( lang =>lang.lang === setLanguage(props.type))?.title  : "選択なし"}
                    </div>
                    <BiChevronDown className="chevron_down" onClick={setIsShowedLanguageMenu} />

                    {isShowedLanguageMenu
                        ? <div className="dropdown">
                            <div 
                                className={`item ${setLanguage(props.type)==="" ? "active_item" : ""}`}
                                key={"no-lang"}
                                onClick={()=>{
                                    props.actions.changeType(
                                        props.id, 
                                        `code:${setFileName(props.type)}?${""}`
                                    );
                                    setIsShowedLanguageMenu(false);
                                }}
                            >
                                選択なし
                            </div>
                            {codeLanguages.map((lang , i) =>{
                                return <div 
                                    className={`item ${setLanguage(props.type)===lang.lang ? "active_item" : ""}`}
                                    key={i+"lang"} 
                                    onClick={()=>{
                                        props.actions.changeType(
                                            props.id, 
                                            `code:${setFileName(props.type)}?${lang.lang}`
                                        );
                                        setIsShowedLanguageMenu(false);
                                    }}
                                >
                                    {lang.title}
                                </div>
                            })}
                        </div>
                        : null
                    }

                </div>
            </div>
        </>
    )
};

export default Code;