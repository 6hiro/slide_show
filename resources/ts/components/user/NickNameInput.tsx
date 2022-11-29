import React from 'react'

type Props = {
    nickName: string;
    setNickName: React.Dispatch<React.SetStateAction<string>>;
};

const NickNameInput = (props: Props) => {
    const maxLength = 40;
    return (
        <div className="form_item">
            <input 
                type="text" 
                value={props.nickName}
                onChange={e => props.setNickName(e.target.value)}
                placeholder='ユーザーネーム' 
                required 
                // autoFocus 
                maxLength={40}
            />

            <div className="text_count" >
                {/* <BiMessageError /> */}
                {/* <span> タイトルは 40 文字以内で入力できます</span> */}
                {props.nickName.length} / {maxLength}

            </div>
        </div>
    )
};

export default NickNameInput;