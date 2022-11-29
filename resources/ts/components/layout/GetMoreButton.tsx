import React from 'react';

type Props = {
    nextPageLink: string;
    gerMoreFunc: Function;
};

const GetMoreButton = (props: Props) => {

    const gerMoreFunc = async () => {
        await props.gerMoreFunc();
    };

    return (
        <React.Fragment>
            {props.nextPageLink &&
                <div
                    className="getMoreBtn"
                    onClick={gerMoreFunc}
                >
                    さらに読み込む
                </div>
            }  
        </React.Fragment>
    )
};

export default GetMoreButton;
