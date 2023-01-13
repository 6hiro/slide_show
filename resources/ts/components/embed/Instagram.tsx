import React, { useEffect, useState } from 'react';



const Instagram = ({src}: {src: string}) => {
    // const [didMount, setDidMount] = useState(false);
    useEffect(() => {
        // setDidMount(true);

        if (window.instgrm !== undefined) {
            // API呼び出しの参考: https://developers.facebook.com/docs/instagram/oembed
            window.instgrm.Embeds.process();
        }
      }, []);
    return (
        <div>
        </div>
    )
};

export default Instagram;