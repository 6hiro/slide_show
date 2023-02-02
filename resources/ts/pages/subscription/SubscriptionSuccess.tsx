import { useNavigate } from 'react-router-dom';

const SubscriptionSuccess = () => {
    const navigate = useNavigate();
    return (
        <div 
            style={{
                // background: 'linear-gradient(45deg, #fa4e53, #fa4e53, #fff, #5cb5da, #5cb5da)',
                // background: '#e4007f',
                // background: "repeating-linear-gradient(45deg, #24292f, #e4007f, #e4007f, #e4007f, #24292f 100%)",
                background: '#5cb5da',
                height: 'calc(100vh - 50px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    background: "#fff",
                    width: '300px',
                    height: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: "3px",
                    // padding: "10px"
                }}
            >
                <h3 style={{textAlign: "center", padding: "20px 0 10px"}}>
                    お支払いを受け取りました。
                </h3>
                <p style={{textAlign: "center", padding: "0px 20px 20px", color: ""}}>
                    標準プランをご利用いただき、ありがとうございます。
                </p>

                <button onClick={() => navigate('/settings')}
                    style={{
                        margin: "10px auto 15px auto", 
                        display: "block",
                        textAlign: "center",
                        width: "150px",
                        // height: "30px",
                        background: "#24292f",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 0 8px -5px rgb(0 0 0 / 47%)",
                        borderRadius: "5px",
                        padding: "8px",
                        fontSize: "15px",
                        cursor: "pointer"
                    }} 
                >
                    設定画面に戻る
                </button>

            </div>
        </div>
    );
};

export default SubscriptionSuccess;