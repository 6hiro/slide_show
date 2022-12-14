import { BiHeadphone, BiPlus, BiQuestionMark, BiX } from 'react-icons/bi';
import useToggle from '../../../hooks/useToggle';

const Help = () => {
    // NAVBAR 
    const [on, toggle] = useToggle(false);

    return (
        <div className="help">
            <div className={`${on ? "overlay" : ""}`}  onClick={toggle}></div>

            <div className={`help_menu ${on && "activeMenubar"}`} id="help_menu">
                {/* <h1 className={"help_title"}>HELP</h1> */}
                <h3 className={"help_sub_title"}>スライドショーの作り方</h3>
                <br />
                <ul>
                    <li>
                        <p>1. スライドに表示させたい文字を、<strong>---</strong> と <strong>---</strong> で上下囲みます。</p>
                    </li>
                    <li><br /></li>
                    <li>
                        <p>2. 下の<strong>---</strong>に続けて、
                        <strong>0:01</strong>のようにスライドを表示させる時間を入力します。
                        <strong>01</strong> や <strong>1</strong> のように省略することもできます。</p>
                    </li>
                    <li><br /></li>
                    <li>
                        <p>
                            3. テキスト以外のスライドを作成したい場合は、上の<strong>---</strong>に続けて、
                            <strong>h1</strong>のような特殊コードを入力します。
                        </p>
                        <details style={{marginTop: "10px"}}>
                            <summary 
                                style={{
                                    paddingLeft: "16px",
                                    color: "#24292f", 
                                    // opacity: "0.5",
                                    fontWeight: "600", 
                                    userSelect:"none", 
                                    cursor:"pointer",
                                    outline: "none", 
                                    marginBottom:"5px"
                                }}
                            >
                                特殊コード一覧
                            </summary>

                            {/* h1 */}
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>h1</strong>: 見出し１スライド
                            </p>

                            {/* h2 */}
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>h2</strong>: 見出し２スライド
                            </p>

                            {/* toc */}
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>toc</strong>: 目次スライド
                            </p>

                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>hr</strong>: セパレートスライド
                            </p>

                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>point</strong>: ポイントスライド
                            </p>

                            {/* message */}
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>message</strong>: 注意文スライド
                            </p>

                            {/* alert */}
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong >alert</strong>: 警告文スライド
                            </p>
                            
                            {/* blockquote */}
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>blockquote</strong>: 引用スライド
                            </p>
                            <p style={{paddingLeft: "52px"}}>
                                <span>blockquoteの後に</span>
                                <strong style={{padding:"0 8px"}}>:</strong>
                                <span>に続けて、引用元を書くことができます。</span>
                            </p>
                            <p style={{paddingTop: "5px", paddingLeft: "52px"}}>
                                <span>例：</span>
                                <code style={{ background: "#eee", padding:"2px" }}>blockquote:by George Orwell (Part 1, Chapter 1).</code>
                            </p>

                            {/* Code */}
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>code</strong>: コードスライド
                            </p>
                            <p style={{paddingLeft: "52px"}}>
                                <span>コードにハイライトを当てる場合、codeの後に</span>
                                <strong style={{padding:"0 8px"}}>-</strong>
                                <span>に続けて、言語 ( javascript など ) を記述してください。</span>
                            </p>
                            <p style={{paddingTop: "5px", paddingLeft: "52px"}}>
                                <span>codeの後に</span>
                                <strong style={{padding:"0 8px"}}>:</strong>
                                <span>に続けて、ファイル名を書くことができます。</span>
                            </p>
                            <p style={{paddingTop: "5px", paddingLeft: "52px"}}>
                                <strong style={{padding:"0 8px"}}>-</strong>
                                <span>と</span>
                                <strong style={{padding:"0 8px"}}>:</strong>
                                <span>を同時に記述できます。</span>
                            </p>
                            <p style={{paddingTop: "5px", paddingLeft: "52px"}}>
                                <span>例：</span>
                                <code style={{ background: "#eee", padding:"2px" }}>code-javascript:app.js</code>
                            </p>
                            
                            {/* youtube */}
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>youtube</strong>: Youtubeスライド
                            </p>
                            <p style={{paddingLeft: "52px"}}>
                                <strong >```</strong><span> 内にURLを記述してください。</span>
                            </p>
                        </details>
                    </li>
                    <li><br /></li>
                    <li>
                        <p>
                            4. テキストスライドでは、Markdown記法に用いて、文字を装飾することができます。
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
                                対応しているMarkdwon記法
                            </summary>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>太字</strong>: **テキスト**
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>斜体</strong>: _テキスト_
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>コード</strong>: `テキスト`
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>打ち消し線</strong>: ~~テキスト~~
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>リンク</strong>: [リンクテキスト](URL)
                            </p>
                            <p style={{paddingLeft: "40px", margin:"8px 0"}}>
                                <strong>画像埋め込み</strong>: ![代替テキスト](画像のURL)
                            </p>

                        </details>
                    </li>
                    <li><br /></li>
                    <li>
                        <h4>例：</h4>
                    </li>
                    <li>
                        <pre>
                            <p>---h1</p>
                            <p>Vlideへ、ようこそ。</p>
                            <p>---0:01</p>
                            <p>---</p>
                            <p>**音声**と**スライド**掛け合わせたコンテンツを投稿できます。</p>
                            <p>---4</p>
                            <p>---message</p>
                            <p>スライドの内容を切り取り、メモに残す機能もあります。</p>
                            <p>---01:02</p>
                        </pre>
                    </li>
                    <li><br /></li>


                    <li>
                        <p>5. スライドショーの時間を指定します。時間が 00:00 の場合、スライドプレイヤーは表示されません。</p>
                    </li>
                </ul>

                
                <br/>
                <h3 className="help_sub_title" >音声の挿入</h3>
                <div style={{padding: "8px 0"}}>
                    <span style={{ margin: "0 10px 0 2px", padding:"3px 20px", fontSize:"10px", border:"2px solid #24292f", borderRadius: "8px" }}>
                        <BiPlus />
                        <BiHeadphone />
                    </span>
                    を押して、音声ファイルをアップロードして下さい。
                </div>
                {/* <p style={{margin: "10px 10px 0 2px"}}>
                    アップロードできる音声ファイルの容量制限
                </p> */}
                <p style={{margin: "10px 10px 0 2px"}}>
                    15 メガバイトまでの音声ファイルをアップロードすることが可能です。
                </p>
                <p style={{margin: "10px 10px 0 2px"}}>
                    アップロード可能な音声ファイルは mp3, aac です。
                </p>
            </div>

            <div className={`help_button ${on && "active"}`} id="help_button" onClick={toggle}>
                {!on ? <BiQuestionMark /> : <BiX />}
            </div>
        </div>
    );
};

export default Help;