import React from 'react';
import { BiSearch } from 'react-icons/bi';
    
const SearchForm: React.FC<{
    keyword:string, 
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    section: string,
    setSection: React.Dispatch<React.SetStateAction<string>>;
    order: string
    setOrder: React.Dispatch<React.SetStateAction<string>>;
    search: Function;
}> = (props) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.search();
    };

    return (
        <form
            className="search__form__container"
            onSubmit={handleSubmit}
        >
            <div className="search__form">
                <input 
                    type="text" 
                    placeholder='キーワード検索'
                    className="search__form__input"
                    value={props.keyword}
                    onChange={(e) => props.setKeyword(e.target.value)}
                    maxLength={50}
                    autoFocus={false}

                />
                <button 
                    type='submit'
                    disabled={!props.keyword.trim() || !props.order}
                    className="seach_button"
                >
                    <BiSearch />
                </button>
            </div>
            
            <div className="search__state">
                <input 
                    type="radio" name="state" id="dot-1" 
                    checked={props.order==="top"} 
                    onChange={() => props.setOrder("top")} 
                />
                <input 
                    type="radio" name="state" id="dot-2" 
                    checked={props.order==="latest"} 
                    onChange={() => props.setOrder("latest")}
                />

                <label 
                    htmlFor="dot-1"
                    onClick={()=>props.setOrder("top")}
                >
                    <span className={`dot ${props.order==="top" ? "checked" : ""}`}></span>
                    <span className="search__form__state_top" >トップ</span>
                </label>

                <label 
                    htmlFor="dot-2"
                    onClick={()=>props.setOrder("latest")}
                >
                    <span className={`dot ${props.order==="latest" ? "checked" : ""}`}></span>
                    <span className="search__form__state_latest" >最近</span>
            </label>
            </div>

            <div className="navigation" >
                <div
                    className={`section ${props.section==="vlide" ? "active" : ""}`}
                    onClick={async() => {
                        props.setSection("vlide");          
                    }}
                >
                    投稿
                </div>

                <div
                    className={`section ${props.section==="clip" ? "active" : ""}`}
                    onClick={() => {
                        props.setSection("clip");
                    }}
                >
                    クリップ
                </div>

                <div
                    className={`section ${props.section==="user" ? "active" : ""}`}
                    onClick={async() => {
                        props.setSection("user");                   

                    }}
                >
                    ユーザー
                </div>
                
            </div>

        </form>
    )
};
    
export default SearchForm;