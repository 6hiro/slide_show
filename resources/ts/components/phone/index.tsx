const Phone = ({imgSrc}: {imgSrc: string}) => {
    return (
        <div className="phone">
            <div className="phone__inner">
                <div className="head">
                    <div className="audio"></div>
                    <div className="camera"></div>
                </div>

                <div className="img_container">
                    <img src={imgSrc} alt={"about vlides"} width={250} height={460} />
                    <div className="img_cover"></div>
                </div>
            </div>
        </div>
    )
};

export default Phone;