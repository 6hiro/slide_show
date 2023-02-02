import { Helmet } from "react-helmet";

import { siteTitle } from "../../constants/site";



const About = () => {

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{siteTitle}について / {siteTitle}</title>
                <meta
                    name="description"
                    content={`${siteTitle} について`}
                />
            </Helmet>

            <div className="about_container">
                <h1 className="title">
                    {siteTitle} について
                    {/* <strong>Slides</strong> with <strong>Voice</strong> */}
                </h1>
                <div className="title_description">
                    音声 ( Voice ) と スライド ( Slide ) を掛け合わせたコンテンツの投稿と、
                    その投稿の内容を切り取り、メモを残せる機能を提供しています。また、
                    複数の投稿をひとまとめにし、限定公開できる機能も提供しています。
                </div>
                {/* <div className="title_description">
                    <p>
                        <span>
                            
                        </span>
                    </p>
                </div> */}

                <div className="content_container">
                    <h2 className="sub_title">投稿</h2>
                    <div className="description">
                        <p>
                            <span>
                                <strong>音声 ( Voice )</strong> と <strong>スライド ( Slide )</strong> を掛け合わせたコンテンツを投稿できます。
                            </span>
                        </p>
                        <p>
                            <span>
                                ナレーション付きスライドとしての投稿、もしくは、補助スライド付き音声コンテンツとしての投稿を想定しています。
                                {/* ナレーション付きスライドとしての投稿、もしくは、音声をメインとしたスライド付きラジオとしての投稿を想定しています。 */}
                            </span>
                        </p>
                        <p>
                            <span>
                                スライドショーの時間を指定しない場合、ブログのように利用することも可能です。
                            </span>
                        </p>
                        <p>
                            <span>
                                無料アカウントは、1 アカウント、 5 件まで投稿できます。
                            </span>
                        </p>
                    </div>
                </div>


                <div className="content_container">
                    <h2 className="sub_title">クリップ</h2>
                    <div className="description">
                        <p>
                            <span>
                                クリップ は、投稿 の内容を切り取り、メモを残せる機能です。
                            </span>
                        </p>
                        <p>
                            <span>
                                他のユーザーの クリップ をシェアすることもできます。
                            </span>
                        </p>
                        <p>
                            <span>
                                無料アカウントは、1 アカウント、 20 つまで クリップ できます。
                            </span>
                        </p>
                    </div>
                </div>

                <div className="content_container">
                    <h2 className="sub_title">ブック</h2>
                    <div className="description">
                        <p>
                            <span>
                                ブック は、投稿 （ 非公開も含む ）をひとまとめにし、限定公開できる機能です。
                            </span>
                        </p>
                        <p>
                            <span>
                                ブックは、URL を知っている人にのみ公開され、投稿者以外は チケット をゲットしないと内容を見ることができません。
                            </span>
                        </p>
                        <p>
                            <span>
                                {/* 現在、無料アカウントでは作成できません。 */}
                                無料アカウントは、1 アカウント、 1 つまで ブック を作成できます。1 ブックあたり 100 枚まで チケット を配布できます。
                            </span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
};
export default About;