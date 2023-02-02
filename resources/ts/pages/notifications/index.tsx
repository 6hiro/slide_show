import { Helmet } from "react-helmet";

import { siteTitle } from "../../constants/site";



const Notifications = () => {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>お知らせ / {siteTitle}</title>
                <meta
                    name="description"
                    content={`お知らせ`}
                />
            </Helmet>

            <div className="notifications_container">
                <div className="notifications_no_contents">
                    お知らせはありません。
                </div>
            </div>

        </div>
    )
};

export default Notifications;