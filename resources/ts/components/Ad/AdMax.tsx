// https://zenn.dev/goshouhiro/articles/react-ninja-admax
import { useEffect } from "react";



// 広告タイプの型
type AdmaxAdType = {
    admax_id: string; // 広告ID
    type: string; // PC/SP切替広告なら"switch"
};
// PC/SP切替広告のReactコンポーネント
export const AdmaxSwitch: React.FC<{ id: string }> = (props) => {
    // 非同期タグ 

    useEffect(() => {
        // windowオブジェクトの広告リストを初期化
        if (!(window as any)["admaxads"]) (window as any)["admaxads"] = [];
        // 広告リストを取得
        const admaxads: AdmaxAdType[] = (window as any)["admaxads"];

        // 広告リストになかったら追加
        if (!admaxads.some(ad => ad.admax_id === props.id))
            admaxads.push({
                admax_id: props.id,
                // type: "switch"
                type: "banner"
            });

        // 外部JSを読み込んで広告リストを実際に表示
        const tag = document.createElement('script');
        tag.src = 'https://adm.shinobi.jp/st/t.js';
        tag.async = true;
        tag.type = "text/javascript";
        tag.charset = "utf-8";
        document.body.appendChild(tag);

        // アンマウント時にJSタグと広告情報を削除
        return () => {
            document.body.removeChild(tag);
            admaxads.splice(admaxads.findIndex(ad =>
                ad.admax_id === props.id), 1);
                (window as any)["__admax_tag__"] = undefined;
        }
    }, []);

    return (
        // <>        
        //     <div className="admax-ads" data-admax-id={props.id} style={{ display: "inline-block", width: "300px", height: "250px" }}></div>
        //     <script type="text/javascript">
        //         (admaxads = window.admaxads || []).push({admax_id: {props.id},type: "banner"});
        //     </script>
        //     <script type="text/javascript" charSet="utf-8" src="https://adm.shinobi.jp/st/t.js" async></script>
        // </>

            
        <div
            // className="admax-switch"
            className="admax-ads"
            data-admax-id={props.id}
            // style={{ display: "inline-block" }} 
            style={{ display: "inline-block", width: "300px", height: "250px" }}
        />

    )
}