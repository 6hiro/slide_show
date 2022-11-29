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
                    <strong>Slides</strong> with <strong>Voice</strong>
                </h1>
                <div className="title_description">
                    音声 ( Voice ) と スライド ( Slide ) を掛け合わせたコンテンツの投稿と、
                    その投稿の内容を切り取り、メモを残せる機能を提供しています。
                </div>
                {/* <div className="title_description">
                    <p>
                        <span>
                            
                        </span>
                    </p>
                </div> */}

                <div className="content_container">
                    <h2 className="sub_title">Vlide (ヴライド)</h2>
                    <div className="description">
                        <p>
                            <span>
                                Vlide は、<strong>音声 ( Voice )</strong> と <strong>スライド ( Slide )</strong> を掛け合わせたコンテンツを指します。
                            </span>
                        </p>
                        <p>
                            <span>
                                ナレーション付きスライドとしての投稿、もしくは、音声をメインとしたスライド付きラジオとしての投稿を想定しています。
                            </span>
                        </p>
                        <p>
                            <span>
                                スライドショーの時間を指定しなければ、ブログのように利用することも可能です。
                            </span>
                        </p>
                    </div>
                </div>


                <div className="content_container">
                    <h2 className="sub_title">Clip (クリップ)</h2>
                    <div className="description">
                        <p>
                            <span>
                                Clip は、Vlide の内容を切り取り、メモを残せる機能です。
                            </span>
                        </p>
                        <p>
                            <span>
                                他のユーザーの Clip をシェアすることもできます。
                            </span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
};
export default About;