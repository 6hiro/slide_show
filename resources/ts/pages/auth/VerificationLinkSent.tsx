import { Helmet } from "react-helmet";

import { siteTitle } from "../../constants/site";


const VerificationLinkSent = () => {

    return (
        <div style={{ height:"50vh", display:"flex", alignItems: "center", justifyContent: "center", padding:"10px" }}>
            <Helmet>
                <meta charSet="utf-8" />
                <title> メールを確認してください。 / {siteTitle}</title>
                <meta
                    name="description"
                    content={`${siteTitle} について`}
                />
            </Helmet>

            <div style={{width: "90vw", maxWidth: "500px"}}>
                ご本人様確認のため、ご登録いただいたメールアドレスに、
                本登録のご案内のメールが届きます。
                <br/>
                <br/>
                そちらに記載されているURLにアクセスし、
                アカウントの本登録を完了させてください。
            </div>
        </div>
    )
}

export default VerificationLinkSent;