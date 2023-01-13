import { useEffect, useRef } from 'react';



const Twitter = ({src}: {src: string}) => {
    const containerRef = useRef(null); // コンポーネントのルートとなる要素を取得

    useEffect(()=>{
        // @ts-ignore 型定義ファイルを用意したが、FireFox でエラーが出たので記述
        if (window.twttr !== undefined && containerRef.current) {
            window?.twttr.widgets.load(containerRef.current); // ツイートの埋め込みを実行
        }
    }, [])
   
    return (
        <div ref={containerRef}>
            <blockquote className="twitter-tweet">
                <a href={src}></a>
            </blockquote>
        </div>
    )
};



export default Twitter;