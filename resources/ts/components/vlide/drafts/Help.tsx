import { BiHeadphone, BiImage, BiMenu, BiPlus, BiQuestionMark, BiTagAlt, BiTime, BiX } from 'react-icons/bi';

import useToggle from '../../../hooks/useToggle';



const Help = () => {
    // NAVBAR 
    const [on, toggle] = useToggle(false);

    return (
        <div className="help">
            <div className={`${on ? "overlay" : ""}`}  onClick={toggle}></div>

            <div className={`help_menu ${on && "activeMenubar"}`} id="help_menu">
                <h3 className={"help_sub_title"}>スライドショーの作り方</h3>
                <br />
                <ul>
                    <li>
                        <p>1. ブロックを追加する場合、ブロック横の <strong><BiPlus/></strong> クリックし、ブロックのタイプと時間を指定してください。</p>
                    </li>
                    <li><br /></li>
                    <li>
                        <p>2. ブロックのタイプを変更する場合、ブロック横の <strong><BiMenu/></strong> をクリックし、タイプを指定してください。</p>
                    </li>
                    <li><br /></li>
                    <li>
                        <p>3. ブロックを表示する時間は、ブロック横の時間をクリックし、指定してください。</p>
                    </li>
                    <li><br /></li>
                    <li>
                        <p>
                            4. ブロックのタイプが <strong>テキスト、引用文、注意文、警告文</strong> のいずれかの場合では、文字を装飾することができます。
                        </p>
                        <details style={{marginTop: "10px"}}>
                            <summary 
                                style={{
                                    paddingLeft: "16px",
                                    color: "#24292f", 
                                    fontWeight: "600", 
                                    userSelect:"none", 
                                    cursor:"pointer",
                                    outline: "none", 
                                    marginBottom:"5px"
                                }}
                            >
                                装飾一覧
                            </summary>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>太字</strong>: *テキスト*
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>斜体</strong>: _テキスト_
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>コード</strong>: `テキスト`
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>打ち消し線</strong>: ~テキスト~
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>リンク</strong>: [リンクテキスト](URL)
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>リンクカード</strong>: ?[代替テキスト](URL)
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>画像埋め込み</strong>: ![代替テキスト](画像のURL)
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>※ URL は、https:// から始まる必要があります。</p>

                        </details>
                    </li>
                    <li><br /></li>
                    <li>
                        <p>5. スライドショーの時間は、編集画面のヘッダーにある<strong><BiTime/></strong> をクリックし、指定してください。時間が 0:00 の場合、スライドプレイヤーは表示されません。</p>
                    </li>
                </ul>

                
                <br/>
                <h3 className="help_sub_title" >音声の挿入</h3>
                <div style={{padding: "8px 0"}}>
                    編集画面のヘッダーにある
                    <strong style={{ margin: "0 5px 0 2px", fontSize:"16px"}}> <BiHeadphone /> </strong>
                    を押して、音声ファイルをアップロードして下さい。
                </div>

                <br/>
                <h3 className="help_sub_title" >画像のアップロード</h3>
                <div style={{padding: "8px 0"}}>
                    編集画面のヘッダーにある
                    <strong style={{ margin: "0 5px 0 2px", fontSize:"16px"}}> <BiImage /> </strong>
                    を押して、画像ファイルをアップロードして下さい。
                </div>

                <br/>
                <h3 className="help_sub_title" >タグの変更</h3>
                <div style={{padding: "8px 0"}}>
                    編集画面のヘッダーにある
                    <strong style={{ margin: "0 5px 0 2px", fontSize:"16px"}}> <BiTagAlt /> </strong>
                    を押して、タグを変更して下さい。
                </div>
            </div>

            <div className={`help_button ${on && "active"}`} id="help_button" onClick={toggle}>
                {!on ? <BiQuestionMark /> : <BiX />}
            </div>
        </div>
    );
};

export default Help;