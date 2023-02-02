import { memo } from "react";



const InitialLoadingScreen = memo(() => {
    return (
        <div className='is_loading__screen'>
            <div className="content__main">
                <img src='/images/Logo.png' width={220} height={220} alt="Vlides logo" />
                <div className="img_cover"></div>
            </div>
        </div>
    )
});

export default InitialLoadingScreen;